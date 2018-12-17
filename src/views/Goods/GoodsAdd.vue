<template>
    <div class="GoodsAdd">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品添加</el-breadcrumb-item>
        </el-breadcrumb>
        <div style="width:80%;margin:20px auto">
            <el-steps :active="active" finish-status="success">
            <el-step title="步骤 1"></el-step>
            <el-step title="步骤 2"></el-step>
            <el-step title="步骤 3"></el-step>
            <el-step title="步骤 4"></el-step>
            <el-step title="步骤 5"></el-step>
        </el-steps>
        </div>
        <!--
            :rules 
            :ref="获取表单"
            :model  表单数据对象   -  作用：表单验证使用（配合rules ref一起使用）
            双向绑定-同步数据
            v-model="form.goods_name"  
        -->
        <el-form ref="form" :model="form" label-width="80px" :rules="rules">
            <el-tabs v-model="activeName" @tab-click="handleClick" tab-position='left'>
                <el-tab-pane label="基本信息" name="one">
                        <el-form-item label="商品名称" prop='goods_name'>
                            <el-input v-model="form.goods_name" ></el-input>
                        </el-form-item>
                        <el-form-item label="商品价格" prop='goods_price'>
                            <el-input v-model="form.goods_price"></el-input>
                        </el-form-item>
                        <el-form-item label="商品重量" prop='goods_weight'>
                            <el-input v-model="form.goods_weight"></el-input>
                        </el-form-item>
                        <el-form-item label="商品数量" prop='goods_number'>
                            <el-input v-model="form.goods_number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品分类" prop='goods_cat'>
                            <el-form-item label="商品分类">
                                <!--
                                el-cascader标签
                                里面的参数：1-属性，2-事件 
                                options 数据来源
                                selectedOptions 选中的结果会自动放到
                                handleChange 选择后触发事件
                                props声明 option中的 value 和 名字 用哪个字段（默认：名字label，值-value）
                                -->
                                <el-cascader
                                :options="options" v-model="selectedOptions"  :props="props" >
                                </el-cascader>
                            </el-form-item>
                        </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="商品参数" name="two">商品参数</el-tab-pane>
                <el-tab-pane label="商品属性" name="three">商品属性</el-tab-pane>
                <el-tab-pane label="商品图片" name="four">
                    <el-upload
                        class="upload-demo"
                        action="http://localhost:8888/api/private/v1/upload"
                        :on-preview="handlePreview"
                        :on-remove="handleRemove"
                        :on-success="handleSuccess"
                        :file-list="fileList"
                        :headers="setHeaders()"
                        list-type="picture">
                        <el-button size="small" type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                    </el-upload>
                </el-tab-pane>
                <el-tab-pane label="商品内容" name="five">
                    <textarea name="goods_introduce" id="" cols="80" rows="12"  v-model="form.goods_introduce"></textarea>
                </el-tab-pane>
            </el-tabs>
        </el-form>

        <el-button style="margin-top: 12px;" @click="submitForm">提交</el-button>
    </div>
</template>
<script>
import {categoryList,addGoods} from '@/api'
  export default {
    data() {
      return {
        fileList: [
            // {name: 'food.jpeg', 
            // url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}, 
            // {name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}
            ],
          //商品分类属性
          options:[],
          selectedOptions:[],   //选择的商品分类
          //级联选择器显示的字段名 和 字段值
          props:{
              value:'cat_id',
              label:'cat_name'
          },
          //表单属性
        form: {
            goods_name: '',
            goods_price: '',
            goods_weight: '',
            goods_introduce:'',
            goods_number: '',
            goods_cat: '',  //逗号隔开
            pics:[]
        },
        activeName: 'one',
        active: 0,
        rules: {
                goods_name: [
                    { required: true, message: '请输入商品名', trigger: 'blur' },
                    { min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur' }
                ],
                goods_price: [
                    { required: true, message: '请输入价格', trigger: 'blur' }
                ],
                goods_weight: [
                    { required: true, message: '请输入商品重量', trigger: 'blur' },
                ],
                goods_number: [
                    { required: true, message: '商品数量不能为空' , trigger: 'blur'}
                ]
            },
      };
    },
    mounted(){
        categoryList(3,1,1000).then(res=>{
            if(res.meta.status==200){
                this.options=res.data.result
            }else{
                this.$message.error(res.meta.msg)
            }
        })
    },
    methods: {
        //给上传你的图片加设置header头 加token
        setHeaders(){
            let token=localStorage.getItem('mytoken')
            return {Authorization:token}
        },
        //上传图片成功后出发函数handleSuccess  
        handleSuccess(response, file, fileList){
          //获取响应的数据 加到pics中 
        //   console.log(response)
        this.form.pics.push({
            pic:response.data.tmp_path
        })

        },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      //切换步骤
      handleClick(tab) {
        // console.log(tab.name);
        switch(tab.name){
            case 'one':this.active=1;break;
            case 'two':this.active=2;break;
            case 'three':this.active=3;break;
            case 'four':this.active=4;break;
            case 'five':this.active=5;break;
            default:
                this.active = 1
        }
      },
      //添加商品 数据处理
      submitForm(){
          if(this.selectedOptions.length!=3){
              this.$message.error('商品分类必须为三级')
              return
          }
          this.form.goods_cat=this.selectedOptions.join(',')
        //   console.log(this.form.goods_cat)
            // console.log(this.form.pics)
          this.$refs.form.validate(valide=>{
            if(valide){
              addGoods(this.form).then(res=>{
                // console.log(res)
                if(res.meta.status==201){
                  this.$message({
                    type:'success',
                    message:res.meta.msg
                  })
                  this.$router.push({name:'Goods'})
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
    }
  }
</script>
<style>

</style>