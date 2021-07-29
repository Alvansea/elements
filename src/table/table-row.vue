<template>
  <tr>
    <td v-for="(col, colIndex) in view.columns" :class="$getAttr(col, 'class')" :style="$getAttr(col, 'style')">
      <el-static-field
        :key="col.label + index"
        :field="col"
        :index="index"
        :data="data"
        @change="$emit('save', data, index)">
        <!-- pass through scoped slots -->
        <template v-for="(index, scoped_slot_name) in $scopedSlots" v-slot:[scoped_slot_name]="slot_data">
          <slot :name="scoped_slot_name" v-bind="slot_data"></slot>
        </template>
        <!-- pass through normal slots -->
        <template v-for="(index, slot_name) in $slots" v-slot:[slot_name]>
          <slot :name="slot_name"></slot>
        </template>
      </el-static-field>
    </td>
    <td v-if="!view.hide_row_buttons">
      <a class="btn-cell" role="button" @click="edit(data, index)" title="编辑">
        <i class="fa fa-edit"></i></a>
      <a class="btn-cell" role="button" @click="clone(data, index)" title="克隆" v-if="view.clonable">
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
      'data', 'view', 'index', ,
    ],
    data: function() {
      return {}
    },
    methods: {
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