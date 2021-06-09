<template>
  <div class="date-picker" v-cloak>
    <div class="date-list d-flex flex-nowrap">
      <a
        v-for="date in dates"
        :id="date.label"
        :class="dateClass(date)"
        @click="selectDate(date.label)">
        {{ date.weekday }}<br>
        {{ date.label }}
      </a>
    </div>
  </div>
</template>

<script>
  module.exports = {
    props: [
      'count', 'dateOffset', 'parseHash', 'defaultDate'
    ],
    data: function() {
      var dates = this.initDates();
      return {
        dates: dates,
        curDate: null
      };
    },
    created: function() {
      if (this.parseHash) {
        var date = location.hash ? location.hash.slice(1) : this.dates[0].label;
        this.selectDate(date);

        var btnDate = $('#' + date)[0];
        btnDate && btnDate.scrollIntoView(true);
      }
    },
    methods: {
      initDates: function() {
        var count = this.count || 28;
        var dates = [];
        var today = new Date();
        var dateOffset = parseInt(this.dateOffset) || 0;

        moment.locale('zh-cn');

        for (var i = 0; i < count; i++) {
          var date = new Date();
          date.setDate(today.getDate() + (i + dateOffset));
          dates.push({
            date: date,
            label: moment(date).format('YYYY-MM-DD'),
            weekday: moment(date).format('dddd')
          });
        }
        return dates;
      },
      dateClass: function(date) {
        if (date.label == this.curDate) {
          return 'date-item active';
        } else {
          return 'date-item';
        }
      },
      selectDate: function(date) {
        location.hash = '#' + date;
        this.curDate = date;
        this.$emit('date-selected', date);
      }
    }
  }
</script>

<style scoped>
  .date-picker {
    display: block;
    width: 100%;
    overflow-x: scroll;
    overflow-y: none;
  }

  .date-list {
    display: block;
  }

  .date-list .date-item {
    display: block;
    float: left;
    min-width: 7em;
    border-left: solid 1px #ccc;
    padding: .4em .6em;
    text-align: left;
    cursor: pointer;
  }

  .date-list .date-item.active {
    background-color: #40cc9d;
    color: #fff;
  }
</style>