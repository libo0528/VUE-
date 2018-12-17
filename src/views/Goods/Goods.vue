<template>
    <div class="goods">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>
        <div style="margin: 20px 0">
            <el-button type="success" plain @click="goodsadd()">添加商品</el-button>
        </div>
        <el-table
            border
            :data="tableData"
            stripe
            style="width: 100%">
            <el-table-column
            prop="goods_id"
            label="编号"
            width="60">
            </el-table-column>
            <el-table-column
            prop="goods_name"
            label="商品名称"
            width="680">
            </el-table-column>
            <el-table-column
            prop="goods_number"
            label="商品数量"
            width="80">
            </el-table-column>
            <el-table-column
            prop="goods_price"
            label="商品价格"
            width="80">
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button size="mini" type="primary" plain icon="el-icon-edit" @click="showEditDialog(scope.row)"></el-button>
                    <el-button size="mini" type="danger" plain icon="el-icon-delete" @click="showDeleteDialog(scope.row)" v-if="scope.row.id!=500"></el-button>
                    <el-button size="mini" type="warning" plain icon="el-icon-check" @click="showRoleDialog(scope.row)"></el-button>
                </template>
            </el-table-column>
        </el-table>
<div class="block">
    <el-pagination
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :current-page="1"
    :page-sizes="[10, 50, 100, 150]"
    :page-size="pagesize"
    layout="total, sizes, prev, pager, next, jumper"
    :total="pagetotal">
    </el-pagination>
</div>
    </div>
</template>
<script>
import {getGoodsList} from '@/api/index.js'
     export default {
data() {
    return {
        pagetotal:0,
        query:'',
        pagenum:1,
        pagesize:10,
        currentPage1: 5,
        currentPage2: 5,
        currentPage3: 5,
        currentPage4: 4,
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
     
    mounted(){
        this.initList()
    },
    methods: {
        handleSizeChange(val) {
        // console.log(`每页 ${val} 条`);
        this.pagesize=val
        this.initList()
        },
        handleCurrentChange(val) {
        // console.log(`当前页: ${val}`);
        this.pagenum=val
        this.initList()
        },
        initList(){
             console.log(this.pagenum)
            getGoodsList(this.query,this.pagenum,this.pagesize).then(res=>{
                    // console.log(res.data.total)
                if(res.meta.status==200){
                    this.tableData=res.data.goods
                    this.pagetotal=res.data.total
                }else{
                    this.$message.error(res.meta.msg)
                }
            })
        },
        goodsadd(){
            this.$router.push({name:'Goodsadd'})
        }
    }
}
</script>
<style>

</style>