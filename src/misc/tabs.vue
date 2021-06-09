<template>
  <ul class="nav nav-tabs" :class="$class" v-if="tabs && tabs.length">
    <li class="nav-item" v-for="tab in tabs">
      <a :class="tab.active ? 'nav-link active' : 'nav-link'" :href="tab.href">{{ tab.label }}</a>
    </li>
  </ul>
</template>

<script>
  module.exports = {
    template: '#TabsTemplate',
    props: ['$class', 'tabs'],
  }
</script>