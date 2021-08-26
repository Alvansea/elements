<template>
  <div class="row" v-if="!attr('hidden')">
    <label :class="col_left">
      <span v-if="options.static || attr('static') || (_type != 'boolean' && _type != 'checkbox')"
        :class="attr('label_class')">
        {{ field.label }}&nbsp;<i class="text-danger" v-if="attr('required')">*</i>
      </span>
    </label>

    <div :class="col_right">

      <!-- component injections -->

      <template v-if="attr('slot')">
        <slot :name="attr('slot')" v-bind="data"></slot>
      </template>

      <template v-else-if="attr('component')">
        <keep-alive>
          <component :is="attr('component')" v-bind="_componentProps" />
        </keep-alive>
      </template>

      <!-- statics -->

      <template v-else-if="options.static || attr('static')">
        <span :class="resize('form-control form-control-plaintext')">
          <el-static-field :data="data" :field="field" :options="options"></el-static-field>
        </span>
      </template>

      <!-- composed form inputs -->

      <template v-else-if="_type == 'image'">
        <div>
          <el-upload
            v-if="attr('upload')"
            :class="resize(attr('upload.btn') || '')"
            :name="attr('upload.name')"
            :url="attr('upload.url')"
            @done="attr('upload').done.call({ data, field }, arguments);$forceUpdate();"
            @error="attr('upload').error.call({ data, field }, arguments)">
            <img class="img-thumbnail mb-1" :style="attr('style')"
              v-if="value() || attr('default')"
              :src="value() || attr('default')">
            <span class="btn btn-outline-secondary" v-else>
              <i class="fa fa-plus"></i></span>
          </el-upload>
          <a class="btn btn-sm btn-outline-info corner-tl"
            href="javascript:;"
            @click="assign('');$forceUpdate();"
            v-if="value()">
            <i class="fa fa-lg fa-trash-alt"></i>
          </a>
        </div>
      </template>

      <template v-else-if="_type == 'json'">
        <el-json-editor
          :value="value()"
          @input="assign($event)"></el-json-editor>
      </template>

      <template v-else-if="_type == 'date'">
        <el-date-time-picker
          :name="attr('name')"
          :format="attr('format')"
          :value="value()"
          :input-class="resize('form-control')"
          :disabled="attr('disabled')"
          :enabled-dates="attr('enabledDates')"
          :min-date="attr('minDate')"
          :max-date="attr('maxDate')"
          @input="assign($event)"></el-date-time-picker>
      </template>

      <!-- prmitive html form controls -->

      <template v-else-if="_type == 'radio'">
        <label class="form-check-inline mt-2" v-for="option in selectOptions()">
          <input
            type="radio"
            class="form-check-input"
            :checked="option.value == value() || option == value()"
            :name="attr('attr')"
            :value="option.value || option"
            @input="assign($event.target.value)"
            :disabled="attr('disabled')"> {{ option.name || option }}
        </label>
      </template>

      <template v-else-if="_type == 'check-list'">
        <div class="list-group list-group-sm">
          <a class="list-group-item text-secondary d-flex justify-content-between"
            :class="{'text-danger font-weight-bold': contain(option) }" v-for="option in selectOptions()"
            @click="check(option)">
            {{ option.name || option }}
            <i class="fa fa-check text-danger mt-1" v-if="contain(option)"></i>
          </a>
        </div>
      </template>

      <template v-else-if="_type == 'select'">
        <select
          :class="resize('form-control')"
          :name="attr('name')"
          :value="value()"
          @input="assign($event.target.value, 'select')"
          :disabled="attr('disabled')">
          <option :value="null">(无)</option>
          <option
            v-for="option in selectOptions()"
            :value="option.value || option">{{ option.name || option }}</option>
        </select>
      </template>

      <template v-else-if="_type == 'switch' || _type == 'toggle'">
        <el-toggle class="fa-2x" :value="value()" :reverse="attr('reverse') || attr('reversed')" @input="assign">
        </el-toggle>
      </template>

      <template v-else-if="_type == 'checkbox' || _type == 'boolean'">
        <label class="form-check-inline">
          <input
            type="checkbox"
            class="form-check-input"
            :checked="!value()"
            @input="assign(!($event.target.checked))"
            :disabled="attr('disabled')"
            v-if="attr('reverse') || attr('reversed')" />
          <input
            type="checkbox"
            class="form-check-input"
            :checked="value()"
            @input="assign($event.target.checked)"
            :disabled="attr('disabled')"
            v-else />
          {{ attr('label') }}
        </label>
      </template>

      <template v-else-if="_type == 'textarea' || attr('rows')">
        <textarea
          :class="resize('form-control')"
          :name="attr('name')"
          :value="value()"
          @input="assign($event.target.value)"
          :rows="attr('rows') || 3"
          :disabled="attr('disabled')"
          :placeholder="attr('placeholder')"></textarea>
      </template>

      <template v-else-if="_type == 'password'">
        <input
          type="password"
          :class="resize('form-control')"
          :name="attr('name')"
          :value="value()"
          @input="assign($event.target.value)"
          :disabled="attr('disabled')"
          :placeholder="attr('placeholder')" />
      </template>

      <template v-else>
        <input
          type="text"
          :class="resize('form-control')"
          :name="attr('name')"
          :value="value()"
          @input="assign($event.target.value)"
          :disabled="attr('disabled')"
          :placeholder="attr('placeholder')" />
      </template>

      <small v-if="attr('hint')" class="text-muted">* {{ attr('hint') }}</small>
    </div>
  </div>
</template>

<script>
  module.exports = {
    props: [
      'field', 'data', 'options', 'caller'
    ],
    data: function() {
      return {
        col_left: 'col-12',
        col_right: 'col-12',
      };
    },
    computed: {
      _noLabel: function() {
        return this._options.hide_label || this.field.label === null
      },
      _options: function() {
        return this.options || {}
      },
      _type: function() {
        return this.attr('type') || ''
      },
      _slotData: function() {
        return this.data
      },
      _componentProps: function() {
        var props = this.attr('props') || {}
        Object.assign(props, { data: this.data, })
        return props
      },
    },
    mounted: function() {
      if (this._type == 'toggle'
        || this._type == 'boolean'
        || this._type == 'switch'
        || this._type == 'checkbox') {
        this.assign(!!this.value())
      }
      if (this._type == 'label') {
        this.col_left = 'col-12'
        this.col_right = 'd-none'
      } else if (this._noLabel) {
        this.col_left = 'd-none'
        this.col_right = 'col-12'
      } else {
        var options = this.options || {}
        var layout = this.field.layout || options.field_layout
        var cols = layout ? layout.split('|') : []
        this.col_left = (cols[0] || 'col-12') + ' col-form-label'
        this.col_right = cols[1] || 'col-12'
      }
    },
    methods: {
      attr: function(name) {
        return this.$getAttr(this.field, name, {
          data: this.data,
          field: this.field,
          index: this.index
        })
      },
      hasAttr: function(name) {
        return !!this.field[name]
      },
      value: function() {
        if (this.hasAttr('value')) return this.attr('value')
        if (this.hasAttr('text')) return this.attr('text')

        var attr = this.attr('attr')
        if (!attr) return null

        var val = this.$getAttr(this.data, attr)
        if (!val) return null

        var type = (this.attr('type') || '').toLowerCase()
        var options = this.attr('options')
        if (type == 'date' || type == '#date') {
          var format = this.attr('format') || 'YYYY-MM-DD HH:mm'
          return moment(val).format(format)
        } else if (options && options.list && options.value) {
          return this.$getAttr(val, options.value)
        } else {
          return val
        }
      },
      href: function() {
        return this.$format(this.attr('href'), this.data)
      },
      selectOptions: function() {
        var options = this.attr('options')
        if (!options) {
          return []
        }
        if (options.constructor == Array) {
          return options
        }
        if (options.list) {
          if (!options.name || !options.value) {
            throw new Error('missing name or value of field options')
          }
          return options.list.map(function(iter) {
            return {
              name: this.$getAttr(iter, options.name),
              value: this.$getAttr(iter, options.value),
            }
          })
        } else {
          return Object.keys(options).map(function(key) {
            return {
              name: options[key],
              value: key
            }
          })
        }
      },
      resize: function(classnames) {
        return this.$resize(classnames, this.options)
      },
      validate: function() {
        var attr = this.attr('attr') || this.attr('value')
        var val = this.$getAttr(this.data, attr)
        if (this.attr('required')) {
          if (val === null) {
            return '<i class="text-danger">*</i> <b>' + this.field.label + '</b> 不能为空'
          } else if (!val) {
            return null
          } else if (this.attr('type') == 'check-list' && !val.length) {
            return '<i class="text-danger">*</i> <b>' + this.field.label + '</b> 不能为空'
          }
        }
        return null
      },
      assign: function(val, type) {
        if (typeof (this.field.watch) == 'function') {
          this.field.watch(val, this.value())
        }
        var options = this.attr('options')
        if (options && options.list && options.name && options.value) {
          for (var i = 0; i < options.list.length; i++) {
            var item = options.list[i]
            if (this.$getAttr(item, options.value) == val) {
              val = item
              break
            }
          }
        }
        this.$setAttr(this.data, this.attr('attr'), val);
        if (typeof (this.field.onChange) == 'function') {
          this.field.onChange.call({
            data: this.data,
            field: this.field
          }, val)
        }
      },
      contain: function(option) {
        if (!option) return false
        var list = this.$getAttr(this.data, this.attr('attr')) || []
        var val = this.$isNullOrUndefined(option.value) ? option : option.value
        var index = list.indexOf(val)
        return index >= 0
      },
      check: function(option) {
        var list = this.$getAttr(this.data, this.attr('attr')) || []
        var val = this.$isNullOrUndefined(option.value) ? option : option.value
        var index = list.indexOf(val)
        if (index >= 0) {
          list.splice(index, 1)
        } else {
          list.push(val)
        }
        this.$setAttr(this.data, this.attr('attr'), list);
        this.$forceUpdate()
      }
    },
  }
</script>

<style scoped>
  .corner-tl {
    position: absolute;
    top: 1em;
    left: 2em;
  }
</style>