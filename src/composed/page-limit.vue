<template>
  <div class="btn-group d-inline-block">
    <a :class="cellClass(option)"
      v-for="option in options"
      @click="$filterBy('limit', option)">{{ option }}</a>
  </div>
</template>

<script>
  module.exports = {
    props: [
      'options', 'pagination'
    ],
    computed: {
      _limit: function() {
        var pagination = this.pagination || {}
        return this.$getQueryParams().limit || pagination.limit || 10
      }
    },
    methods: {
      cellClass: function(limit) {
        if (limit == this._limit) {
          return 'btn btn-secondary';
        } else {
          return 'btn btn-outline-secondary';
        }
      },
    }
  }
</script>