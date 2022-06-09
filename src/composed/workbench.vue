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
        @remove="onRemove"
        @error="onError">
        <!-- pass through scoped slots -->
        <template v-for="(index, scoped_slot_name) in $scopedSlots" v-slot:[scoped_slot_name]="slot_data">
          <slot :name="scoped_slot_name" v-bind="slot_data"></slot>
        </template>
        <!-- pass through normal slots -->
        <template v-for="(index, slot_name) in $slots" v-slot:[slot_name]>
          <slot :name="slot_name"></slot>
        </template>
      </el-table>
    </div>

    <el-pagination :pagination="view.table && view.table.pagination"></el-pagination>

    <el-modal ref="editModal" title="编辑" class="fade" size="lg">
      <el-form
        v-if="view.form"
        ref="form"
        :data="current"
        :index="index"
        :view="view.form"
        :api="api"
        :save="save"
        :hooks="hooks"
        @submited="onSubmited"
        @save="onSave"
        @cancel="cancelEdit"
        @error="onError">
        <!-- pass through scoped slots -->
        <template v-for="(_, scoped_slot_name) in $scopedSlots" #[scoped_slot_name]="slot_data">
          <slot :name="scoped_slot_name" v-bind="slot_data"></slot>
        </template>
        <!-- pass through normal slots -->
        <template v-for="(_, slot_name) in $slots" #[slot_name]>
          <slot :name="slot_name"></slot>
        </template>
      </el-form>
    </el-modal>
  </div>
</template>

<script>
  const ResourceMixin = require('../script/ResourceMixin.js')
  module.exports = {
    props: [
      'data', 'view', 'save', 'api', 'hidden', 'hooks'
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
      this.hooks = this.hooks || {}
    },
    mounted: function() {
      this.hooks = this.hooks || {}
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
        if (typeof (this.hooks.beforeEdit) == 'function') {
          this.hooks.beforeEdit(item, index)
        }
        this.$emit('edit', item, index)
        if (this.view.form) {
          this.current = item;
          this.index = index;
          this.$refs.form.initCopy(this.current)
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
      onSubmited: function(res, index) {
        this.$emit('submited', res, index)
      },
      onError: function(err) {
        this.$emit('error', err)
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