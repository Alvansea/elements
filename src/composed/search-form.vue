<template>
  <form ref="form d-inline-block" class="form-inline" @submit.prevent="search">
    <div class="input-group" :class="inputGroup">
      <input type="text" class="form-control" name="filter"
        v-model="filter" :placeholder="$attrs.placeholder || '查找'">
      <input type="hidden" name="filtered" value="1">
      <div class="input-group-append">
        <a class="btn btn-outline-secondary" v-if="filter" @click="clear"><i class="fa fa-times"></i></a>
        <button type="submit" class="btn btn-secondary">
          <i class="fa fa-search"></i>
        </button>
      </div>
    </div>
  </form>
</template>

<script>
  module.exports = {
    props: ['inputGroup'],
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