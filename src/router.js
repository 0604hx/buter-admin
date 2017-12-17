import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

let routes = [
  {
    path: '/demo',
    name: 'demo',
    meta:{
      title:"演示页面"
    },
    component: resolve => require(['V/Demo'], resolve)
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    meta:{
      title:"数据总览"
    },
    component: resolve => require(['V/Dashboard'], resolve)
  },
  {
    path: '/app',
    name: 'app',
    meta:{
      title:"应用管理"
    },
    component: resolve => require(['V/application/Index'], resolve)
  },
  {
    path: '/detail/:name', name:'detail', 
    meta:{
      title:"应用详情"
    },
    component: resolve => require(['V/application/Detail'], resolve),
    children:[
      { path: '/detail/:name/fs', meta:{title:"文件管理-应用详情"}, component: resolve => require(['V/application/FileSystem'], resolve)},
      { path: '/detail/:name/monitor', meta:{title:"状态监控-应用详情"}, component: resolve => require(['V/application/Monitor'], resolve)}
    ]
  },
  {
    path: '*',
    redirect: '/demo'
  }
]

export default new Router({
  routes
})