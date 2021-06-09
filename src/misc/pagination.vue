<template>
  <div class="d-flex align-items-center" :class="$class" v-if="count && start != end">
    <ul class="pagination mb-0">
      <li class="page-item" v-for="page in pages" :class="linkClass(page, 'hidden-xs')">
        <a class="page-link" :href="href(page)" v-html="page.label || page.index"></a>
      </li>
    </ul>
    <span class="btn btn-sm btn-light text-muted ml-2" hidden>
      {{ start }} - {{ end }}
    </span>
  </div>
</template>

<script>
  module.exports = {
    props: ['mode', '$class', 'pagination'],
    data: function() {
      var data = Object.assign({
        count: 0
      }, ViewModels.pagination, this.pagination)
      var params = this.$getQueryParams()
      params.page = 0

      data.page = parseInt(data.page)
      data.pages = this.mode == 'compact' ? this.initCompactPages(data) : this.initExpandedPages(data)
      data.uriTemplate = this.$getUrl(location.pathname, params, location.hash)
      data.start = (data.page - 1) * data.limit + 1
      data.end = Math.min(data.count + 1, data.start + data.limit) - 1

      return data
    },
    methods: {
      href: function(page) {
        if (!page.index || page.index == this.page) {
          return '#'
        }
        return this.uriTemplate.replace(/page=\d+/g, 'page=' + page.index)
      },
      linkClass: function(page, className) {
        if (!page.index) {
          return className + ' disabled';
        } else if (page.index == this.page && !page.label) {
          return className + ' disabled active'
        } else {
          return className;
        }
      },
      initCompactPages: function(data) {
        var pages = [{
          index: data.page,
          active: true
        }]
        var pageCount = Math.ceil(data.count / data.limit)
        for (var i = 1; i < 5; i++) {
          var prev = data.page - i;
          prev >= 1 && pages.unshift({ index: prev })
          var next = data.page + i
          next <= pageCount && pages.push({ index: next })
          if (pages.length >= 5) {
            break
          }
        }
        pages.unshift({
          index: data.page > 1 ? data.page - 1 : null,
          label: '<i class="fa fa-angle-left"></i>'
        })
        pages.unshift({
          index: 1,
          label: '<i class="fa fa-angle-double-left"></i>'
        })
        pages.push({
          index: data.page < pageCount ? data.page + 1 : null,
          label: '<i class="fa fa-angle-right"></i>'
        })
        pages.push({
          index: pageCount,
          label: '<i class="fa fa-angle-double-right"></i>'
        })
        return pages
      },
      initExpandedPages: function(data) {
        var pages = [{
          index: data.page,
          active: true
        }]
        var pageCount = Math.ceil(data.count / data.limit)

        for (var i = 1; i < 3; i++) {
          var prev = data.page - i
          prev >= 1 && pages.unshift({ index: prev })
          var next = data.page + i
          next <= pageCount && pages.push({ index: next })
        }

        if (pages[0].index != 1) {
          pages.unshift({ label: '...' })
          pages.unshift({ index: 1 })
        }

        if (pageCount > 1 && pages[pages.length - 1].index != pageCount) {
          pages.push({ label: '...' })
          pages.push({ index: pageCount });
        }

        pages.unshift({
          index: data.page > 1 ? data.page - 1 : null,
          label: '<i class="fa fa-angle-left"></i>'
        })
        pages.push({
          index: data.page < pageCount ? data.page + 1 : null,
          label: '<i class="fa fa-angle-right"></i>'
        })

        return pages
      },
    }
  }
</script>