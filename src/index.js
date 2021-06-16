// table
Vue.component('el-table-cell', require('./table/table-cell.vue'))
Vue.component('el-table-row', require('./table/table-row.vue'))
Vue.component('el-table', require('./table/table.vue'))

// form
Vue.component('el-switch', require('./form/switch.vue'))
Vue.component('el-field', require('./form/field.vue'))
Vue.component('el-form', require('./form/form.vue'))

// composed
Vue.component('el-toolbar', require('./composed/toolbar.vue'))
Vue.component('el-workbench', require('./composed/workbench.vue'))
Vue.component('el-search-modal', require('./composed/search-modal.vue'))
Vue.component('el-search-form', require('./composed/search-form.vue'))
Vue.component('el-set-editor', require('./composed/set-editor.vue'))
Vue.component('el-mapping-editor', require('./composed/mapping-editor.vue'))

// misc
Vue.component('el-calendar', require('./misc/calendar.vue'))
Vue.component('el-filter', require('./misc/filter.vue'))
Vue.component('el-tabs', require('./misc/tabs.vue'))
Vue.component('el-pagination', require('./misc/pagination.vue'))
Vue.component('el-modal', require('./misc/modal.vue'))
Vue.component('el-date-picker', require('./misc/date-picker.vue'))
Vue.component('el-time-select', require('./misc/time-select.vue'))

// external
Vue.component('el-date-time-picker', require('./external/date-time-picker.vue'))
Vue.component('el-upload', require('./external/upload.vue'))
Vue.component('el-json-editor', require('./external/json-editor.vue'))

const objectPath = require('object-path')
Vue.prototype.$getAttr = function(obj, attr, context) {
  var val = objectPath.get(obj, attr)
  if (val) {
    if (typeof (val) == 'function') {
      return val.call(context)
    } else {
      return val
    }
  }
}
Vue.prototype.$setAttr = function(obj, attr, val) {
  return objectPath.set(obj, attr, val)
}

Vue.prototype.$getQueryParams = function() {
  var params = {};
  if (!window.location.search) {
    return params;
  }
  var query = window.location.search.substring(1);
  var vars = query.split('&');

  for (var i = 0; i < vars.length; i++) {
    var index = vars[i].indexOf('=');
    if (index > 0) {
      params[vars[i].slice(0, index)] = decodeURIComponent(vars[i].substring(index + 1));
    }
  }
  return params;
}

Vue.prototype.$getUrl = function(baseurl, params, hash) {
  var qs = '';
  for (var i in params) {
    qs += '&' + i + '=' + encodeURIComponent(params[i]);
  }
  qs = qs.slice(1);
  qs = '?' + qs;
  var url = baseurl + qs + (hash || '');
  return url
}

Vue.prototype.$filterBy = function(name, value) {
  var params = this.$getQueryParams();
  params.page = 1;
  params[name] = value;
  location.href = this.$getUrl('', params, location.hash);
}

/* resize controls by bootstrap 4 syntax */
Vue.prototype.$resize = function(classnames, options) {
  var _options = Object.assign({}, options)
  if (_options.size) {
    var names = classnames.split(' ')
    names.push(names[0] + '-' + _options.size)
    return names.join(' ')
  } else {
    return classnames
  }
}

Vue.prototype.$isNullOrUndefined = function(val) {
  return typeof (val) == 'undefined' || val === null
}