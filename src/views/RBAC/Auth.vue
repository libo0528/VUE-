<template>
    <div >
    <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
     <el-table
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        :data="tableData"
        border
        style="width: 100%">
        <el-table-column
        prop="id"
        label="编号"
        width="180">
        </el-table-column>
        <el-table-column
        prop="authName"
        label="权限名称"
        width="180">
        </el-table-column>
        <el-table-column
        prop="path"
        label="路径">
        </el-table-column>
        <!-- <el-table-column
        prop="level"
        label="等级">
        </el-table-column> -->
        <el-table-column label="等级">
          <template slot-scope="scope">
            {{scope.row.level | fmtLevel}}
          </template>
        </el-table-column>
  </el-table>
    </div>
</template>
<script>
import {getAuthList} from '@/api'
    export default {
    created(){
        this.initList()
    },
    filters:{
        fmtLevel(level){
            if(level==0){
                return '一级'
            }else if(level==1){
                return '二级'
            }else if(level==2){
                return '三级'
            }
        }
    },
    data() {
      return {
        loading:false,
        tableData: [{
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }]
      }
    },
    methods:{
        initList(){
            this.loading=true,
           getAuthList('list').then(res=>{
            //    console.log(res)
            if(res.meta.status==200){
                this.tableData=res.data
                this.loading=false
            }
           })
        }
    }
  }
</script>
<style>

</style>