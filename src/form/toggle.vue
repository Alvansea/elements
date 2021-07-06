<template>
  <i role="button" :class="_icon" @click="toggle()"></i>
</template>

<script>
  module.exports = {
    props: ['value', 'reverse'],
    computed: {
      _icon: function() {
        if (!!this.value == !!this.reverse) {
          return 'fa fa-toggle-off text-muted'
        } else {
          return 'fa fa-toggle-on text-success'
        }
      }
    },
    methods: {
      toggle: function() {
        this.value = !this.value
        this.$emit('input', this.value)
      },
    }
  }
</script>