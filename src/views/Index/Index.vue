<template>
  <div class="home">
      <el-container>
        <!-- 侧边栏 -->
        <el-aside width="auto">
          <div class="logo"></div>
          <el-menu
            :router="true"
            :unique-opened="true"
            :collapse="isCollapse"
            class="el-menu-admin"
            @open="handleOpen"
            @close="handleClose"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b">
            <el-submenu :index="item.path" v-for="item in menuData" :key="item.id">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>{{item.authName}}</span>
              </template>
              <el-menu-item :index="tag.path" v-for="tag in item.children" :key="tag.id">
                <i class="el-icon-menu"></i>
                <span slot="title">{{tag.authName}}</span>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-container>

          <!-- header部分 -->
          <el-header>
            <i class="myicon myicon-menu toggle-btn" @click="toggleCollapse"></i>
            <div class="system-title">电商后台管理系统</div>
            <div>
              <span class="welcome">
                您好，{{username}}
              </span>
              <el-button type="text" @click="logout">退出</el-button>
            </div>
          </el-header>

          <!-- 中间内容部分 -->
          <el-main>
            <router-view></router-view>
          </el-main>
        </el-container>
      </el-container>
    </div>
</template>
<script>
//导入文件 必须和目标文件中的 名字相同
// 名字必须加大括号        （ps：@代表src目录 默认引入目录的index文件）
import {checkUser,menuList} from '@/api'
export default{
  created (){
    menuList().then(res=>{
      if(res.meta.status==200){
          this.menuData=res.data
      }else{
        this.$message.error(res.meta.msg)
      }
    })
  },
  methods: {
        handleOpen (key, keyPath) {
          console.log(key, keyPath)
        },
        handleClose (key, keyPath) {
          console.log(key, keyPath)
        },
        toggleCollapse () {
          this.isCollapse = !this.isCollapse
        },
        logout () {
          // 清除登录状态，即保存在localStorage中的token
          localStorage.removeItem('mytoken')
          // 跳转到登录页面
          this.$router.push({name: 'Login'})
        }
      },
    data(){
        return{
            username:localStorage.getItem('username'),
            isCollapse: false,
            //导航数据
            menuData: [
            {
                "id":125, "authName":"用户管理", "path":"user",
                "children": [
                {"id":110,"authName":"用户列表","path":"user"}
                ]
            },
            {
                "id":103,"authName":"权限管理","path":"rights",
                "children":[
                {"id":111,"authName":"角色列表","path":"role"},
                {"id":112,"authName":"权限列表","path":"auth"}
                ]
            },
            {
                "id":101,"authName":"商品管理","path":"goods",
                "children":[
                {"id":104,"authName":"商品列表","path":"goods"},
                {"id":115,"authName":"分类参数","path":"params"},
                {"id":121,"authName":"商品分类","path":"category"}
                ]
            },
            {
                "id":102,"authName":"订单管理","path":"orders",
                "children":[
                {"id":107,"authName":"订单列表","path":"orders"}
                ]
            }
            ]
        }
    }
}
</script>

<style scoped>
    .home {
        height: 100%;
    }
    .el-menu{
        width: 100%;
    }
    .el-menu-admin:not(.el-menu--collapse) {
        width: 200px;
        min-height: 400px;
        } 
    .home .el-container {
        height: 100%;
    }
    .home .el-aside {
        background-color: #545c64;
    }
    .home .el-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #545c64;
    }
    .home .logo {
        height:60px;
        background: url(../../assets/logo.png);
        background-size: cover;
        background-color: #989898;
    }
    .home .toggle-btn {
        font-size: 36px;
        color: #989898;
        cursor: pointer;
        line-height: 60px;
    }
    .home .system-title {
        font-size: 28px;
        color: white;
    }
    .home .welcome {
        color: white;
    }
  </style>
