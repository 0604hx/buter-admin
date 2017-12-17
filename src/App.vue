<template>
  <div id="app">
    <MenuBar class="fixed-header" ref="menu"></MenuBar>
    <div class="p10">
        <router-view></router-view>
    </div>
    
    <Global></Global>
  </div>
</template>

<script>
  import MenuBar from 'C/menubar.vue'
  import Global from 'V/Global.vue'

  export default {
    name: 'app',
    components: {
      MenuBar, Global
    }
  }
</script>

<style>
  body {
    font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, \\5FAE\8F6F\96C5\9ED1, Arial, sans-serif;
  }
</style>