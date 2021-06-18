<template>
  <div class="input-group">
    <input type="text"
      ref="picker"
      class="form-control"
      :class="_class"
      :name="name"
      :value="date"
      :required="required"
      :disabled="disabled">
    <div class="input-group-append">
      <span class="input-group-text text-secondary" @click="$refs.picker.focus()"><i
          class="fa fa-calendar-alt"></i></span>
      <slot></slot>
    </div>
  </div>
</template>

<script>
  module.exports = {
    template: '#DateTimePickerTemplate',
    props: [
      'value', 'required', 'disabled', 'format', 'default', 'name', '_class', 'enabledDates', 'minDate', 'maxDate', 'config'
    ],
    data: function() {
      return {
        picker: null,
        elem: null,
        localFormat: this.format || 'YYYY-MM-DD HH:mm',
        date: null
      }
    },
    watch: {
      value: function(newVal, oldVal) {
        this.date = this.parseValue(newVal);
      },
      minDate: function() {
        this.init()
      },
    },
    mounted: function() {
      this.date = this.parseValue(this.value);
      this.init()
    },
    methods: {
      init: function() {
        var minDate = this.minDate ? moment(this.minDate).format('YYYY-MM-DD') : null
        var maxDate = this.maxDate ? moment(this.maxDate).format('YYYY-MM-DD') : null
        var options = {
          format: this.localFormat,
          dayViewHeaderFormat: 'YYYY MMMM',
          locale: 'zh-cn',
          ignoreReadonly: true,
          icons: {
            time: 'fa fa-clock',
            date: 'fa fa-calendar',
            up: 'fa fa-chevron-up',
            down: 'fa fa-chevron-down',
            previous: 'fa fa-chevron-left',
            next: 'fa fa-chevron-right',
            today: 'fa fa-bookmark',
            clear: 'fa fa-trash',
            close: 'fa fa-remove'
          },
          // inline: true,
          enabledDates: this.enabledDates || [],
        }
        this.elem = $(this.$refs.picker)
        this.picker = this.elem.datetimepicker(options)
        this.elem.on("dp.change", this.onChange)
      },
      parseValue: function(val) {
        var date = val || this.default;
        if (date) {
          return moment(val || this.default || null).format(this.localFormat)
        } else {
          return '';
        }
      },
      onChange: function() {
        var date = $(this.$refs.picker).val();
        this.$emit('input', date)
      }
    }
  }
</script>

<style scoped>
  .bootstrap-datetimepicker-widget {
    width: 16em !important;
    padding-top: 1em !important;
  }

  .datepicker-days {
    width: auto;
    font-size: .85em;
  }

  .datepicker-days .table-condensed thead tr:first-child th {
    padding-bottom: .8em;
  }

  .datepicker-days .table-condensed tbody td {
    padding-top: .6em;
    padding-bottom: .6em;
  }
</style>