import Vue from 'vue'
import App from './App.vue'

import VueRouter from 'vue-router'
import { routes } from './routes'

//先让Vue知道
Vue.use(VueRouter);

//再配置
const router = new VueRouter({
    mode: 'history',
    routes: routes
});

//最后让Vue使用上路由
new Vue({
  el: '#app',
  router: router,
  render: h => h(App)
})
