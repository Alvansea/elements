<template>
  <span class="el-cell" :style="field.style || ''">

    <template v-if="field.slot">
      <slot :name="field.slot" v-bind="{ data, index }"></slot>
    </template>

    <template v-else-if="field.repeat && !noRepeat">
      <el-static-field
        v-for="(iter, iterIndex) in data[field.repeat]"
        :key="data._id + '-' + iterIndex"
        :data="iter"
        :index="iterIndex"
        :field="field"
        :no-repeat="true"
        @change="$emit('change', data, index)">
      </el-static-field>
    </template>

    <template v-else-if="field.type == 'boolean'">
      <i class="fa"
        :class="{'fa-check text-success': !attr(), 'fa-times text-danger': attr() }"
        v-if="attr('reverse') || attr('reversed')"></i>
      <i class="fa"
        :class="{'fa-check text-success': attr(), 'fa-times text-danger': !attr() }"
        v-else></i>
    </template>

    <template v-else-if="field.type == 'toggle' || field.type == 'switch'">
      <el-toggle class="fa-lg" :value="attr()" :reverse="attr('reverse') || attr('reversed')" @input="toggle">
      </el-toggle>
    </template>

    <template v-else-if="field.type == 'edit'">
      <a :class="btn()"
        @click="$emit('edit', data, index)">
        <i :class="attr('icon')" v-if="field.icon"></i>
        <img :src="attr('image')" v-if="field.image">
        {{ attr() }}
      </a>
    </template>

    <template v-else-if="field.type == 'remove'">
      <a :class="btn()"
        @click="$emit('remove', data, index)">
        <i :class="attr('icon')" v-if="field.icon"></i>
        <img :src="attr('image')" v-if="field.image">
        {{ attr() }}
      </a>
    </template>

    <template v-else-if="field.type == 'button'">
      <a role="button" :class="btn()" @click="field.click.call(data, index)">
        <i :class="attr('icon')" v-if="field.icon"></i>
        <img :src="attr('image')" v-if="field.image">
        {{ attr() }}
      </a>
    </template>

    <template v-else-if="field.type == 'link'">
      <a :class="btn()" :href="href()" :target="attr('target')">
        <i :class="attr('icon')" v-if="field.icon"></i>
        <img :src="attr('image')" v-if="field.image">
        {{ attr() }}
      </a>
    </template>

    <template v-else-if="field.group">
      <el-static-field
        v-for="(subField, groupIndex) in field.group"
        :key="field.label + '-' + groupIndex"
        :data="data"
        :index="index"
        :field="subField"
        @change="$emit('save', data, index)">
      </el-static-field>
    </template>

    <template v-else>
      <span :class="attr('className')">
        <i :class="attr('icon')" v-if="field.icon"></i>
        <img :src="attr('image')" v-if="field.image && attr('image')">
        {{ field.type == 'date' ? date() : attr() }}
      </span>
    </template>
  </span>
</template>

<script>
  module.exports = {
    props: [
      'field', 'data', 'index', 'noRepeat'
    ],
    methods: {
      btn: function() {
        return 'btn-cell ' + (this.field.class || '');
      },
      attr: function(type) {
        var val

        if (!type) {
          if ('value' in this.field || 'text' in this.field || 'bind' in this.field) {
            val = this.attr('value') || this.attr('text') || this.attr('bind')
          } else {
            var attr = this.attr('attr') || this.attr('key')
            val = this.$getAttr(this.data, attr)
          }
        } else {
          val = this.$getAttr(this.field, type, {
            data: this.data,
            field: this.field,
            index: this.index
          })
        }
        return val
      },
      date: function() {
        var val = this.attr()
        if (val && this.field.format) {
          return moment(val).format(this.field.format)
        } else {
          return val
        }
      },
      href: function() {
        return this.$format(this.attr('href'), this.data)
      },
      toggle: function(val) {
        this.$setAttr(this.data, this.field.attr, val)
        this.$emit('change', this.data, this.index)
      },
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