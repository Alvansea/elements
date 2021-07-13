<template>
  <el-modal ref="modal" title="筛选" class="fade filter-modal">
    <div class="filter-group" v-for="group in filters">
      <label>{{ group.name }}</label>
      <div class="btn-group btn-group-justified">
        <div class="btn-group" v-for="option in group.options">
          <a :class="optionClass(group.field, option.value)"
            @click="$filterBy(group.field, option.value)">
            {{ option.name }}
          </a>
        </div>
      </div>
    </div>
  </el-modal>
</template>

<script>
  module.exports = {
    props: ['filters'],
    methods: {
      modal: function(flag) {
        this.$refs.modal.modal(flag);
      },
      optionClass: function(field, value) {
        var params = this.$getQueryParams();
        if ((params[field] || '') == value) {
          return 'btn btn-green';
        } else {
          return 'btn btn-sm btn-outline-secondary';
        }
      },
      optionName: function(field, value) {
        for (var i in this.groups) {
          if (this.groups[i].field == field) {
            for (var j in this.groups[i].options) {
              if (this.groups[i].options[j].value == value) {
                return this.groups[i].options[j].name;
              }
            }
          }
        }
        return '';
      }
    }
  }
</script>

<style scoped>
  .filter-modal .modal-dialog {
    margin-top: 100px;
  }

  .filter-group {
    margin-bottom: 12px;
  }
</style>