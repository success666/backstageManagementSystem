<template>
    <div>
        <div class="role">
            <p class="clearfix">
                <el-button :disabled="$store.state.addRole" @click="toRoleEdit" type="" style="background:#83BDF9;color:#fff;margin-left:14px;" class="fr">新增</el-button>
            </p>

            <el-table v-if="!$store.state.listRole" :data="tableData.list" style="width: 100%;text-align:center;" class="border-radius" v-loading="loading">
                <el-table-column label="角色" >
                    <template slot-scope="scope">
                        <span>{{ scope.row.name == ''? '--':scope.row.name }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button size="mini" type="" style="background:#83BDF9;color:#fff;" @click="handleEdit(scope.$index, scope.row)" :disabled="$store.state.updateRole">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- page -->
            <div class="block fr" style="padding:14px 26px;" v-if="!$store.state.listRole">
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage4"
                    :page-sizes="[5, 10, 20, 50, 100]"
                    :page-size="10"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="tableData.total">
                </el-pagination>
            </div>

        </div>
        <p v-if="$store.state.listRole" style="text-align:center;">
            没有此权限
        </p>
    </div>
</template>
<style src="./role.scss" lang="scss">

</style>

<script>
    import http from './../../utils/HttpClient'
    import {mapState} from 'vuex'
    
    export default {
        
        data(){
            return {
                // loading
                loading:false,
                tableData:[],
                id:'',
                name:'',
                currentPage4: 1,
                page:{
                    // 当前页
                    pageNum:1,
                    // 每页数量
                    pageSize:10
                }
            }
        },
        methods:{
            toRoleEdit(){
                this.$router.push({path: '/role/roleEdit'})
            },
            handleEdit(index, row) {
                // console.log(index, row);
                this.id = row.id;
                this.name = row.name;
                // console.log(this.id);
                this.$router.push({path: '/role/roleEdit', query:{id: this.id,name:this.name}})
            },
            getRoleList(){
                this.loading = true;
                http.get('/api/auth/v1/role',this.page).then(res=>{
                    if(res.status.code == 0){
                        this.tableData = res.data;
                        // console.log(res.data);
                        this.loading = false;
                    }else if(res.status.code == '2010001'){
                        this.$message({
                            type: 'error',
                            message: 'token失效请重新登录'
                        });
                        this.$router.push({name: 'login'});
                    }else{
                        this.$message({
                            type: 'error',
                            message: res.status.msg
                        });
                        this.loading = false;
                    }
                }).catch(error=>{
                    this.erroropen('获取数据失败');
                    this.loading = false;
                })
           },
           // 每页数量
            handleSizeChange(val) {
                this.loading = true;
                this.page.pageSize = val
                // console.log(this.page);
                http.get('/api/auth/v1/role',this.page).then(data=>{
                    if(data.status.code === 0){
                        // console.log(data.data);
                        this.tableData = data.data
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
                    this.erroropen('获取数据失败');
                    this.loading = false;
                });
            },
            // go to pageNum
            handleCurrentChange(val) {
                this.loading = true;
                this.page.pageNum = val
                http.get('/api/auth/v1/role',this.page).then(data=>{
                    if(data.status.code === 0){
                        // console.log(data.data);
                        this.tableData = data.data
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
                    this.erroropen('获取数据失败');
                    this.loading = false;
                });
            },
           
        },
        mounted(){
            this.menuData = JSON.parse(localStorage.getItem("menuData"));
            if(this.menuData == '' || this.menuData == null || this.menuData == undefined){
                this.$router.push({name: 'login'});
            }else{
                // this.$store.commit('loading',this);
                this.getRoleList();

                this.$store.commit('getRole','listRole,addRole,updateRole')
            }  
        }
    }
</script>