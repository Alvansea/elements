<template>
  <div>
    <template v-if="editor">
      <label class="form-check-inline mt-2">
        <input type="radio" class="form-check-input" v-model="mode" value="json">
        <span>JSON</span>
      </label>
      <label class="form-check-inline mt-2">
        <input type="radio" class="form-check-input" v-model="mode" value="text">
        <span>Text</span>
      </label>
    </template>
    <textarea class="form-control" v-show="mode=='text'" v-model="json" rows="5" @change="onJsonChange"></textarea>
    <div ref="editor" v-show="mode=='json'"></div>
  </div>
</template>

<script>
  module.exports = {
    props: [
      'value'
    ],
    data: function() {
      return {
        editor: null,
        mode: 'text',
        json: '',
      }
    },
    watch: {
      value: function(newVal, oldVal) {
        if (this.editor) {
          if (typeof (newVal) == 'string' && newVal.indexOf('{') == 0) {
            this.editor.updateText(newVal);
          } else {
            this.editor.update(newVal);
          }
          this.mode = 'json'
        }
        this.json = JSON.stringify(newVal || '', null, 4)
      }
    },
    mounted: function() {
      this.json = JSON.stringify(this.value, null, 4)
      if (typeof (JSONEditor) != 'undefined') {
        var self = this;
        this.editor = new JSONEditor(this.$refs.editor, {
          onChange: function() {
            var data = self.editor.get();
            self.$emit('input', data);
          }
        })
        this.editor.set(this.value || {});
        this.editor.expandAll();
      }
    },
    methods: {
      onChange: function(event) {
        try {
          var val = JSON.parse(event.target.value.replace(/\s/g, ''))
          this.$emit('input', val)
        } catch (err) {
          console.log('* json editor', err)
        }
      },
      onJsonChange: function() {
        try {
          var val = JSON.parse(this.json)
          this.$emit('input', val)
        } catch (err) {
          console.log('* json editor', err)
        }
      },
    }
  }
</script>