import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
//导入login路由
import Login from '@/views/Login/Login'
import Index from '@/views/Index/Index'
import Welcome from '@/views/Index/Welcome'
import User from '@/views/User/User'
import Auth from '@/views/RBAC/Auth'
import Role from '@/views/RBAC/Role'
import Category from '@/views/Goods/Category'
import Goods from '@/views/Goods/Goods'
import Goodsadd from '@/views/Goods/GoodsAdd'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index,
      children:[
        { name:'Welcome', path:'welcome',component:Welcome},
        { name:'User',path:'user', component:User},
        {name:'Auth', path:'auth',component:Auth},
        {name:'Role',path:'role',component:Role},
        {name:'Category',path:'category',component:Category},
        {name:'Goods',path:'goods',component:Goods},
        {name:'Goodsadd',path:'goodsadd',component:Goodsadd},
      ]
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
  ]
})
