<template>
  <form class="form" :class="$class" @submit.prevent="saveItem()">
    <slot name="header"></slot>
    <div class="mb-3" v-if="view.button_position == 'header'">
      <button type="submit" :class="$resize('btn btn-success', view)">
        <i class="fa fa-save"></i> 保存
      </button>
      <slot name="buttons"></slot>
    </div>
    <ul class="nav nav-tabs mb-3" v-if="groups.length > 1">
      <li class="nav-item" v-for="(group, index) in groups" v-if="!isHidden(group)">
        <a class="nav-link" :class="{ active: index == currentGroupIndex }" :href="'#form_' + _uid + '_tab_' + index"
          @click="tab(index)">{{ group.label }}</a>
      </li>
    </ul>
    <template v-for="(group, index) in groups" v-if="index == currentGroupIndex && !isHidden(group)">
      <div class="row">
        <div :class="field.width || view.field_width || 'col-12'"
          v-for="field in group.fields"
          v-if="!isHidden(field)">
          <div class="form-group">
            <el-field ref="fields" :data="copy"
              :field="field"
              :options="view">
              <!-- pass through scoped slots -->
              <template v-for="(_, scoped_slot_name) in $scopedSlots"
                #[scoped_slot_name]="slotData">
                <slot :name="scoped_slot_name" v-bind="slotData" />
              </template>

              <!-- pass through normal slots -->
              <template v-for="(_, slot_name) in $slots" #[slot_name]>
                <slot :name="slot_name" />
              </template>
            </el-field>
          </div>
        </div>
      </div>
    </template>
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
  module.exports = {
    template: '#DataFormTemplate',
    props: [
      'data', 'view', 'save', 'api', '$class',
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
    created: function() {
      this.initCopy(this.data);
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
      this.initTab()
    },
    watch: {
      data: function(newVal, oldVal) {
        this.initCopy(newVal)
      }
    },
    methods: {
      attr: function(field, type) {
        var val = null
        if (type) {
          val = objectPath.get(field, type)
          if (typeof (val) == 'function') {
            val = val.call(this.data)
          }
        }
        return val
      },
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
          return elem.hidden.call(this.copy);
        } else {
          return elem.hidden
        }
      },
      initCopy: function(val) {
        var copy
        if (this.view.no_copy) {
          copy = val || {}
        } else if (val) {
          copy = JSON.parse(JSON.stringify(val)) || {};
        } else {
          copy = Object.assign({}, this.view.default ? this.view.default() : null)
        }
        var fields = this.fields()
        for (var i in fields) {
          var field = fields[i]
          var val = objectPath.get(copy, field.attr)
          if (typeof (val) == 'undefined') {
            objectPath.set(copy, field.attr, '')
          }
        }

        delete copy.__v; // delete __v to prevent update failure

        this.copy = copy
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
      saveItem: function() {
        var self = this
        var errors = this.validate()
        if (errors) {
          g_alert(errors)
          return this.$emit('error', errors)
        }
        this.$save(this.copy, this.index, function(err, result) {
          console.log('err', err)
          console.log('result', result)
          if (err) {
            self.$emit('error', err)
            g_alert(err.errMsg || err.toString())
          } else {
            self.$emit('save', self.copy)
            g_alert(err || '保存成功')
          }
        })
      },
      cancelEdit: function() {
        this.initCopy(this.data)
        this.$emit('cancel');
      }
    }
  }
</script>