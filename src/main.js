import Vue from 'vue'
import App from './App.vue'

import VueRouter from 'vue-router'
import { routes } from './routes'
import store from './store/store';

//先让Vue知道
Vue.use(VueRouter);

//过滤器

Vue.filter('currency', (value) => {
    return '¥' + value.toLocaleString();
});

//再配置
const router = new VueRouter({
    mode: 'history',
    routes: routes
});

//最后让Vue使用上路由
new Vue({
  el: '#app',
  router: router,
  store,
  render: h => h(App)
})
