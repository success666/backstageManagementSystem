<template>
    <div class="view">
        <div class="articlereview clearfix">
            <p>
                <el-button @click="goback" style="background:#83BDF9;color:#fff;">取消</el-button>
                <el-button :disabled="$store.state.changeArticleCommentShow" @click="toggleSelection" style="background:#83BDF9;color:#fff;">保存</el-button>
            </p>
        </div>

        <!-- table -->
        <el-table
            ref="multipleTable" :data="tabledata.list" tooltip-effect="dark" @selection-change="handleSelectionChange" v-loading="loading">

            <el-table-column type="selection">
            </el-table-column>

            <el-table-column label="用户">
                <template slot-scope="scope">{{ scope.row.name?scope.row.name:'---' }}</template>
            </el-table-column>

            <el-table-column label="评论">
                <template slot-scope="scope">{{ scope.row.content?scope.row.content:'---' }}</template>
            </el-table-column>

            <el-table-column label="评论状态">
                <template slot-scope="scope">{{ scope.row.isShow == 0?'未公开':'已公开' }}</template>
            </el-table-column>

            <el-table-column label="评论时间">
                <template slot-scope="scope">{{ scope.row.createTime?scope.row.createTime:'---' }}</template>
            </el-table-column>
        </el-table>

        
        <!-- page -->
        <div class="block fr page">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage4"
                :page-sizes="[5, 10, 20, 50, 100]"
                :page-size="10"
                layout="total, sizes, prev, pager, next, jumper"
                :total="tabledata.total">
            </el-pagination>
        </div>

    </div>
</template>

<style src="./articlereview.scss" lang="scss">

</style>

<script>
import http from './../../../utils/HttpClient'
export default {
    data() {
        return {
            // loading
            loading:false,
            multipleSelection: [],
            // page  .........................
            tabledata:[],
            currentPage4: 1,
            page:{
                articleId:'',
                // 当前页
                pageNum:1,
                // 每页数量
                pageSize:10
            },
               
        }
    },
    methods: {
        goback() {
            this.$router.go(-1)
        },
        // 评论是否公开          
        toggleSelection() {
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            for(let key of this.multipleSelection){
                // console.log(key);
                if(key.isShow == 1){
                    key.isShow = 0
                }else{
                    key.isShow = 1;
                }
            }
            http.post('/api/auth/v1/article/changeArticleCommentShow',this.multipleSelection).then(res=>{
                if(res.status.code == 0){
                    // this.multipleSelection = [];
                    // this.handleSelectionChange(this.multipleSelection);
                    this.$message({
                        type: 'success',
                        message: '保存成功'
                    });
                    this.getTableData(this.page);
                    // console.log(res);
                    loading.close();
                }else if(res.status.code == '2010001'){
                    loading.close();
                    this.$message({
                        type: 'error',
                        message: 'token失效请重新登录'
                    });
                    this.$router.push({name: 'login'});
                }else{
                    loading.close();
                    this.$message({
                        type: 'error',
                        message: res.status.msg
                    });
                }
            }).catch(error=>{
                loading.close();
                this.$message({
                    type: 'error',
                    message: '保存失败'
                });

            })
        },
        // 选择
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },

         // 每页数量              
        handleSizeChange(val) {
            this.loading = true;
            this.page.pageSize = val
            // console.log(this.page);
            http.get('/api/auth/v1/article/commentList',this.page).then(data=>{
                if(data.status.code === 0){
                    // console.log(data.data);
                    this.tabledata = data.data
                    this.loading = false;
                }else if(data.status.code == '2010001'){
                    this.$message({
                        type: 'error',
                        message: 'token失效请重新登录'
                    });
                    this.$router.push({name: 'login'});
                }else{
                    this.$message({
                        type: 'error',
                        message: data.status.msg
                    });
                    this.loading = false;
                }
            }).catch(error => {
                this.$message({
                    type: 'error',
                    message: '请求数据失败!'
                });
                this.loading = false;
            });
        },
            // go to pageNum        
        handleCurrentChange(val) {
            this.loading = true;
            this.page.pageNum = val
            // console.log(this.page);
            http.get('/api/auth/v1/article/commentList',this.page).then(data=>{
                if(data.status.code === 0){
                    // console.log(data.data);
                    this.tabledata = data.data
                    this.loading = false;
                }else if(data.status.code == '2010001'){
                    this.$message({
                        type: 'error',
                        message: 'token失效请重新登录'
                    });
                    this.$router.push({name: 'login'});
                }else{
                    this.$message({
                        type: 'error',
                        message: data.status.msg
                    });
                    this.loading = false;
                }
            }).catch(error => {
                this.$message({
                    type: 'error',
                    message: '请求数据失败!'
                });
                this.loading = false;
            });
        },

        // table数据          
        getTableData(obj){
            this.loading = true;
            http.get('/api/auth/v1/article/commentList',obj).then(data=>{
                if(data.status.code === 0){
                    // console.log('参数',obj,'返回的数据',data.data);
                    this.tabledata = data.data
                    // console.log('data',this.tabledata.list);
                    this.loading = false;
                }else if(data.status.code == '2010001'){
                    this.$message({
                        type: 'error',
                        message: 'token失效请重新登录'
                    });
                    this.$router.push({name: 'login'});
                }else{
                    this.$message({
                        type: 'error',
                        message: data.status.msg
                    });
                    this.loading = false;
                }
            }).catch(error => {
                this.$message({
                    type: 'error',
                    message: '请求数据失败!'
                });
                this.loading = false;
            });
        },

    },
     mounted(){

        this.menuData = JSON.parse(localStorage.getItem("menuData"));
        if(this.menuData == '' || this.menuData == null || this.menuData == undefined){
            this.$router.push({name: 'login'});
        }else{

            this.page.articleId = this.$route.query.id;
            
            this.getTableData(this.page);

            this.$store.commit('getRole','changeArticleCommentShow')
        }

    }
};
</script>