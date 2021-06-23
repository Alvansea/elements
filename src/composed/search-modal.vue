<template>
  <el-modal ref="searchModal" :title="title || '查找'" class="fade">
    <form class="form" method="GET" :action="api || ''">
      <el-form-field v-for="field in view.fields"
        v-if="!field.hidden || !field.hidden.call(searchOptions)"
        :data="searchOptions"
        :field="field"
        :options="view">
      </el-form-field>
      <input type="hidden" name="filtered" value="1">
      <div class="form-group text-right mt-3">
        <button type="submit" class="btn btn-sm btn-primary">确定</button>
      </div>
    </form>
  </el-modal>
</template>

<script>
  module.exports = {
    props: [
      'view', 'title', 'api'
    ],
    data: function() {
      return {
        searchOptions: this.$getQueryParams(),
      }
    },
    methods: {
      modal: function() {
        this.$refs.searchModal.modal()
      }
    }
  }
</script>