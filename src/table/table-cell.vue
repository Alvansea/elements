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
      <i v-if="attr(data, col)" class="fa fa-check text-success"></i>
      <i v-else class="fa fa-times text-danger"></i>
    </template>

    <template v-else-if="col.type == 'toggle' || col.type == 'switch'">
      <span ref="toggle" @click="toggle(data, col)">
        <i :class="toggleIcon"></i>
      </span>
    </template>

    <template v-else-if="col.type == 'edit'">
      <a :class="btn(col)"
        @click="$emit('edit', data, index)">
        <i :class="attr(data, col, 'icon')" v-if="col.icon"></i>
        <img :src="attr(data, col, 'image')" v-if="col.image">
        {{ attr(data, col) }}
      </a>
    </template>

    <template v-else-if="col.type == 'remove'">
      <a :class="btn(col)"
        @click="$emit('remove', data, index)">
        <i :class="attr(data, col, 'icon')" v-if="col.icon"></i>
        <img :src="attr(data, col, 'image')" v-if="col.image">
        {{ attr(data, col) }}
      </a>
    </template>

    <template v-else-if="col.type == 'button'">
      <a href="#" :class="btn(col)" @click="col.click.call(data, index)">
        <i :class="attr(data, col, 'icon')" v-if="col.icon"></i>
        <img :src="attr(data, col, 'image')" v-if="col.image">
        {{ attr(data, col) }}
      </a>
    </template>

    <template v-else-if="col.type == 'link'">
      <a :class="btn(col)"
        :href="attr(data, col, 'href')"
        :target="attr(data, col, 'target')">
        <i :class="attr(data, col, 'icon')" v-if="col.icon"></i>
        <img :src="attr(data, col, 'image')" v-if="col.image">
        {{ attr(data, col) }}
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
      <span :class="attr(data, col, 'className')">
        <i :class="attr(data, col, 'icon')" v-if="col.icon"></i>
        <img :src="attr(data, col, 'image')" v-if="col.image && attr(data, col, 'image')">
        {{ attr(data, col) }}
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
    watch: {
      toggleIcon: function(newVal) {
        $(this.$refs.toggle).html('<i class="' + newVal + '"></i>')
      }
    },
    computed: {
      toggleIcon: function() {
        if (!!this.attr(this.data, this.col) == !!this.col.reverse) {
          return 'fa fa-toggle-off fa-lg text-muted'
        } else {
          return 'fa fa-toggle-on fa-lg text-success'
        }
      }
    },
    mounted: function() {
    },
    methods: {
      btn: function(col) {
        return 'btn-cell ' + (col.class || '');
      },
      attr: function(obj, col, type) {
        if (type && !col[type]) {
          return ''
        }
        var fn = col[type] || col.value || col.bind || col.text
        if (fn) {
          if (typeof (fn) == 'function') {
            return fn.call(obj, this.index)
          } else {
            return fn
          }
        } else if (col.attr) {
          var val = objectPath.get(obj, col.attr)
          if (val) {
            if (col.type == 'date' && col.format) {
              return moment(val).format(col.format)
            } else if (col.map) {
              return col.map[val] || val
            } else {
              return val
            }
          } else {
            return ''
          }
        } else {
          return ''
        }
      },
      className: function(obj, col) {
        if (col.className) {
          return col.className.call(obj);
        }
        return '';
      },
      toggle: function(obj, col) {
        var val = objectPath.get(obj, col.attr)
        objectPath.set(obj, col.attr, !val)
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