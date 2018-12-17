<template>
  <div class="user">
      <el-row>
        <el-col :span="24">
          <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>用户管理</el-breadcrumb-item>
          <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <!-- 给组件绑定原生事件的话，需要一个.native的修饰符 -->
          <el-input placeholder="请输入内容" class="search-input" v-model="query">
            <el-button slot="append" icon="el-icon-search" @click='search'></el-button>
          </el-input>
          <el-button type="success" plain @click="addDialogFormVisible=true">添加用户</el-button>
        </el-col>
      </el-row>

      <el-table
        class="margin-20"
        v-loading="loading"
        :data="userList"
        border
        style="width: 100%">
        <el-table-column
          type="index"
          width="50">
        </el-table-column>
        <el-table-column
          prop="username"
          label="姓名"
          width="180">
        </el-table-column>
        <el-table-column
          prop="email"
          label="邮箱"
          width="180">
        </el-table-column>
        <el-table-column
          prop="mobile"
          label="电话">
        </el-table-column>
        <el-table-column label="用户状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="changeUserState11(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" plain icon="el-icon-edit" @click="showEditDialog(scope.row)"></el-button>
            <el-button size="mini" type="danger" plain icon="el-icon-delete" @click="showDeleteDialog(scope.row)" v-if="scope.row.id!=500"></el-button>
            <el-button size="mini" type="warning" plain icon="el-icon-check" @click="showRoleDialog(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="page">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="1"
          :page-sizes="[1, 2, 3, 4]"
          :page-size="pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
 
      <!-- 添加用户对话框 -->
      <el-dialog title="添加用户" :visible.sync="addDialogFormVisible">
        <el-form :model="addForm" label-width="80px" :rules="rules" ref="addUserForm">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="mobile">
            <el-input v-model="addForm.mobile" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addDialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUserSubmit('addUserForm')">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 编辑用户对话框 -->
      <el-dialog title="编辑用户" :visible.sync="editDialogFormVisible">
        <el-form :model="editForm" label-width="80px" :rules="rules" ref="editUserForm">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="editForm.username" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="mobile">
            <el-input v-model="editForm.mobile" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editDialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUserSubmit('editUserForm')">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 分配角色对话框 -->
      <el-dialog title="分配角色" :visible.sync="grantDialogFormVisible">
        <el-form :model="grantForm" label-width="120px">
          <el-form-item label="当前的用户：" prop="username">
            <el-tag type="info">{{grantForm.username}}</el-tag>
          </el-form-item>
          <el-form-item label="请选择角色：">
            <el-select v-model="roleId" placeholder="请选择角色" v-if="grantForm.id!=500">
              <el-option
                v-for="(role, index) in roleList"
                :key="index"
                :label="role.roleName"
                :value="role.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="grantDialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="grantUserSubmit()">确 定</el-button>
        </div>
      </el-dialog>
    </div>
</template>

<script>
//导入用户查询接口
import {getUserList,changeUserState,addUser,deleteUser,getRoleList,updateUser,grantUserRoler} from '@/api'
export default {
  data(){
    return{
      loading: false,
        userList: [
          {"id":1,"role_name":"超级管理员1","username":"admin","create_time":1486720211,"mobile":"12345678","email":"adsfad@qq.com","mg_state":true},
          {"id":2,"role_name":"超级管理员2","username":"admin","create_time":1486720211,"mobile":"12345678","email":"adsfad@qq.com","mg_state":true}
          ],
        query: '',
        total: 0,
        pagesize: 3,
        pagenum: 1,

        //###添加数据
        addDialogFormVisible: false,
        addForm: {
          username: '',
          password: '',
          email: '',
          mobile: '',
        },
        rules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' }
          ],
          email: [
            { required: true, message: '请输入邮箱地址', trigger: 'blur' },
            { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
          ],
          mobile: [
            { required: true, message: '电话不能为空' }
          ]
        },
        //###修改数据
        editDialogFormVisible: false,
        editForm: {
          username: '',
          email: '',
          mobile: '',
          id: 0
        },
        //分配角色
        grantDialogFormVisible: false,
        grantForm: {},
        roleId: '',
        roleList: [],
    }
  },
  created() {
      //网页加载时调用initList方法获取数据
      this.initList()
  },
  methods: {
        //获取最新用户列表
        initList:function(){
          //显示loading效果
          this.loading=true
          //请求接口获取数据
          getUserList({params: {
              query:this.query,
              pagenum:this.pagenum,
              pagesize:this.pagesize
              }
            }).then(res=>{
            // console.log(res)
            //更新数据
            this.userList=res.data.users
            this.total=res.data.total
            //隐藏loading效果
            this.loading=false
          })
        },
        //搜索
        search(){
          this.initList()
        },
        //添加新用户
        addUserSubmit(formName){
          // console.log(this.addForm)
          //先表单验证
          this.$refs[formName].validate(valide=>{
            if(valide){
              addUser(this.addForm).then(res=>{
                // console.log(res)
                if(res.meta.status==201){
                  this.$message({
                    type:'success',
                    message:'用户创建成功'
                  })
                }
                //关闭添加窗口
                this.addDialogFormVisible=false
                //获取最新用户数据
                this.initList()
              })
            }
          })
        },
        // 删除用户信息
        showDeleteDialog(row){
          // console.log(row)
          //显示提示删除的对话框
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              //调用删除的接口 删除
              deleteUser(row.id).then(res=>{
                if(res.meta.status==200){
                    this.$message({
                    type: 'success',
                    message: '删除成功!'
                  });
                //重新获取最新数据
                 this.initList()
                }else{
                  this.$message({
                    type:'error',
                    message:res.meta.msg
                  })
                }
              })
           }).catch(() => {
              this.$message({
              type: 'info',
              message: '已取消删除'
            });          
          });
        },
        //显示编辑用户对话框
        showEditDialog: function (row) {
          this.editDialogFormVisible = true
          this.editForm.username = row.username
          this.editForm.email = row.email
          this.editForm.mobile = row.mobile
          this.editForm.id = row.id
        },
        //显示分配角色对话框
        showRoleDialog (row) {
          this.grantForm = row
          this.grantDialogFormVisible = true
          this.roleList = [
            // {id: 1, roleName: '你爸爸1'},
            // {id: 2, roleName: '你爸爸2'},
            // {id: 3, roleName: '你爸爸3'},
          ]
          //显示可选择的角色列表
            getRoleList().then(res=>{
              if(res.meta.status==200){
                this.roleList=res.data
                //默认显示当前用户的角色
                this.roleList.forEach(temp=>{
                  //遍历获取到的总的角色列表 如果角色名和当前行（点开的用户）的角色名字相同，赋值给双向绑定的roleId 就//显示默认显示效果
                  if(temp.roleName==row.role_name){
                    this.roleId=temp.id
                  }
                })
              }else{
                this.$message.error(res.meta.msg)
              }
            })
        },
        //处理分配角色数据
        // grantForm.id,roleId在显示分配角色的的时候保存到了数据中
        grantUserSubmit(){
          if(!this.roleId){
            this.$message({
              type:'warning',
              message:'角色不能为空，请选择'
            })
          }else{
              grantUserRoler(this.grantForm.id,this.roleId).then(res=>{
                console.log(this.grantForm)
                if(res.meta.status==200){
                  this.$message({
                    type:'success',
                    message:res.meta.msg
                  })
                  this.grantDialogFormVisible = false
                }else{
                  this.$message.error(res.meta.msg)
                }   
            })
          }          
        },
        //改变用户状态
        changeUserState11 (row) {
          // console.log(typeof row.id); return;
          changeUserState({uid:row.id,type:row.mg_state}).then(res=>{
            if(res.meta.status==200){
              this.$message({
                type:'success',
                message:'修改用户状态成功'
              })
            }else{
              this.$message({
                type:'waring',
                message:res.meta.msg
              })
            }
          })
        },
        //编辑用户
        editUserSubmit(){
          updateUser(this.editForm.id,this.editForm).then(res=>{
            if(res.meta.status==200){
              this.$message({
                type:'success',
                message:res.meta.msg
              })
              this.editDialogFormVisible=false
              this.initList()
            }else{
              this.$message.error(res.meta.msg)
            }
          })
        },
        handleSizeChange (val) {
          // console.log(`每页 ${val} 条`)
          this.pagesize=val;
          this.initList();
        },
        handleCurrentChange (val) {
          // console.log(`当前页: ${val}`)
          this.pagenum=val;
          this.initList()
        }
      }
}
</script>

<style>
  .user .margin-20 { 
    margin: 20px 0;
  }
  .user .search-input {
    width: 300px;
  }
  .user .page {
    padding: 5px 0;
    background-color: #D3DCE6;
  }
 
</style>