<template>
  <div class="form-control input-select">
    <div class="btn-group btn-group-sm mr-1 mb-1 flex-head" v-for="(item, index) in value">
      <span class="btn btn-info">{{ label(item) }}</span>
      <span class="btn btn-secondary" @click="remove(index)">
        <i class="fa fa-times"></i>
      </span>
    </div>
    <input ref="input" class="flex-body flex-input" type="text"
      v-model="keyword"
      @input="query()"
      @keydown="onKey" @keydown.enter.prevent="onKeyEnter"
      :placeholder="view.placeholder || ''">
    <div ref="select" class="option-menu" :class="{'show': options.length > 0 }">
      <span
        v-for="(option, opt_index) in options"
        role="button"
        class="dropdown-item"
        :class="{'bg-info text-white':opt_index == focus, 'text-warning font-weight-bold': selected(option)}"
        @click="select(option)">{{ label(option) }}</span>
    </div>
  </div>
</template>

<script>
  const Popper = require('@popperjs/core')
  module.exports = {
    template: '#InputSelectTemplate',
    props: ['value', 'pool', 'view'],
    data: function() {
      return {
        keyword: '',
        options: [],
        focus: 0,
      }
    },
    mounted: function() {
      this.resetPosition()
      this.value = this.value || []
      if (!this.view) {
        throw new Error('view of input-select cannot be null or undefined')
      }
      if (!this.view.match) {
        console.warn('Missing match option in view of input-select')
      }
      if (!this.view.label) {
        console.warn('Missing label option in view of input-select')
      }
    },
    methods: {
      resetPosition: function() {
        var input = this.$refs.input
        var select = this.$refs.select
        Popper.createPopper(input, select, {
          placement: 'bottom-start'
        });
      },
      match: function(item, keyword) {
        if (!item) {
          return false
        } else if (typeof (this.view.match) == 'function') {
          return this.view.match(item, keyword)
        } else if (this.view.match && this.view.match.constructor == String) {
          var attr = this.$getAttr(item, this.view.match)
          return attr && attr.match(new RegExp(keyword, 'gi'))
        } else if (item.constructor == String) {
          return item.match(new RegExp(keyword, 'gi'))
        } else {
          return false
        }
      },
      label: function(item) {
        if (this.view.label) {
          return this.$getAttr(item, this.view.label)
        } else {
          return item.toString()
        }
      },
      transform: function(item) {
        if (typeof (this.view.transform) == 'function') {
          return this.view.transform.call(item)
        } else {
          return item
        }
      },
      query: function() {
        if (!this.keyword) {
          this.options = []
          return
        }
        if (this.pool) {
          this.options = this.pool.filter(item => {
            return this.match(item, this.keyword)
          })
          this.resetPosition()
        } else {
          this.options = []
        }
      },
      selected: function(item) {
        if (!this.view.unique) {
          return false
        }
        if (this.view.unique === true) {
          for (i in this.value) {
            if (this.value[i] == item) {
              return true
            }
          }
          return false
        } else {
          var itemId = this.$getAttr(item, this.view.unique)
          for (i in this.value) {
            var vid = this.$getAttr(this.value[i], this.view.unique)
            if (vid == itemId) {
              return true
            }
          }
          return false
        }
      },
      select: function(item) {
        if (!this.selected(item)) {
          this.value.push(this.transform(item))
          this.focus = 0
          this.resetPosition()
          this.$emit('input', this.value)
          return false
        }
        return true
      },
      remove: function(index) {
        this.value.splice(index, 1)
        this.$forceUpdate()
        this.focus = 0
        this.resetPosition()
        this.$emit('input', this.value)
      },
      onKeyEnter: function() {
        if (this.options.length) {
          var selected = this.select(this.options[this.focus])
          if (!selected) {
            this.keyword = ''
            this.options = []
          }
        }
      },
      onKey: function(event) {
        switch (event.key) {
          case 'Backspace':
            if (!this.keyword || this.keyword.length == 1) {
              // if remove the last char, reset the focus
              this.focus = 0
            }
            break;
          case 'ArrowUp':
            if (this.focus > 0) {
              this.focus--
            }
            break;
          case 'ArrowDown':
            if (this.focus < this.options.length - 1) {
              this.focus++
            }
            break;
        }
      },
    }
  }
</script>

<style module>
  .input-select {
    padding: .25rem .75rem 0 .75rem !important;
    height: auto !important;
    display: flex !important;
    flex-flow: wrap;
  }

  .input-select>.btn-group,
  .input-select>.flex-input {
    margin-bottom: .25rem !important;
  }

  .input-select .btn-group .btn {
    padding: .1rem .5rem !important;
  }

  .input-select .flex-head * {
    vertical-align: middle;
  }

  .input-select .flex-body {
    flex: 1;
  }

  .input-select .flex-input,
  .input-select .flex-input:focus {
    border: none;
    outline-width: 0;
  }

  .input-select .option-menu {
    z-index: 1000;
    float: left;
    min-width: 10rem;
    padding: .5rem 0;
    font-size: 1rem;
    color: #212529;
    text-align: left;
    list-style: none;
    background-color: #fff;
    background-clip: padding-box;
    border: 1px solid rgba(0, 0, 0, .15);
    border-radius: .25rem;
    visibility: hidden;
  }

  .input-select .option-menu.show {
    visibility: visible;
  }
</style>