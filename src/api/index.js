//1.导入axios模块
import axios from 'axios'
//2.定义接口网址（后面调用get或post请求会自动拼接该网址发送请求）
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
//3.添加请求拦截器
axios.interceptors.request.use(function (config) {
    //1.获取token
    var mytoken = localStorage.getItem('mytoken')
    // console.log(mytoken)
    //2.判断
    if (mytoken) {
        //设置请求头（后期请求接口 http请求头携带Authorization参数）
        config.headers['Authorization'] = mytoken
    }
    return config
}, function (error) {
    // Do something with request error
    return Promise.reject(error)
})
/**
 * ###定义相关接口（注：1-以下用来es6语法可以预习今天课件  2-vue学完再反过来看 ）
 * ###调用
 * 1-导入：import {变量名} from '@/api'
 * 2-使用：变量名(参数....).then(res => console.log(res))    ps.打印的res数据格式在接口文档已声明
 */

// 登录验证 
export const checkUser = params => {
    return axios.post('login', params).then(res => res.data)
}
//获取用户列表 
export const getUserList = params => {
    return axios.get('users', params).then(res => res.data)
}
//修改用户状态
export const changeUserState=params=>{
    return axios.put(`users/${params.uid}/state/${params.type}`).then(res=>res.data)
}
//添加用户
export const addUser=params=>{
    return axios.post('users',params).then(res=>res.data)
}
//编辑用户信息
export const updateUser=(id,params)=>{
    return axios.put(`users/`+id,params).then(res=>res.data)
}
//添加角色
export const addRole=params=>{
    return axios.post('roles',params).then(res=>res.data)
}
//删除用户
export const deleteUser=params=>{
    return axios.delete(`users/${params}`).then(res=>res.data)
}
//删除角色
export const deleteRole=id=>{
    return axios.delete('roles/'+id).then(res=>res.data)
}
//编辑角色信息
export const updateRole=(id,params)=>{
    return axios.put(`roles/`+id,params).then(res=>res.data)
}
//给用户分配角色
export const grantUserRoler=(id,rId)=>{
    return axios.put(`users/${id}/role/`,{id:id,rid:rId}).then(res=>res.data)
}
//获取权限列表 
export const getAuthList = type => {
    return axios.get('rights/'+type).then(res => res.data)
}
//角色授权
export const grantRoleAuth=(roleId,rids)=>{
    return axios.post(`roles/${roleId}/rights`,rids).then(res=>res.data)
}
//删除指定角色权限 
export const deleteRoleAuth=(roleId,authId)=>{
    return axios.delete(`roles/${roleId}/rights/${authId}`).then(res=>res.data)
}
//获取角色列表 
export const getRoleList =()=> {
    return axios.get('roles').then(res => res.data)
}
//获取商品分类列表 
export const categoryList =(typeNum,pagenum,pagesize)=> {
    return axios.get('categories',{params:{type:typeNum,pagenum:pagenum,pagesize:pagesize}}).then(res => res.data)
}
//添加商品分类
export const addCategory=params=>{
    return axios.post('categories',params).then(res=>res.data)
}
//删除商品分类
export const delCategory=(id)=>{
    return axios.delete('categories/'+id).then(res=>res.data)
}
//根据id查询商品分类信息
export const getCategoryById=(id)=>{
    return axios.get('categories/'+id).then(res=>res.data)
}
//编辑分类数据处理
export const updateCategory=(id,cat_name)=>{
    return axios.put('categories/'+id,{cat_name:cat_name}).then(res=>res.data)
}
//获取商品列表
export const getGoodsList=(query,pagenum,pagesize)=>{
    return axios.get('goods',{params:{query:query,pagenum:pagenum,pagesize:pagesize}}).then(res=>res.data)
}
//添加商品
export const addGoods=params=>{
    return axios.post('goods',params).then(res=>res.data)
}
//获取左侧菜单列表 
export const menuList =()=> {
    return axios.get('menus').then(res => res.data)
}
// export const checkUser = function(params) {
//     return axios.post('login', params).then(function(res){
//         return res.data;
//     })
// }