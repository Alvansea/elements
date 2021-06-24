<template>
  <tr>
    <td v-for="(col, colIndex) in view.columns">
      <template v-if="view.branches && colIndex == 0">
        <span v-for="idx in indent">&nbsp;</span>
        <a @click="showBranches = !showBranches;"
          v-if="data[view.branches] ">
          <i class="fa fa-minus" v-if="showBranches"></i>
          <i class="fa fa-plus" v-else></i>
        </a>
        <i class="fa fa-minus text-muted" v-else></i>
        &nbsp;
      </template>
      <el-table-cell
        :key="col.label + index"
        :col="col"
        :index="index"
        :data="data"
        @edit="$emit('edit', data, index)"
        @remove="$emit('remove', data, index)"
        @save="$emit('save', data, index)">
        <!-- pass through scoped slots -->
        <template v-for="(_, scoped_slot_name) in $scopedSlots"
          v-slot:[scoped_slot_name]="slotData">
          <slot :name="scoped_slot_name" v-bind="slotData" />
        </template>

        <!-- pass through normal slots -->
        <template v-for="(_, slot_name) in $slots" v-slot:[slot_name]>
          <slot :name="slot_name" />
        </template>
      </el-table-cell>
    </td>
    <td v-if="!view.hideRowButtons">
      <a class="btn-cell" role="button" @click="edit(data, index)" title="编辑">
        <i class="fa fa-edit"></i></a>
      <a class="btn-cell" role="button" @click="clone(data, index)" title="克隆">
        <i class="far fa-clone"></i></a>
      <slot name="actions" v-bind="data"></slot>
      <a class="btn-cell" role="button" @click="$emit('remove', data, index)" title="删除">
        <i class="fa fa-trash-alt"></i></a>
    </td>
  </tr>
</template>

<script>
  module.exports = {
    props: [
      'data', 'view', 'index', 'indent', 'visible',
    ],
    data: function() {
      return {
        showBranches: this.view.showBranches
      };
    },
    methods: {
      switchBranches: function() {
        this.showBranches = !this.showBranches;
        this.$forceUpdate();
      },
      getAttr: function(obj, col) {
        if (col.type == 'date' && col.attr && col.format) {
          var date = this.$getAttr(obj, col.attr);
          return moment(date).format(col.format);
        } else if (typeof (col.bind) == 'function') {
          return col.bind.call(this, obj);
        } else if (col.attr) {
          return this.$getAttr(obj, col.attr);
        } else {
          return null;
        }
      },
      edit: function(data, index) {
        if (typeof (this.view.edit) == 'function') {
          this.view.edit.call(data, index)
        } else {
          this.$emit('edit', data, index);
        }
      },
      clone: function(data, index) {
        if (typeof (this.view.clone) == 'function') {
          this.view.clone.call(data, index)
        } else {
          this.$emit('clone', data, index);
        }
      }
    }
  }
</script>

<style scoped>
  .btn-cell {
    display: inline-block;
    margin-right: 0.5em;
    font-size: 1em;
    cursor: pointer;
  }

  .btn-cell:hover {
    text-decoration: none;
  }

  .el-cell img {
    width: 1.5em;
  }
</style>