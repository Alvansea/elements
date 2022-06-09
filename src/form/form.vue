<template>
  <form class="form" @submit.prevent="doSubmit()">
    <slot name="header"></slot>
    <div class="mb-3" v-if="view.button_position == 'header'">
      <button type="submit" :class="$resize('btn btn-success', view)">
        <i class="fa fa-save"></i> 保存
      </button>
      <slot name="buttons"></slot>
    </div>
    <ul class="nav nav-tabs nav-justified mb-3" v-if="groups.length > 1">
      <li class="nav-item" v-for="(group, index) in groups" v-if="!isHidden(group)">
        <a class="nav-link" :class="{ active: index == currentGroupIndex }" :href="'#form_' + _uid + '_tab_' + index"
          @click="tab(index)">{{ group.label }}<i class="text-danger" v-if="group.required"> *</i></a>
      </li>
    </ul>
    <div v-for="(group, index) in groups" :class="{'d-none': index != currentGroupIndex || isHidden(group)}">
      <div class="row">
        <div :class="field.width || view.field_width || 'col-12'"
          v-for="field in group.fields"
          v-if="!isHidden(field)">
          <div class="form-group">
            <el-form-field ref="fields" :data="data" :field="field" :options="view">
              <!-- pass through scoped slots -->
              <template v-for="(_, scoped_slot_name) in $scopedSlots" #[scoped_slot_name]="slot_data">
                <slot :name="scoped_slot_name" v-bind="slot_data"></slot>
              </template>
              <!-- pass through normal slots -->
              <template v-for="(_, slot_name) in $slots" #[slot_name]>
                <slot :name="slot_name"></slot>
              </template>
            </el-form-field>
          </div>
        </div>
      </div>
    </div>
    <slot name="form"></slot>
    <template v-if="!view.no_buttons && (!view.button_position || view.button_position == 'footer')">
      <div class="form-group text-right">
        <button
          type="button"
          :class="$resize('btn btn-outline-secondary', view)"
          data-dismiss="modal"
          @click="cancelEdit()">取消</button>
        <slot name="buttons"></slot>
        <button
          type="submit"
          :class="$resize('btn btn-primary', view)">保存</button>
      </div>
    </template>
    <button type="submit" hidden></button>
  </form>
</template>

<script>
  const ResourceMixin = require('../script/ResourceMixin.js')
  module.exports = {
    props: [
      'data', 'index', 'view', 'save', 'api', 'hooks'
    ],
    mixins: [ResourceMixin],
    data: function() {
      return {
        copy: null,
        currentGroupIndex: 0,
        currentGroup: {},
        groups: []
      }
    },
    mounted: function() {
      if (!this.view) {
        throw new Error('No view found in el-form')
      }
      if (!this.view.groups) {
        this.groups = [{
          fields: this.view.fields
        }]
      } else {
        this.groups = this.view.groups
      }
      this.hooks = this.hooks || {}
      this.initTab()
    },
    methods: {
      initTab: function() {
        var form = location.hash.match(/#form_(\d+)/gi)
        if (form) {
          var formId = form[0].slice(6)
          if (formId != this._uid) return
        }
        var tab = location.hash.match(/tab_(\d+)/g)
        if (tab) {
          var tabId = tab[0].slice(4)
          this.currentGroupIndex = parseInt(tabId)
        }
      },
      tab: function(index) {
        if (this.groups) {
          this.currentGroupIndex = index
          this.currentGroup = this.groups[index] || {}
        }
      },
      fields: function() {
        var fields = []
        for (var i in this.groups) {
          fields = fields.concat(this.groups[i].fields || [])
        }
        return fields
      },
      isHidden: function(elem) {
        if (!elem.hidden) {
          return false
        }
        if (typeof (elem.hidden) == 'function') {
          return elem.hidden.call({ data: this.data });
        } else {
          return elem.hidden
        }
      },
      validate: function() {
        var errors = []
        var self = this
        var fields = this.fields()
        if (!fields.length) {
          return ''
        }
        this.$refs.fields.forEach(function(field) {
          var err = field.validate()
          if (err) {
            errors.push(err)
          }
        })
        if (errors.length) {
          return errors.join('<br>')
        } else {
          return ''
        }
      },
      doSubmit: function() {
        var self = this
        var errors = this.validate()
        if (errors) {
          self.$showMsg(errors)
          return this.$emit('error', errors)
        }
        if (!this.api && !this.view.api && !this.save) {
          return this.$emit('submit', this.data)
        }
        if (this.view.action) {
          location.href = this.view.action + this.$toQuerystring(this.data)
          return
        }
        if (this.hooks && this.hooks.preSave) {
          this.hooks.preSave(this.data, this.index)
        }
        this.$save(this.data, this.index)
          .then(function(res) {
            self.$emit('submited', res, this.index)
            self.$emit('save', self.data, this.index)
          })
          .catch(function(err) {
            self.$emit('error', err)
          })
      },
      cancelEdit: function() {
        this.restore()
        this.$emit('cancel');
      },
      initCopy: function(val) {
        this.copy = JSON.parse(JSON.stringify(val))
      },
      restore: function() {
        for (var i in this.groups) {
          var group = this.groups[i]
          for (var j in group.fields) {
            var field = group.fields[j]
            var val = this.$getAttr(this.copy, field.attr)
            this.$setAttr(this.data, field.attr, val)
          }
        }
      },
    }
  }
</script>