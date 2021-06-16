<template>
  <div>
    <div class="row">
      <div class="col">
        <h5 class="mt-2">{{ label }}</h5>
        <table class="table table-sm table-striped mt-3">
          <thead>
            <tr>
              <th v-for="column in view">{{ column.label }}</th>
              <th v-if="sortable">排序</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, itemIndex) in data" v-if="item">
              <td v-for="(column, colIndex) in view">
                <el-table-cell
                  :col="column"
                  :data="item"
                  :index="colIndex"
                  @save="saveItem"></el-table-cell>
              </td>
              <td v-if="sortable">
                <a href="#" class="fa fa-chevron-up text-secondary"
                  @click="moveItem(itemIndex, -1)">
                </a>
                <a href="#" class="fa fa-chevron-down text-secondary"
                  @click="moveItem(itemIndex, 1)">
                </a>
              </td>
              <td>
                <a href="#" class="text-danger" @click="addItem(item)">
                  <i class="fa fa-trash-alt"></i> 移除
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="col">
        <form class="form-inline justify-content-end" @submit.prevent="queryItems()">
          <div class="input-group input-group-sm">
            <input type="text" class="form-control" v-model="searchFilter" :placeholder="searchLabel">
            <div class="input-group-append">
              <a class="btn btn-outline-secondary" v-if="searchFilter" @click="clearFilter()">
                <i class="fa fa-times"></i>
              </a>
              <button type="submit" class="btn btn-secondary"><i class="fa fa-search"></i></i></button>
            </div>
          </div>
        </form>

        <table class="table table-sm table-striped mt-3">
          <thead>
            <tr>
              <th v-for="column in view">{{ column.label }}</th>
              <th v-if="sortable">排序</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, itemIndex) in searchResults" v-if="getIndex(item) < 0">
              <td v-for="(column, colIndex) in view">
                <el-table-cell
                  :data="item"
                  :col="column"
                  :index="colIndex"
                  @save="saveItem"></el-table-cell>
              </td>
              <td v-if="sortable"></td>
              <td>
                <a href="#" class="text-success" @click="addItem(item)">
                  <i class="fa fa-plus"></i> 添加
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
  module.exports = {
    template: '#SetEditor',
    props: [
      'data', 'view', 'label',
      'searchLabel', 'search', 'searchApi', 'sortable',
      'match'
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
      clearFilter: function() {
        this.searchFilter = ''
        this.searchResults = []
      },
      getIndex: function(item) {
        if (!item) {
          return -1
        }
        for (var i = 0; i < this.data.length; i++) {
          if (this.match && this.match(this.data[i], item)) {
            return i;
          } else if (item._id && this.data[i]._id == item._id) {
            return i;
          }
        }
        return -1;
      },
      addItem: function(item) {
        var index = this.getIndex(item);
        var action = index >= 0 ? 'remove' : 'add';
        console.log(action, index)
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