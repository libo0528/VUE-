<template>
  <div class="category">
    <el-row>
      <el-col :span="24">
        <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品分类</el-breadcrumb-item>
      </el-breadcrumb>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="24">
        <el-button type="success" plain @click='addCategoryTk'>添加分类</el-button>
      </el-col>
    </el-row>

  <!-- 添加商品分类对话框 -->
      <el-dialog title="添加商品分类" :visible.sync="addDialogFormVisible">
        <el-form :model="addForm" label-width="80px" :rules="rules" ref="addCateForm">
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="addForm.cat_name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="父级分类" >
            <el-cascader
                :props='props'
                :options="options"
                v-model="selectedOptions"
                @change="handleChange">
            </el-cascader>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addDialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="addCateSubmit('addCateForm')">确 定</el-button>
        </div>
      </el-dialog>
        <!-- 编辑商品分类对话框 -->
      <el-dialog title="编辑商品分类" :visible.sync="editDialogFormVisible">
        <el-form :model="editForm" label-width="80px" :rules="rules" ref="editCateForm">
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="editForm.cat_name" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editDialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="editCateSubmit('editCateForm')">确 定</el-button>
        </div>
      </el-dialog>

    <tree-grid
      v-loading='loading'
      :treeStructure="true"
      :columns="columns"
      :data-source="dataSource"
      @deleteCate="deleteCategory"
      @editCate="editCategory"
    >
    </tree-grid>

    <div class="page">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="1"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>

  </div>
</template>
<script>
import TreeGrid from '@/components/TreeGrid/TreeGrid'
import {categoryList,addCategory,delCategory,getCategoryById,updateCategory} from '@/api'
export default {
  data () {
    return {
        //页面加载图片
      loading:false,
        //隐藏编辑分类窗口
      editDialogFormVisible:false,
         //编辑分类表信息
      editForm:{
          cat_id:'',
          cat_name:'',
      },
      //隐藏添加分类弹窗
      addDialogFormVisible:false,
      //添加分类表信息
      addForm:{
          cat_name:'',
          cat_pid:0,
          cat_level:0
      },
      //分类验证规则
        rules: {
          cat_name: [
            { required: true, message: '请输入分类名', trigger: 'blur' }
          ]
        },
        //添加分类级联  // props表示配置级联选择器展示的数据字段
        props:{
            value:'cat_id',
            label:'cat_name'
        },
        options: [{
          cat_id: 'zhinan',
          cat_name: '指南',
          children: [
              {cat_id: 'shejiyuanze',cat_name: '设计原则',},
              {cat_id: 'shejiyuanze',cat_name: '设计原则',},
              ]
        },
        {
          cat_id: 'zhinan22',
          cat_name: '指南22',
          children: [
              {cat_id: 'shejiyuanze',cat_name: '设计原则22',},
              {cat_id: 'shejiyuanze',cat_name: '设计原则22',},
              ],
        }],
        selectedOptions: [],
        selectedOptions2: [],
      //分页参数
      total: 0,
      pagenum: 1,
      pagesize: 10,
      //TreeGrid
      dataSource: [
        {
          "cat_id": 1,
          "cat_name": "AAA",
          "cat_pid": 0,
          "cat_level": 0,
          "cat_deleted": false,
          "children": [
            {"cat_id": 3, "cat_name": "B1","cat_pid": 1,"cat_level": 1, "cat_deleted": false, "children": [] },
            {"cat_id": 3, "cat_name": "B2","cat_pid": 1,"cat_level": 1, "cat_deleted": false, "children": [] },
          ]
        },
        {
          "cat_id": 1,
          "cat_name": "大家电",
          "cat_pid": 0,
          "cat_level": 0,
          "cat_deleted": false,
          "children": [
            {
                "cat_id": 3,
                "cat_name": "电视",
                "cat_pid": 1,
                "cat_level": 1,
                "cat_deleted": false,
                "children": [
                    {"cat_id": 7,"cat_name": "海信","cat_pid": 3,"cat_level": 2,"cat_deleted": false}, 
                    {"cat_id": 8,"cat_name": "夏普","cat_pid": 3,"cat_level": 2,"cat_deleted": false}
                ]
            }
          ]
        }
      ],
      columns: [{
        text: '分类名称',
        dataIndex: 'cat_name',
        width: ''
      }, {
        text: '是否有效',
        dataIndex: 'cat_deleted',
        width: ''
      }, {
        text: '排序',
        dataIndex: 'cat_level',
        width: ''
      }]
    }
  },
  //声明页面组件
  components: {
    TreeGrid
  },
  //加载页面时候触发
  created () {
    this.initList()
  },
  methods: {
    //初始化表格数据
    initList () {
        this.loading=true
        categoryList(3,this.pagenum,this.pagesize).then(res=>{
            if(res.meta.status==200){
                this.dataSource=res.data.result
                this.total=res.data.total
                this.loading=false
            }else{
                this.$message.error(res.meta.msg)
            }
        })
    },
    //###分页
    handleSizeChange (val) {
    //   console.log(`每页 ${val} 条`)
    this.pagesize=val
    this.initList()
    },
    handleCurrentChange (val) {
    //   console.log(`当前页: ${val}`)
    this.pagenum=val
    this.initList()
    },
    //TreeGrid
    // 删除分类
    deleteCategory(id){
      // console.log(id)
       this.$confirm('此操作将永久删除该分类,会影响分类结果, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delCategory(id).then(res=>{
            // console.log(id);return;
            if(res.meta.status==200){
              this.$message({
                type: 'success',
                message: res.meta.msg
              })
              this.initList()
            }else{
              this.$message({
                type: 'error',
                message:  res.meta.msg
              })
            }
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    //显示编辑分类窗口 及默认显示名字
    editCategory (cid) {
      // console.log(cid)
       this.editDialogFormVisible=true
      getCategoryById(cid).then(res=>{
        // console.log(res.data);return;
        if(res.meta.status==200){
          this.editForm.cat_name=res.data.cat_name
          this.editForm.cat_id=res.data.cat_id
        }else{
          this.$message.error(res.meta.msg)
        }
      })
    },
    //编辑分类数据处理
    editCateSubmit(){
      this.$refs.editCateForm.validate(valide=>{
            if(valide){
               updateCategory(this.editForm.cat_id,this.editForm.cat_name).then(res=>{
                  if(res.meta.status==200){
                    this.$message({
                      type:'success',
                      message:res.meta.msg
                    })
                    this.editDialogFormVisible=false
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
    //添加商品弹窗 分类中的父级分类
    addCategoryTk(){
        this.addDialogFormVisible=true
        //显示分类中的父级分类
         categoryList(2,1,1000).then(res=>{
            if(res.meta.status==200){
                this.options=res.data.result
                this.total=res.data.total
                this.loading=false
            }else{
                this.$message.error(res.meta.msg)
            }
        })
    },
    //切换添加分类级联
    handleChange(value) {
        // console.log(value);
      },
    //保存添加商品分类的信息
    addCateSubmit(){
      //   console.log(this.selectedOptions)   
      //selectedOptions返回数据中 包含选择的分类id
      if(this.selectedOptions.length==0){
          this.addForm.cat_pid=0
          this.addForm.cat_level=0
      }else if(this.selectedOptions.length==1){
          this.addForm.cat_pid=this.selectedOptions[0]
          this.addForm.cat_level=1
      }else if(this.selectedOptions.length==2){
          this.addForm.cat_pid=this.selectedOptions[1]
          this.addForm.cat_level=2
      }
        //先表单验证
        this.$refs.addCateForm.validate(valide=>{
          if(valide){
            addCategory(this.addForm).then(res=>{
              // console.log(res)
              if(res.meta.status==201){
                this.$message({
                  type:'success',
                  message:res.meta.msg
                })
              }else{
                  this.$message.error(res.meta.msg)
              }
              //关闭添加窗口
              this.addDialogFormVisible=false
              //获取最新用户数据
              this.initList()
            })
          }
        })
    },
   
    
  }
}
</script>
<style scoped>
.page {
  padding: 5px 0;
  background-color: #D3DCE6;
}
</style>