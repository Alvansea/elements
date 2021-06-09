<template>
  <div>
    <form class="form-inline" @submit.prevent="queryItems()">
      <div class="input-group">
        <input type="text" class="form-control" v-model="searchFilter" :placeholder="searchLabel">
        <div class="input-group-append">
          <button type="submit" class="btn btn-outline-secondary"><i class="fa fa-search"></i></i></button>
        </div>
      </div>
    </form>
    <table class="table table-striped my-1">
      <thead>
        <tr>
          <th v-for="column in view">{{ column.label }}</th>
          <th>已添加</th>
          <th v-if="sortable">排序</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, itemIndex) in data">
          <td v-for="(column, colIndex) in view">
            <el-table-cell
              :col="column"
              :data="item"
              :index="colIndex"
              @save="saveItem"></el-table-cell>
          </td>
          <td><i class="fa fa-check text-green"></i></td>
          <td v-if="sortable">
            <a @click="moveItem(itemIndex, -1)">
              <i class="fa fa-chevron-up"></i>
            </a>
            <a @click="moveItem(itemIndex, 1)">
              <i class="fa fa-chevron-down"></i>
            </a>
          </td>
          <td>
            <a @click="addItem(item)">
              <i class="fa fa-trash-alt"></i>
            </a>
          </td>
        </tr>
        <tr v-for="(item, itemIndex) in searchResults" v-if="getIndex(item) < 0">
          <td v-for="(column, colIndex) in view">
            <el-table-cell
              :data="item"
              :col="column"
              :index="colIndex"
              @save="saveItem"></el-table-cell>
          </td>
          <td></td>
          <td v-if="sortable"></td>
          <td>
            <a @click="addItem(item)">
              <i class="fa fa-plus"></i>
            </a>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  module.exports = {
    template: '#MappingEditorTemplate',
    props: [
      'data', 'view', 'searchLabel', 'search', 'searchApi', 'sortable'
    ],
    data: function() {
      return {
        searchFilter: '',
        searchResults: [],
      }
    },
    methods: {
      queryItems: function() {
        var self = this;
        if (!self.searchFilter) {
          return;
        }

        if (this.searchApi) {
          Vue.resource(this.searchApi).get({
            filter: self.searchFilter
          }).then(function(res) {
            if (res.body.errMsg) {
              return g_alert(res.body.errMsg);
            }
            self.searchResults = res.body;
          })
        } else if (this.search) {
          this.search(self.searchFilter, function(err, data) {
            if (err) {
              return g_alert(err);
            }
            self.searchResults = data;
          })
        } else {
          g_alert('查询API错误');
        }
      },
      getIndex: function(item) {
        for (var i in this.data) {
          if (this.data[i]._id == item._id) {
            return i;
          }
        }
        return -1;
      },
      addItem: function(item) {
        var index = this.getIndex(item);
        var action = index >= 0 ? 'remove' : 'add';
        if (index >= 0) {
          if (!confirm('请再次确认移除该')) {
            return;
          }
          this.data.splice(index, 1);
        } else {
          this.data.push(item);
        }
        this.$emit('change', this.data);
      },
      moveItem: function(index, offset) {
        var item = this.data.splice(index, 1)[0];
        this.data.splice(index + offset, 0, item);
        this.$emit('change', this.data);
      },
      saveItem: function(item, index) {
        this.$emit('save', item, index);
      }
    }
  }
</script>