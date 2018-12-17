<template>
  <div class="login">
        <el-form ref="form" :model="form" class="container" :rules="rules">
          <el-form-item>
            <div class="avatar">
              <img src="../../assets/img/avatar.jpg" alt="">
            </div>
          </el-form-item>
          <el-form-item prop='username'>
            <el-input v-model="form.username" placeholder="账户" prefix-icon="myicon myicon-user"></el-input>
          </el-form-item>
          <el-form-item prop='password'>
            <el-input v-model="form.password" placeholder="密码" prefix-icon="myicon myicon-key" type="password" ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="login-btn" @click="loginSubmit()">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
</template>
<script>
//导入文件 必须和目标文件中的 名字相同
// 名字必须加大括号        （ps：@代表src目录 默认引入目录的index文件）
import {checkUser} from '@/api'
export default{
  methods:{
    //定义表单提交的方法
    loginSubmit(){
      //通过唯一表示ref 查找元素
      // alert(22);return;
      this.$refs.form.validate(valide=>{
        if(valide){
          // console.log(valide)  布尔值
          checkUser(this.form).then(res=>{
            // console.log(res.data.token)
            //res是接口文档相应的数据
            if(res.meta.status==200){
              //存储用户令牌  与php中的session标识相同作用
              localStorage.setItem('mytoken',res.data.token);
              //存储用户信息
              localStorage.setItem('username',res.data.username)
              // 校对数据库成功后跳转
              this.$router.push({name:'Welcome'})
            }else{
              this.$message({
                type:'error',
                message:res.meta.msg
              })
            }
          })
        }else{
          console.log('验证失败')
        }
      })
    }
  },
    data(){
      //自定义的表单验证规则  在返回数据的对象中直接调用
      var validateusername = (rule, value, callback) => {
          if (value.length<3) {
            callback(new Error('用户名至少3个字符'));
          } else if (value.length>8) {
            callback(new Error('用户名不得超过8个字符!'));
          } else {
            callback();
          }
      };
        return{
            form:{
                username:'',
                password:''
            },
             rules: {
                username: [
                  { required: true, message: '用户名必填', trigger: 'blur' },
                  // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                   { validator: validateusername, trigger: 'blur' }
                ],
                password: [
                  { required: true, message: '密码必填', trigger: 'blur' }
                ],
             }
        }
    }
}
</script>

<style scoped>
  .login {
    position: fixed;
    width: 100%;
    height: 100%;
    background-color: #2f4050;
  }
  .login .container {
      position: absolute;
      left: 0;
      right: 0;
      width: 400px;
      padding: 0px 40px 15px 40px;
      margin: 200px auto;
      background: white;
  }
  .login .container .avatar {
        position: relative;
        left: 50%;
        width: 120px;
        height: 120px;
        margin-left: -60px;
        margin-top: -60px;
        box-sizing: border-box;
        border-radius: 50%;
        border: 10px solid #fff;
        box-shadow: 0 1px 5px #ccc;
        overflow: hidden;
  }
  .login .container .login-btn { width: 100%; }
  </style>
