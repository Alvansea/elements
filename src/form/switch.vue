<template>
  <div>
    <i v-if="status" :class="icon()" @click="switchStatus()"></i>
    <i v-else :class="icon()" @click="switchStatus()"></i>
  </div>
</template>

<script>
  module.exports = {
    template: '#DataSwitchTemplate',
    props: [
      'item', 'attr', 'reverse'
    ],
    data: function() {
      var attr = this.item[this.attr];
      return {
        status: this.reverse ? (!attr) : attr
      }
    },
    methods: {
      icon: function() {
        if (this.status) {
          return 'fa fa-2x fa-toggle-on text-green';
        } else {
          return 'fa fa-2x fa-toggle-off text-muted';
        }
      },
      switchStatus: function() {
        this.status = !this.status;
        this.item[this.attr] = !this.item[this.attr];
      },
    }
  }
</script>