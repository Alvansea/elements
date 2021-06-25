<template>
  <div ref="modal" class="modal">
    <div :class="_dialogClass">
      <div class="modal-content">
        <div class="modal-header">
          <h6 class="modal-title">
            <slot name="title"></slot>{{ title }}
          </h6>
          <button
            v-if="!hideClose"
            type="button"
            class="close"
            data-dismiss="modal"
            aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <slot></slot>
        </div>
        <div class="modal-footer" v-if="footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  module.exports = {
    props: [
      'title', 'footer', 'hideClose', 'size'
    ],
    computed: {
      _dialogClass: function() {
        return this.size ? 'modal-dialog modal-' + this.size : 'modal-dialog'
      }
    },
    methods: {
      modal: function(hide) {
        $(this.$refs.modal).modal(hide);
      }
    }
  }
</script>