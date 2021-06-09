<template>
  <div class="list-group timespan">
    <a v-for="(timespan, index) in timespans"
      :class="timespanClass(timespan)"
      @click="select(timespan, index)">
      <span class="time-start" v-if="index == 0">{{ timespan.startLabel }}</span>
      <span class="time-end">{{ timespan.endLabel }}</span>
      <span class="comment">{{ timespan.comment }}</span>
    </a>
  </div>
</template>

<script>
  module.exports = {
    props: [
      'date',       // current date in 'YYYY-MM-DD', default today
      'bookings',    // bookings list
      'selection',  // pre-selected spans, require startTime and endTime
      'startTime',  // start time in 'H:mm', default '0:00'
      'endTime',    // start end in 'H:mm', default '23:59'
      'interval',   // span interval in minutes, default '60'
      'offset',     // time which is smaller than now + offset will be disabled
      'timePadding' // span within event padding time (minutes) will be disabled
    ],
    data: function() {
      return {
        timespans: [],
        minIndex: -1,
        maxIndex: -1,
        selected: false
      }
    },
    created: function() {
      this.render();
    },
    methods: {
      matchTime: function(booking, start, end) {
        if (booking.startTime && booking.endTime) {
          if (moment(booking.startTime).toDate() < end
            && moment(booking.endTime).toDate() > start) {
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }
      },

      toDate: function(timelabel) {
        var date = moment(this.date).toDate();
        if (isNaN(date)) {
          date = new Date();
        }
        var parts = timelabel.split(':');
        if (parts.length >= 1) {
          date.setHours(parts[0]);
          date.setMinutes(parts[1] || 0);
        }
        return date;
      },

      /* render timespans with status and bookings */
      render: function(data, selection) {

        var bookings = data || this.bookings || [];
        var curBooking = selection || this.selection || {};

        this.initTimespans();

        // offset will be calculated from 'now'
        var minTime = new Date();
        minTime.setMinutes(minTime.getMinutes() + (this.offset || 0));

        for (var i in this.timespans) {

          var span = this.timespans[i];
          var start = span.start;
          var end = span.end;

          if (start <= minTime) {
            span.disabled = true;
          }
          for (var j in bookings) {
            var booking = bookings[j];
            if (this.matchTime(booking, start, end) && booking._id != curBooking._id) {
              span.disabled = span.disabled || true;
              span.booking = booking;
              span.comment = '@' + booking._ticket._creator.realname + ': ' + booking._ticket.name;
              span.status = booking._ticket.status;
            } else {
              span.disabled = span.disabled || false;
            }
          }

          if (this.matchTime(curBooking, start, end)) {
            span.selected = true;
          }
        }
      },
      initTimespans: function() {

        this.timespans = [];

        var startTime = this.toDate(this.startTime || '0:0');
        var endTime = this.toDate(this.endTime || '24:00');
        var interval = this.interval || 60;

        var i = 0;
        while (true) {
          var start = new Date(startTime);
          start.setMinutes(startTime.getMinutes() + i * interval);
          var end = new Date(start);
          end.setMinutes(start.getMinutes() + interval);
          this.timespans.push({
            start: start,
            end: end,
            startLabel: moment(start).format('HH:mm'),
            endLabel: moment(end).format('HH:mm'),
            selected: false
          });
          if (end >= endTime) {
            break;
          }
          i++;
        }
        return this.timespans;
      },
      timespanClass: function(timespan) {
        if (timespan.disabled) {
          if (timespan.status == 'approved') {
            return 'list-group-item success';
          } else {
            return 'list-group-item bg-light';
          }
        } else if (timespan.selected) {
          return 'list-group-item selected';
        } else {
          return 'list-group-item';
        }
      },
      clearSelection: function() {
        this.minIndex = -1;
        this.maxIndex = -1;
        this.selected = false;

        for (var i in this.timespans) {
          this.timespans[i].selected = false;
        }
      },
      onSelected: function() {
        var selection = {
          selected: false
        };
        if (this.selected) {
          selection.selected = true;
          selection.start = this.date + ' ' + this.timespans[this.minIndex].startLabel;
          selection.end = this.date + ' ' + this.timespans[this.maxIndex].endLabel;
        }
        this.$emit('selected', selection);
      },
      select: function(span, index) {

        console.log('clicked', span)

        // span has event, show event details
        if (span.booking) {
          this.$emit('clicked', span.booking);
          return;
        }

        // only one span selected
        if (this.minIndex == this.maxIndex && this.minIndex >= 0) {

          // click the same span, clear the selection
          if (index == this.minIndex) {
            this.clearSelection();

            // click lower span
          } else if (index > this.minIndex) {
            this.maxIndex = index;
            for (var i = this.minIndex; i <= this.maxIndex; i++) {
              var item = this.timespans[i];
              if (item.disabled) {
                this.maxIndex = i - 1;
                break;
              }
              item.selected = true;
            }

            // click higher span
          } else {
            this.minIndex = index;
            for (var i = this.maxIndex; i >= this.minIndex; i--) {
              var item = this.timespans[i];
              if (item.disabled) {
                this.minIndex = i + 1;
                break;
              }
              item.selected = true;
            }
          }

          // first enabled span selected
        } else if (!span.disabled) {

          this.clearSelection();
          this.minIndex = index;
          this.maxIndex = index;
          this.timespans[index].selected = true;
          this.selected = true;
        }

        this.onSelected();
      }
    }
  }
</script>

<style scoped>
  .list-group.timespan {
    margin: 1em 0;
    padding-left: 2.5em;
  }

  .item-content .list-group.timespan {
    margin-top: 0;
    padding-left: 0;
  }

  .list-group.timespan .list-group-item {
    height: 2.4em;
    line-height: 2.4em;
    padding: 0;
    padding-left: 8px;
    text-align: center;
    font-size: 12px;
  }

  .list-group.timespan .list-group-item .time-start {
    position: absolute;
    left: -3.5em;
    top: -1em;
  }

  .list-group.timespan .list-group-item .time-end {
    position: absolute;
    left: -3.5em;
    bottom: -1.2em;
  }

  .list-group.timespan .list-group-item.disabled {
    background-color: #ccc;
  }

  .list-group.timespan .list-group-item.selected {
    background-color: #fc8602;
    border-color: #ccc;
  }

  .list-group.timespan .list-group-item.success {
    background-color: #40cc9d;
    border-color: #ccc;
  }

  .list-group.timespan .list-group-item.success .comment {
    color: #fff;
  }
</style>