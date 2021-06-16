<template>
  <div class="table-responsive">
    <table :class="_class">
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
                _class="text-dark"></el-filter>
            </template>
            <span v-else>{{ col.label }}</span>
          </th>
          <th v-if="!view.hideRowButtons">操作</th>
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
            :visible="true"
            @edit="$emit('edit', item, index)"
            @clone="$emit('clone', item, index)"
            @save="saveItem"
            @remove="removeItem">
            <!-- pass through scoped slots -->
            <template v-for="(_, scoped_slot_name) in $scopedSlots"
              #[scoped_slot_name]="slotData">
              <slot :name="scoped_slot_name" v-bind="slotData" />
            </template>

            <!-- pass through normal slots -->
            <template v-for="(_, slot_name) in $slots" #[slot_name]>
              <slot :name="slot_name" />
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
    template: '#DataTableTemplate',
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
      _class: function() {
        return this.$resize(this.view.striped ? 'table table-striped' : 'table', this.view)
      }
    },
    methods: {
      saveItem: function(item, index) {
        var self = this
        this.$save(item, index, function(err, result) {
          if (err) {
            g_alert(err)
            self.$emit('error', err)
          } else {
            self.$emit('save', item, index)
          }
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