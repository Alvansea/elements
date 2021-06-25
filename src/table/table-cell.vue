<template>
  <span class="el-cell">

    <template v-if="col.slot">
      <slot :name="col.slot" v-bind="{ data, index }"></slot>
    </template>

    <template v-else-if="col.repeat && !noRepeat">
      <el-table-cell
        v-for="(prop, propIndex) in data[col.repeat]"
        :key="data._id + '-' + propIndex"
        :data="prop"
        :index="propIndex"
        :col="col"
        :no-repeat="true"
        @edit="$emit('edit', data, index)"
        @remove="$emit('remove', data, index)"
        @save="$emit('save', data, index)">
      </el-table-cell>
    </template>

    <template v-else-if="col.type == 'boolean'">
      <i v-if="attr()" class="fa fa-check text-success"></i>
      <i v-else class="fa fa-times text-danger"></i>
    </template>

    <template v-else-if="col.type == 'toggle' || col.type == 'switch'">
      <span ref="toggle" role="button" @click="toggle(data, col)">
        <i :class="_toggleIcon"></i>
      </span>
    </template>

    <template v-else-if="col.type == 'edit'">
      <a :class="btn()"
        @click="$emit('edit', data, index)">
        <i :class="attr('icon')" v-if="col.icon"></i>
        <img :src="attr('image')" v-if="col.image">
        {{ attr() }}
      </a>
    </template>

    <template v-else-if="col.type == 'remove'">
      <a :class="btn()"
        @click="$emit('remove', data, index)">
        <i :class="attr('icon')" v-if="col.icon"></i>
        <img :src="attr('image')" v-if="col.image">
        {{ attr() }}
      </a>
    </template>

    <template v-else-if="col.type == 'button'">
      <a href="#" :class="btn()" @click="col.click.call(data, index)">
        <i :class="attr('icon')" v-if="col.icon"></i>
        <img :src="attr('image')" v-if="col.image">
        {{ attr() }}
      </a>
    </template>

    <template v-else-if="col.type == 'link'">
      <a :class="btn()" :href="href()" :target="attr('target')">
        <i :class="attr('icon')" v-if="col.icon"></i>
        <img :src="attr('image')" v-if="col.image">
        {{ attr() }}
      </a>
    </template>

    <template v-else-if="col.group">
      <el-table-cell
        v-for="(subCol, groupIndex) in col.group"
        :key="col.label + '-' + groupIndex"
        :data="data"
        :index="index"
        :col="subCol"
        @edit="$emit('edit', data, index)"
        @remove="$emit('remove', data, index)"
        @save="$emit('save', data, index)">
      </el-table-cell>
    </template>

    <template v-else>
      <span :class="attr('className')">
        <i :class="attr('icon')" v-if="col.icon"></i>
        <img :src="attr('image')" v-if="col.image && attr('image')">
        {{ col.type == 'date' ? date() : attr() }}
      </span>
    </template>
  </span>
</template>

<script>
  module.exports = {
    props: [
      'col', 'data', 'index', 'noRepeat'
    ],
    data: function() {
      return {
      }
    },
    computed: {
      _toggleIcon: function() {
        if (!!this.attr() == !!this.col.reverse) {
          return 'fa fa-toggle-off fa-lg text-muted'
        } else {
          return 'fa fa-toggle-on fa-lg text-success'
        }
      }
    },
    mounted: function() {
    },
    methods: {
      btn: function() {
        return 'btn-cell ' + (this.col.class || '');
      },
      attr: function(type) {
        var val

        if (!type) {
          if ('value' in this.col || 'text' in this.col || 'bind' in this.col) {
            val = this.attr('value') || this.attr('text') || this.attr('bind')
          } else {
            var attr = this.attr('attr') || this.attr('key')
            val = this.$getAttr(this.data, attr)
          }
        } else {
          val = this.$getAttr(this.col, type, {
            data: this.data,
            field: this.col,
            index: this.index
          })
        }
        return val
      },
      date: function() {
        var val = this.attr()
        if (val && this.col.format) {
          return moment(val).format(this.col.format)
        } else {
          return val
        }
      },
      href: function() {
        return this.$format(this.attr('href'), this.data)
      },
      className: function(obj, col) {
        if (col.className) {
          return col.className.call(obj);
        }
        return '';
      },
      toggle: function(obj, col) {
        var val = this.$getAttr(obj, col.attr)
        this.$setAttr(obj, col.attr, !val)
        var val2 = this.$getAttr(obj, col.attr)
        console.log('toggle', val, val2)
        delete obj.__v;
        this.$emit('save', obj, this.index)
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