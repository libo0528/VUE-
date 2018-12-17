<template>
  <div class="roles">
    <el-row>
      <el-col :span="24">
        <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色列表</el-breadcrumb-item>
      </el-breadcrumb>
      </el-col>
    </el-row>
    <el-button type="primary" plain @click='addRoleFormTk=true'>添加角色</el-button>
    <el-table
      border
      class="mt-15"
      :data="roleList"
      style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <!-- 第一列 -->
          <el-row v-for="one in scope.row.children" :key='one.id'>
            <el-col :span="4">
              <el-tag closable @close="deleteRight(scope.row, one.id)">{{one.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col :span="20">
              <!-- 第二列 -->
              <el-row v-for="two in one.children" :key='two.id'>
                <el-col :span="4">
                  <el-tag closable type="success" @close="deleteRight(scope.row, two.id)">{{two.authName}}</el-tag>
                  <i class="el-icon-arrow-right" ></i>
                </el-col>
                <el-col :span="20">
                  <!-- 第三列 -->
                  <el-tag v-for="three in two.children" :key='three.id' @close="deleteRight(scope.row, three.id)" closable type="warning">{{three.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>

          <el-row v-if="scope.row.children.length === 0">
            <el-col :span="24">该角色没有分配权限，请前往分配！</el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column
        label="角色名称"
        prop="roleName"
        width="165px">
      </el-table-column>
      <el-table-column
        label="描述"
        prop="roleDesc"
        width="130px">
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" plain icon="el-icon-edit" @click="editRoleDialog(scope.row)"></el-button>
          <el-button size="mini" type="danger" plain icon="el-icon-delete" @click="showDeleteDialog(scope.row)"></el-button>
          <el-button size="mini" type="warning" plain icon="el-icon-check" title="授权角色" @click="showDialog(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="授权角色" :visible.sync="dialogFormVisible">
      <div class="tree-container">
        <el-tree
          v-loading="loading"
          :data="authList"
          show-checkbox
          ref="tree"
          node-key="id"
          :default-expand-all="true"
          :default-checked-keys="selectedAuths"
          :props="defaultProps">
        </el-tree>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAssignAuth">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加角色对话框 -->
      <el-dialog title="添加角色" :visible.sync="addRoleFormTk">
        <el-form :model="addForm" label-width="80px" :rules="rules" ref="addRoleForm">
          <el-form-item label="角色名" prop="roleName">
            <el-input v-model="addForm.roleName" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="角色介绍" prop="roleDesc">
            <el-input v-model="addForm.roleDesc" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addRoleFormTk = false">取 消</el-button>
          <el-button type="primary" @click="addRoleForm('addRoleForm')">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 修改角色对话框 -->
      <el-dialog title="修改角色" :visible.sync="editRoleFormTk">
        <el-form :model="editForm" label-width="80px" :rules="rules" ref="editRoleForm">
          <el-form-item label="角色名" prop="roleName">
            <el-input v-model="editForm.roleName" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="角色介绍" prop="roleDesc">
            <el-input v-model="editForm.roleDesc" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editRoleFormTk = false">取 消</el-button>
          <el-button type="primary" @click="editRoleForm('editRoleForm')">确 定</el-button>
        </div>
      </el-dialog>
  </div>
</template>
<script>
import {getRoleList,getAuthList,addRole,deleteRole,deleteRoleAuth,grantRoleAuth,updateRole} from '@/api'
export default {
  data () {
    return {
      loading:false,
      // 添加数据
      addForm:{
        roleName:'',
        roleDesc:'',
      },
      // 验证规则
      rules: {
          roleName: [
            { required: true, message: '请输入角色名', trigger: 'blur' }
          ],
          roleDesc: [
            { required: true, message: '请输入角色介绍', trigger: 'blur' }
          ]
        },
      addRoleFormTk:false,
      //修改角色数据
      editRoleFormTk:false,
      editForm:{
        id:'',
        roleName:'',
        roleDesc:'',
      },
      roleList: [
        {"id": 1, "roleName": "超级管理员", "roleDesc": "小心权限很大", "children": []},
        {"id": 2, "roleName": "主管", "roleDesc": "技术负责人", "children": []},
        {"id": 3, "roleName": "财务", "roleDesc": "财务", "children": []}
      ], 
      dialogFormVisible: false,
      authList:  [
        {
          "id":1,"authName":"订单管理","path":"goods","pid": 0,
          "children": [
            {
              "id": 2,"authName": "订单列表","path": "goods","pid": 101,"children": [
                {"id": 3,"authName": "添加订单","path": "goods","pid": 101,"children":[]},
                {"id": 4,"authName": "取消订单","path": "goods","pid": 101,"children":[]}
              ]
            }
          ]
        },
        {
          "id":5,"authName":"用户管理","path":"goods","pid": 0,
          "children": [
            {
              "id": 6,"authName": "会员列表","path": "goods","pid": 101,"children": [
                {"id": 7,"authName": "添加会员","path": "goods","pid": 101,"children":[]},
                {"id": 8,"authName": "删除会员","path": "goods","pid": 101,"children":[]}
              ]
            }
          ]
        }
      ],
      //
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      selectedAuths: [], //保存默认选中的权限id
      currentRole: {}            //保存点击的角色
    }
  },
  created () {
      this.initList()
  },
  methods: {
    initList () {
        getRoleList().then(res=>{
            // console.log(res.data)
            if(res.meta.status==200){
                this.roleList=res.data
            }
            // this.roleList=res.data
        })
        // 获取权限列表
        getAuthList('tree').then(res=>{
            if(res.meta.status==200){
                this.authList=res.data
            }
        })
    },
    // 新增角色
    addRoleForm(formName){
         //先表单验证
          this.$refs[formName].validate(valide=>{
            if(valide){
              addRole(this.addForm).then(res=>{
                // console.log(res)
                if(res.meta.status==201){
                  this.$message({
                    type:'success',
                    message:'角色创建成功'
                  })
                }
                //关闭添加窗口
                this.addRoleFormTk=false
                //获取最新用户数据
                this.initList()
              })
            }
          })
    },
    // 修改角色数据显示
    editRoleDialog(row){
      this.editRoleFormTk=true
      // console.log(row)
      this.editForm.id=row.id
      this.editForm.roleName=row.roleName
      this.editForm.roleDesc=row.roleDesc
    },
    // 修改角色数据处理
    editRoleForm(){
       this.$refs.editRoleForm.validate(valide=>{
            if(valide){
               updateRole(this.editForm.id,{roleName:this.editForm.roleName,roleDesc:this.editForm.roleDesc}).then(res=>{
                  if(res.meta.status==200){
                    this.$message({
                      type:'success',
                      message:'修改角色成功'
                    })
                    this.editRoleFormTk=false
                    this.initList()
                   }else{
                     this.$message({
                      type:'error',
                      message:res.meta.msg
                    })
                   }
               })
            }
          })
    },
    // 删除角色
    showDeleteDialog(row){
      console.log(row.id)
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteRole(row.id).then(res=>{
            if(res.meta.status==200){
                this.$message({
                type: 'success',
                message: '删除成功!'
              });
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
    deleteRight (row, authId) {
      // console.log(row.children)
      this.$confirm('确定删除该角色的这个权限, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteRoleAuth(row.id,authId).then(res=>{
            console.log(res.data)
            if(res.meta.status==200){
                this.$message({
                type: 'success',
                message: '删除成功!'
              });
              // this.initList()
              //row.children是当前角色的所有权限（详情查看接口文档 角色列表 返回数据）
              //res.data是删除指定权限后 返回数据中角色的权限内容（具体查看接口文档 删除权限 返回数据）
              row.children=res.data
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
    //权限分配
    showDialog (row) {
      this.dialogFormVisible = true
      this.loading=true
      // 获取权限列表
        getAuthList('tree').then(res=>{
            if(res.meta.status==200){
                this.authList=res.data
            }
        })
      //显示默认权限
      //先清空之前的选中效果
      this.selectedAuths=[]
      //1.取出当前点击角色的所有权限， 
      //2.然后遍历到它的第三个children，取ID，放进selectedAuths中 
      row.children.forEach(one=>{
        if(one.children && one.children.length!==0){
          one.children.forEach(two=>{
            if(two.children && two.children.length!==0){
              two.children.forEach(three=>{
                this.selectedAuths.push(three.id)
              })
            }
          })
        }
      })
      this.loading=false
      //保存点击的角色
      this.currentRole=row
    },
    // 提交授权
    submitAssignAuth () {
      var roleId=this.currentRole.id
      var rids=this.$refs.tree.getCheckedKeys().join(',')
      // console.log(ids)
      grantRoleAuth(roleId,{rids:rids}).then(res=>{
          if(res.meta.status==200){
              this.$message({
                type:'success',
                message:res.meta.msg
              })
            }else{
              this.$message.error('更新失败')
            }
          this.dialogFormVisible = false
          this.initList()
      })
      
    }
  }
}
</script>
<style scoped>
.el-tag {
  margin-right: 5px;
  margin-bottom: 5px;
}
.tree-container {
  height: 300px;
  overflow: auto;
}
</style>