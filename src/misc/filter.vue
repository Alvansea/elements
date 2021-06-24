<template>
  <div class="dropdown d-inline">
    <a type="button" data-toggle="dropdown" class="dropdown-toggle" :class="btn">
      <b :class="highlight" v-if="_selected">{{ _selected }}</b>
      <b v-else>{{ label }}</b>
      <span class="caret"></span>
    </a>
    <div class="dropdown-menu">
      <a class="dropdown-item" href="#" @click="$filterBy(column, '')" v-if="empty">{{ empty }}</a>
      <a class="dropdown-item" href="#" v-for="option in options"
        @click="$filterBy(column, option.value || option, !empty)">
        {{ option.name || option }}
      </a>
    </div>
  </div>
</template>

<script>
  module.exports = {
    props: [
      'btn', 'label', 'column', 'options', 'empty', 'highlight'
    ],
    computed: {
      _selected: function() {
        if (!this.options) {
          return null
        }
        var params = this.$getQueryParams()
        var currentVal = params[this.column]
        var currentLabel = ''
        this.options.forEach(function(option) {
          if (option.value == currentVal) {
            currentLabel = option.name
          }
        })
        return currentLabel
      }
    },
  }
</script>