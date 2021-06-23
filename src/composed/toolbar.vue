<template>
  <div class="toolbar d-flex flex-column flex-lg-row justify-content-between">
    <div class="mb-3">
      <a :class="$resize('btn btn-outline-secondary mr-1', view)"
        :href="_ref"
        v-if="_ref && view.ref !== false">
        <i class="fa fa-chevron-left"></i> 返回
      </a>
      <slot></slot>
    </div>
    <div class="d-flex align-items-center mb-3">
      <template v-if="view.limit !== false">
        <span :class="$resize('btn btn-info mr-1', view)">
          <b class="d-none d-sm-inline-block">总数：</b><b>{{ _count }}</b>
        </span>
        <el-page-limit :options="[10, 20, 100]" :pagination="pagination" :_class="$resize('btn-group mr-1', view)">
        </el-page-limit>
      </template>
      <template v-if="view.search !== false">
        <el-search-form :_class="$resize('input-group', view)" :placeholder="view.searchPlaceholder"></el-search-form>
      </template>
    </div>
  </div>
</template>

<script>
  module.exports = {
    props: ['view', 'pagination'],
    computed: {
      _filtered: function() {
        return this.$getQueryParams().filtered || false
      },
      _ref: function() {
        return ViewModels.ref || ''
      },
      _count: function() {
        var pagination = this.pagination || ViewModels.pagination || ViewModels.paginator || {}
        return pagination.count || 0
      }
    },
  }
</script>