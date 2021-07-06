<template>
  <div class="calendar-app">
    <div class="d-flex py-2 justify-content-between" :class="{ 'header-lite': mode == 'lite' }">
      <a href="javascript:;" @click="addMonth(-1)">
        <i class="fa fa-angle-double-left"></i>
        上个月
      </a>
      <a href="javascript:;" class="calendar-month" @click="gotoToday()">
        <strong>{{ moment(this.start).format('YYYY MMMM') }}</strong>
      </a>
      <a href="javascript:;" @click="addMonth(1)">
        下个月
        <i class="fa fa-angle-double-right"></i>
      </a>
    </div>
    <table :class="{'table' : mode =='table', 'w-100': mode == 'lite' }">
      <thead>
        <tr>
          <th class="text-center" v-for="weekday in weekdays">{{ weekday }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="week in weeks">
          <td v-for="cell in week" class="date-cell" :class="cellClass(cell)" @click="clickDate(cell.tag)">
            <a class="date-tag" :href="'#' + cell.tag">
              {{ cell.date.getDate() }}
            </a>
            <slot name="cell" v-bind="{ data: eventGroups[cell.tag] || [], tag: cell.tag }"></slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  module.exports = {
    props: ['mode', 'events', 'timestamp', 'default', 'hash'],
    data: function() {

      var anchor
      if (this.default) {
        anchor = new Date(this.default)
      } else if (this.hash && location.hash.length >= 11) {
        anchor = new Date(location.hash.slice(1))
      }
      if (!anchor || isNaN(anchor)) {
        anchor = new Date()
      }

      var start = new Date(anchor)
      start.setDate(1)

      return {
        start: start,
        today: this.getDateTag(new Date()),
        focus: this.getDateTag(anchor),

        weekdays: ['日', '一', '二', '三', '四', '五', '六'],
        weeks: [],
        eventGroups: {},
      }
    },
    watch: {
      events: function(newVal, oldVal) {
        this.renderEvents()
      }
    },
    mounted: function() {
      this.render()
      this.renderEvents()
    },
    methods: {
      render: function() {
        var cells = []
        var date = null
        var end = new Date(this.start.getFullYear(), this.start.getMonth() + 1, 0)

        /* init prev month tail */
        var weekDay = this.start.getDay()
        for (var i = 0; i < weekDay; i++) {
          date = new Date(this.start)
          date.setDate(this.start.getDate() - i - 1)
          cells.unshift({
            date: date,
            tag: this.getDateTag(date),
            curMonth: false
          })
        }

        /* init current month dates */
        var count = end.getDate() - this.start.getDate() + 1
        for (var i = 0; i < count; i++) {
          var date = new Date(this.start)
          date.setDate(this.start.getDate() + i)
          cells.push({
            date: date,
            tag: this.getDateTag(date),
            curMonth: true
          })
        }

        /* init next month head */
        weekDay = end.getDay()
        var left = 6 - weekDay
        if (left > 0) {
          for (var i = 0; i < left; i++) {
            var date = new Date(end);
            date.setDate(end.getDate() + i + 1)
            cells.push({
              date: date,
              tag: this.getDateTag(date),
              curMonth: false
            })
          }
        }

        this.weeks = []
        var week = []
        for (var i in cells) {
          week.push(cells[i])
          if (i % 7 == 6) {
            this.weeks.push(Object.assign([], week))
            week = []
          }
        }

        var range = {
          start: cells[0].tag,
          end: cells[cells.length - 1].tag
        }
        this.$emit('change', range)

      },
      renderEvents: function() {
        if (typeof (this.timestamp) != 'function') {
          return;
        }
        this.eventGroups = {}
        var events = this.events || []
        for (var i = 0; i < events.length; i++) {
          var timestamp = this.timestamp(events[i])
          if (timestamp) {
            var tag = this.getDateTag(timestamp)
            this.eventGroups[tag] = this.eventGroups[tag] || []
            this.eventGroups[tag].push(events[i])
          }
        }

        this.selectDate(this.focus)
      },
      getDateTag: function(date) {
        return moment(date).format('YYYY-MM-DD');
      },
      cellClass: function(cell) {
        return {
          'default': this.mode == 'table',
          'lite': this.mode == 'lite',
          'disabled': !cell.curMonth,
          'selected': cell.tag == this.focus,
          'today': cell.tag == this.today
        }
      },
      /* fix vue list render issue */
      refresh: function() {
        this.weeks.push(1);
        this.weeks.pop();
      },
      selectDate: function(tag) {
        this.focus = tag
        location.hash = '#' + this.focus
        this.refresh()
        this.$emit('select', tag, this.eventGroups[tag] || [])
      },
      clickDate: function(tag) {
        this.selectDate(tag)
        this.$emit('click', tag, this.eventGroups[tag] || [])
      },
      addMonth: function(num) {
        this.start.setMonth(this.start.getMonth() + num)
        location.hash = '#' + this.getDateTag(this.start)
        this.render()
      },
      gotoToday: function() {
        this.start = new Date()
        this.start.setDate(1)
        this.focus = this.getDateTag(new Date())
        location.hash = '#' + this.focus
        this.render()
      }
    }
  }
</script>

<style scoped>
  .calendar-app .header-lite a {
    color: #666;
    padding: 1em 1.5em;
  }

  .calendar-app .table {
    border-bottom: solid 1px #ccc;
  }

  .calendar-app .date-cell.default {
    padding: .33em;
    display: table-cell;
    width: 14%;
    height: 8em;
    vertical-align: top;
    cursor: pointer;
    border-left: solid 1px #ccc;
    border-right: solid 1px #ccc;
  }

  .calendar-app .date-cell.default .date-tag {
    display: inline-block;
    font-weight: bold;
  }

  .calendar-app .date-cell.default.disabled .date-tag {
    color: #ccc;
  }

  .calendar-app .date-cell.default.selected {
    background-color: #ffffcc;
  }

  .calendar-app .date-cell.today .date-tag {
    color: red;
  }

  .calendar-app .date-cell.lite {
    height: 4em;
    text-align: center;
    font-size: .9em;
  }

  .calendar-app .date-cell.lite .date-tag {
    display: inline-block;
    text-align: center;
    width: 2em;
    height: 2em;
    padding-top: .3em;
    font-weight: 400;
    border-radius: 50%;
    color: #666;
  }

  .calendar-app .date-cell.lite.disabled .date-tag {
    color: #ccc;
  }

  .calendar-app .date-cell.lite.today .date-tag {
    background-color: #999;
    color: #fff;
  }

  .calendar-app .date-cell.lite.selected .date-tag {
    background-color: red;
    color: #fff;
  }
</style>