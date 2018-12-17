// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
//导入app.vue
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI)
Vue.config.productionTip = false
import '@/assets/css/index.css'
//注册一个全局守卫 在跳转前对路由进行判断 放翻墙
router.beforeEach((to,from,next)=>{
  //获取登录标识
  var token=localStorage.getItem('mytoken');
  // console.log(token)
  if(to.path!=='/login' && !token ){
    next({path:'/login'})
  }else{
    next()
  }
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  //是ES6的简写：当对象的键和值一样就可以简写
  router,
  //声明有哪些组件（ps. 之前是Vue.component声明组件，一个文件存放一个组件：html、js、css）
  components: {
     App:App,  
    },
    //声明使用哪个组件（因为：components可以声明多个）
  template: '<App/>'
})
