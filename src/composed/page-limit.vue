<template>
  <div class="d-inline-block">
    <div class="btn-group" :class="_class">
      <a :class="className(option)"
        v-for="option in options"
        @click="$filterBy('limit', option)">{{ option }}</a>
    </div>
  </div>
</template>

<script>
  module.exports = {
    props: [
      'options', '_class', 'pagination'
    ],
    computed: {
      _limit: function() {
        var pagination = this.pagination || ViewModels.pagination || ViewModels.paginator || {}
        return this.$getQueryParams().limit || pagination.limit || 10
      }
    },
    methods: {
      className: function(limit) {
        if (limit == this._limit) {
          return 'btn btn-secondary';
        } else {
          return 'btn btn-outline-secondary';
        }
      },
    }
  }
</script>