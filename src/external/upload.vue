<template>
  <span class="fileinput-button">
    <slot></slot>
    <input ref="fileupload" type="file" :name="fieldName">
  </span>
</template>

<script>
  module.exports = {
    props: [
      'name', 'url',
    ],
    data: function() {
      return {
        fieldName: this.name || 'resource',
      }
    },
    mounted: function() {

      var self = this;

      $(this.$refs.fileupload)
        .fileupload({
          url: self.url,
          dataType: 'json',
          start: function() {
            self.$emit('start', event);
          },
          done: function(e, res) {
            if (res.result.errMsg) {
              self.$emit('error', res.result.errMsg);
              return;
            }
            self.$emit('done', res.result);
          },
          error: function(err) {
            self.$emit('error', err);
          },
          progressall: function(e, data) {
            var progress = parseInt(data.loaded / data.total * 100, 10);
            console.log('progress', progress);
            self.$emit('progress', progress);
          }
        })
        .prop('disabled', !$.support.fileInput)
        .parent().addClass($.support.fileInput ? undefined : 'disabled');
    }
  }
</script>

<style scoped>
  .fileinput-button {
    position: relative;
    overflow: hidden;
    display: inline-block;
  }

  .fileinput-button input {
    position: absolute;
    top: 0;
    right: 0;
    margin: 0;
    opacity: 0;
    filter: 'alpha(opacity=0)';
    -ms-filter: 'alpha(opacity=0)';
    font-size: 200px !important;
    direction: ltr;
    cursor: pointer;
  }
</style>