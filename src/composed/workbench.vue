<template>
  <div>
    <el-toolbar :view="view.toolbar"
      :pagination="view.table && view.table.pagination"
      v-if="view.toolbar">
      <a :class="$resize('btn btn-outline-primary mr-1', view.toolbar)"
        v-if="!view.toolbar.hideAddButton"
        @click="addItem()">
        <i class="fa fa-plus"></i> 添加</a>
      <slot name="toolbar"></slot>
    </el-toolbar>

    <div class="table-responsive" v-if="view.table">
      <el-table
        v-if="view.table"
        :data="items"
        :view="view.table"
        :api="api"
        :save="save"
        @edit="editItem"
        @clone="cloneItem"
        @save="onSave"
        @remove="onRemove">
        <!-- pass through scoped slots -->
        <template v-for="(_, slot_name) in $scopedSlots" #[slot_name]="slotData">
          <slot :name="slot_name" v-bind="slotData"></slot>
        </template>
        <!-- pass through normal slots -->
        <template v-for="(_, slot_name) in $slots" #[slot_name]>
          <slot :name="slot_name"></slot>
        </template>
      </el-table>
    </div>

    <el-pagination :pagination="view.table && view.table.pagination"></el-pagination>

    <el-modal ref="editModal" title="编辑" class="fade" size="lg">
      <el-form
        v-if="view.form"
        :data="current"
        :view="view.form"
        :api="api"
        :save="save"
        @save="onSave"
        @cancel="cancelEdit">
      </el-form>
    </el-modal>
  </div>
</template>

<script>
  const ResourceMixin = require('../script/ResourceMixin.js')
  module.exports = {
    props: [
      'data', 'view', 'save', 'api', 'hidden'
    ],
    mixins: [ResourceMixin],
    data: function() {
      return {
        current: {},
        index: -1,
        items: this.data || []
      }
    },
    created: function() {
      this.view.options = this.view.options || {};
    },
    mounted: function() {
      if (!this.api && !this.save) {
        g_alert('[Workbench] missing "api" or "save" prop!');
      }
    },
    watch: {
      data: function(newVal, oldVal) {
        this.items = newVal || [];
      }
    },
    methods: {
      addItem: function() {
        if (this.view.toolbar && typeof (this.view.toolbar.add) == 'function') {
          return this.view.toolbar.add()
        } else {
          this.$emit('edit');
          if (this.view.form) {
            this.current = this.view.form.default || {}
            this.index = -1;
            this.$refs.editModal.modal();
          }
        }
      },
      editItem: function(item, index) {
        this.$emit('edit', item, index);
        if (this.view.form) {
          this.current = item;
          this.index = index;
          this.$refs.editModal.modal();
        }
      },
      cloneItem: function(item, index) {
        this.$emit('clone', item, index);
        if (this.view.form) {
          var newItem = JSON.parse(JSON.stringify(item))
          delete newItem._id
          delete newItem.id
          this.current = newItem;
          this.index = -1;
          this.$refs.editModal.modal();
        }
      },
      cancelEdit: function() {
        this.$refs.editModal.modal('hide');
      },
      onSave: function(item, index) {
        var self = this;
        index = index >= 0 ? index : this.index
        if (index == undefined || index < 0) {
          self.items.unshift(item);
        } else if (item.deleted) {
          self.items.splice(index, 1);
        } else {
          Object.assign(self.data[index], item);
          self.data.push(1)
          self.data.pop()
        }
        self.cancelEdit()
      },
      onRemove: function(item, index, cb) {
        var self = this;
        if (item.deleted && index !== null) {
          self.items.splice(index, 1);
        }
      }
    }
  }
</script>