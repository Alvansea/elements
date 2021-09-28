<template>
  <div class="table-responsive">
    <table :class="_tableClass">
      <thead>
        <tr>
          <th v-for="col in view.columns" :style="col.style || ''">
            <template v-if="col.filter">
              <el-filter
                :label="col.label"
                :column="col.filter.attr || col.attr"
                :options="col.filter.options"
                :empty="col.filter.empty || col.filter.default"
                highlight="text-info"
                btn="text-dark"></el-filter>
            </template>
            <span v-else>{{ col.label }}</span>
          </th>
          <th v-if="!view.hide_row_buttons">操作</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="(item, index) in data">
          <tr
            is="el-table-row"
            :key="index"
            :data="item"
            :index="index"
            :view="view"
            @edit="$emit('edit', item, index)"
            @clone="$emit('clone', item, index)"
            @save="saveItem"
            @remove="removeItem">
            <!-- pass through scoped slots -->
            <template v-for="(index, scoped_slot_name) in $scopedSlots" v-slot:[scoped_slot_name]="slot_data">
              <slot :name="scoped_slot_name" v-bind="slot_data"></slot>
            </template>
            <!-- pass through normal slots -->
            <template v-for="(index, slot_name) in $slots" v-slot:[slot_name]>
              <slot :name="slot_name"></slot>
            </template>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script>
  const ResourceMixin = require('../script/ResourceMixin.js')
  module.exports = {
    props: [
      'data', 'view', 'api', 'save'
    ],
    mixins: [ResourceMixin],
    data: function() {
      return {
        params: this.$getQueryParams(),
      }
    },
    computed: {
      _tableClass: function() {
        return this.$resize(this.view.striped ? 'table table-striped' : 'table', this.view) + ' ' + (this.view.class || '')
      }
    },
    mounted: function() {
    },
    methods: {
      saveItem: function(item, index) {
        var self = this
        this.$save(item, index)
          .then(function(result) {
            self.$emit('save', item, index)
          })
          .catch(function(err) {
            g_alert(err)
            self.$emit('error', err)
          })
      },
      removeItem: function(item, index) {
        if (!confirm('请再次确认删除？')) {
          return;
        }
        item.deleted = !item.deleted
        this.saveItem(item, index)
      }
    }
  }
</script>