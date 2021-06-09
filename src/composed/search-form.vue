<template>
  <div class="d-inline-block">
    <form ref="form" class="form-inline" @submit.prevent="search">
      <div class="input-group" :class="$class">
        <input type="text" class="form-control" name="filter"
          v-model="filter" :placeholder="$placeholder || '查找'">
        <input type="hidden" name="filtered" value="1">
        <div class="input-group-append">
          <a class="btn btn-outline-secondary" v-if="filter" @click="clear"><i class="fa fa-times"></i></a>
          <button type="submit" class="btn btn-secondary">
            <i class="fa fa-search"></i>
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
  module.exports = {
    props: ['$class', '$placeholder'],
    data: function() {
      return {
        filter: g_getQueryParams().filter || '',
      }
    },
    methods: {
      search: function() {
        var filtered = this.filter ? 1 : ''
        location.href = '?filtered=' + filtered + '&filter=' + encodeURIComponent(this.filter)
      },
      clear: function() {
        this.filter = ''
        this.search()
      }
    }
  }
</script>