<template>
  <div>
    <form class="form-inline mb-3" @submit.prevent="queryItems()">
      <div class="input-group input-group-sm">
        <input type="text" class="form-control" v-model="searchFilter" :placeholder="view.source.placeholder">
        <div class="input-group-append">
          <a class="btn btn-outline-secondary" v-if="searchFilter" @click="clearFilter()">
            <i class="fa fa-times"></i>
          </a>
          <button type="submit" class="btn btn-secondary"><i class="fa fa-search"></i></i></button>
        </div>
      </div>
    </form>
    <div class="row">
      <div class="col" :class="sourceCol">
        <b class="text-secondary">{{ view.source.label || '查询结果' }}</b>
        <table class="table table-sm table-striped">
          <thead>
            <tr>
              <th v-for="column in view.source.columns">{{ column.label }}</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, itemIndex) in searchResults" v-if="!matchTarget(item)">
              <td v-for="(column, colIndex) in view.source.columns">
                <el-static-field :data="item" :field="column" :index="colIndex">
                </el-static-field>
              </td>
              <td>
                <a href="javascript:;" class="fa fa-plus text-secondary" @click="addItem(item)">
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="col" :class="targetCol">
        <b class="text-secondary">{{ view.target.title || '数据管理' }}</b>
        <table class="table table-sm table-striped">
          <thead>
            <tr>
              <th v-for="column in view.target.columns">{{ column.label }}</th>
              <th v-if="view.target.sortable">排序</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, itemIndex) in target">
              <td v-for="(column, colIndex) in view.target.columns">
                <el-form-field
                  :field="column"
                  :data="item"
                  :options="{size: 'sm', hide_label: true }"></el-form-field>
              </td>
              <td v-if="view.target.sortable">
                <a role="button" class="fa fa-chevron-up text-secondary"
                  @click="moveItem(itemIndex, -1)">
                </a>
                <a role="button" class="fa fa-chevron-down text-secondary"
                  @click="moveItem(itemIndex, 1)">
                </a>
              </td>
              <td>
                <a role="button" class="fa fa-trash-alt text-secondary" @click="removeItem(itemIndex)">
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="col-12 text-right">
        <a class="btn btn-sm btn-outline-secondary" data-dismiss="modal">取消</a>
        <a class="btn btn-sm btn-success" @click="doSave">保存</a>
      </div>
    </div>
  </div>
</template>

<script>
  module.exports = {
    props: [
      'data', 'view', 'source',
    ],
    data: function() {
      return {
        target: this.data || [],
        searchFilter: '',
        searchResults: [],
        sourceCol: 'col',
        targetCol: 'col',
      }
    },
    watch: {
      data: function(newVal, oldVal) {
        this.target = newVal
      }
    },
    mounted: function() {
      if (this.view.layout) {
        var layout = this.view.layout.split('|')
        this.sourceCol = layout[0]
        this.targetCol = layout[1]
      }
    },
    methods: {
      queryItems: function() {
        var self = this;
        if (!this.searchFilter) {
          return;
        }

        if (this.view.source.api) {
          Vue.resource(this.view.source.api).get({
            filter: self.searchFilter
          }).then(function(res) {
            if (res.body.errMsg) {
              return g_alert(res.body.errMsg);
            }
            self.searchResults = res.body;
          })
        } else if (this.view.source.get) {
          this.view.source.get(self.searchFilter, function(err, data) {
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
      matchTarget: function(item) {
        if (!this.view.match && typeof (this.view.match) != 'function') {
          return false
        }
        for (var i in this.target) {
          if (this.view.match(item, this.target[i])) {
            return true
          }
        }
        return false
      },
      transform: function(item) {
        if (typeof (this.view.transform) == 'function') {
          return this.view.transform(item)
        } else {
          return item
        }
      },
      addItem: function(item) {
        this.target.push(this.transform(item))
        this.$emit('change', this.target)
      },
      removeItem: function(index) {
        if (!confirm('请再次确认移除该')) {
          return;
        }
        this.target.splice(index, 1)
        this.$emit('change', this.target)
      },
      moveItem: function(index, offset) {
        var item = this.target.splice(index, 1)[0];
        this.target.splice(index + offset, 0, item);
        this.$emit('change', this.target);
      },
      doSave: function() {
        this.$emit('save', this.target);
      }
    }
  }
</script>