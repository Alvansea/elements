<template>
  <div ref="container">
    <textarea
      v-if="!editor"
      class="form-control"
      :value="json"
      rows="5"
      @input="onChange">
    </textarea>
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
        } else {
          this.json = JSON.stringify(newVal)
        }
      }
    },
    mounted: function() {
      if (typeof (JSONEditor) != 'undefined') {
        var self = this;
        this.editor = new JSONEditor(this.$refs.container, {
          onChange: function() {
            var data = self.editor.get();
            self.$emit('input', data);
          }
        })
        this.editor.set(this.value || {});
        this.editor.expandAll();
      } else {
        this.json = JSON.stringify(this.value)
      }
    },
    methods: {
      onChange: function(event) {
        try {
          var val = JSON.parse(event.target.value.replace(/\s/g, ''))
          this.$emit('input', val)
        } catch (err) {
          console.log(err)
        }
      }
    }
  }
</script>