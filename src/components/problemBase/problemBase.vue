<template>
    <div class="rootelementa">
        <!-- search -->
        <div v-if="!$store.state.listProblemLibrary" class="search">
            <span>
                标题:
                <el-input placeholder="请输入标题" v-model="searchTitle" clearable style="width:200px;"></el-input> 
            </span>
            <span>
                类型:
                <el-select v-model="type" placeholder="请选择类型">
                    <el-option
                    v-for="item in articletype"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </span>
            <span>
                状态:
                <el-select v-model="statusvalue" placeholder="请选择状态">
                    <el-option
                    v-for="items in status"
                    :key="items.value"
                    :label="items.label"
                    :value="items.value">
                    </el-option>
                </el-select>
            </span>
            <el-button style="background:#83BDF9;color:#fff;margin-left:4px;" @click="search">查询</el-button>
            <el-button :disabled="$store.state.addProblemLibrary" @click="toEdit" style="background:#83BDF9;color:#fff;margin-left:4px;">新增</el-button>
        </div>

        <!-- table -->
        <el-table v-if="!$store.state.listProblemLibrary" :data="tabledata.list" style="width: 100%;text-align:center;" class="border-radius" v-loading="loading">
            <el-table-column label="标题">
                <template slot-scope="scope">
                    <span>{{ scope.row.title?scope.row.title:'---' }}</span>
                </template>
            </el-table-column>

            <el-table-column label="类型">
                <template slot-scope="scope">
                    <span>{{ scope.row.problemType?scope.row.problemType:'---' }}</span>
                </template>
            </el-table-column>

            <el-table-column label="更新时间">
                <template slot-scope="scope">
                    <span>{{ scope.row.updateTime?scope.row.updateTime:'---' }}</span>
                </template>
            </el-table-column>

            <el-table-column label="有用">
                <template slot-scope="scope">
                    <span>{{ scope.row.usefulCount?scope.row.usefulCount:'---' }}</span>
                </template>
            </el-table-column>

            <el-table-column label="无用">
                <template slot-scope="scope">
                    <span>{{ scope.row.unUsefulCount?scope.row.unUsefulCount:'---' }}</span>
                </template>
            </el-table-column>

            <el-table-column label="操作" width="320">
                <template slot-scope="scope">
                    <el-button :disabled="$store.state.changeProblemLibraryOpenFlag" size="mini" style="background:#83BDF9;color:#fff;" @click="showStatus(scope.$index, scope.row)">{{scope.row.openFlag == 0? '未公开' : '已公开'}}</el-button>
                    <el-button :disabled="$store.state.getProblemLibrary" size="mini" style="background:#83BDF9;color:#fff;" @click="look(scope.$index,scope.row)">查看</el-button>
                    <el-button :disabled="$store.state.updateProblemLibrary" size="mini" style="background:#83BDF9;color:#fff;" @click="edit(scope.$index,scope.row)">编辑</el-button>
                    <el-button :disabled="$store.state.deleteProblemLibrary" size="mini" style="background:#83BDF9;color:#fff;" type="" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- page -->
        <div v-if="!$store.state.listProblemLibrary" class="block fr" style="padding:14px 26px;">
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

        <div v-if="$store.state.listProblemLibrary" style="text-align:center;">没有此权限</div>
    </div>
</template>

<style src="./problemBase.scss">

</style>

<script>
    import http from './../../utils/HttpClient'
    export default {
        data(){
            return {
                // loading
                loading:false,
                // search 
                articletype:[{
                    value:'3',
                    label:'全部'
                },{
                     value:'0',
                    label:'营养'
                },{
                     value:'1',
                    label:'运动'
                },{
                     value:'2',
                    label:'疾病'
                }],
                status:[{
                    value:'',
                    label:'全部'
                },{
                    value: '0',
                    label: '未公开'
                    }, {
                    value: '1',
                    label: '已公开'
                }],
                // page  
                currentPage4: 1,
                page:{
                    // 当前页
                    pageNum:1,
                    // 每页数量
                    pageSize:10
                },
                // 标题
                searchTitle:'',
                // 状态
                statusvalue:'',
                // 类型
                type:'',

                // table     
                tabledata:[]
                
            }
        },
        methods:{
            toEdit(){
                this.$router.push({path: '/problemBase/problemBaseEdit'})
            },
            look(index,row){
                // console.log(row);
                this.$router.push({path: '/problemBase/problemBaseLook', query:{"id": row.id}})
            },
            edit(index,row){
                // console.log(row);
                this.$router.push({path: '/problemBase/problemBaseEdit', query:{"id": row.id}})
            },
            // problemType
            forOfType(array){
                for(let key of array){
                    if(key.problemType == 0){
                        key.problemType = '营养';
                    }else if(key.problemType == 1){
                        key.problemType = '运动';
                    }else if(key.problemType == 2){
                        key.problemType = '疾病';
                    }
                }
            },
            // 查询      
            search(){
                this.loading = true;
                this.page = {
                    title:this.searchTitle,
                    problemType:this.type,
                    openFlag:this.statusvalue
                    // pageNum:this.page.pageNum,
                    // pageSize:this.page.pageSize
                }
                // console.log(this.page);
                http.get('/api/auth/v1/problemLibrary',this.page).then(data=>{
                    if(data.status.code === 0){
                        this.tabledata = data.data
                        this.forOfType(this.tabledata.list);
                        this.loading = false;
                    }else if(data.status.code == '2010001'){
                        this.$message({
                            type: 'warning',
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


            // 提示   
            open(test) {
                this.$message.warning(test);
            },
            erroropen(test) {
                this.$message.error(test);
            },


            // 删除   
            handleDelete(index, row) {
                this.$confirm('删除后该问题将无法恢复', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    const loading = this.$loading({
                        lock: true,
                        text: 'Loading',
                        spinner: 'el-icon-loading',
                        background: 'rgba(0, 0, 0, 0.7)'
                    });
                    http.delete(`/api/auth/v1/problemLibrary/${row.id}`).then(res=>{
                        // console.log(res,'删除成功');
                        if(res.body.status.code == '0'){
                            this.getTableData();
                            loading.close();
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                        }else if(res.status.code == '2010001'){
                            loading.close();
                            this.$message({
                                type: 'warning',
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
                        return this.$message({
                            type: 'error',
                            message: '删除失败'
                        });
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });          
                });                
            },



            // 是否公开            
            showStatus(index,row){
                // console.log(index,row);
                let show = row.openFlag
                if(show == 1){
                    show = 0
                    this.$confirm('确认后该问题将无法搜索或查看','提示',{
                        confirmButtonText: '确认',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        const loading = this.$loading({
                            lock: true,
                            text: 'Loading',
                            spinner: 'el-icon-loading',
                            background: 'rgba(0, 0, 0, 0.7)'
                        });
                        http.post('/api/auth/v1/problemLibrary/changeOpenFlag',{"openFlag":show,"id":row.id}).then(res=>{
                            // console.log(res);
                            if(res.status.code == 0){
                                this.getTableData();
                                loading.close();
                                this.$message({
                                    type: 'success',
                                    message: '以设置为未公开状态'
                                });

                            }else if(res.status.code == '2010001'){
                                loading.close();
                                this.$message({
                                    type: 'warning',
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
                                message: '设置失败'
                            });
                        })
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消设置'
                        });          
                    });        
                }else if(show == 0){
                    show = 1;
                    this.$confirm('确认后,该问题将进行对APP用户公开','提示',{
                        confirmButtonText: '确认',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        const loading = this.$loading({
                            lock: true,
                            text: 'Loading',
                            spinner: 'el-icon-loading',
                            background: 'rgba(0, 0, 0, 0.7)'
                        });
                        http.post('/api/auth/v1/problemLibrary/changeOpenFlag',{"openFlag":show,"id":row.id}).then(res=>{
                            // console.log(res);
                            if(res.status.code == 0){
                                this.getTableData();
                                loading.close();
                                this.$message({
                                    type: 'success',
                                    message: '以设置为已公开状态!'
                                });
                            
                            }else if(res.status.code == '2010001'){
                                loading.close();
                                this.$message({
                                    type: 'warning',
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
                                message: '设置失败'
                            });
                        })
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消设置'
                        });          
                    });        
                }
                
            },




            // 每页数量             
            handleSizeChange(val) {
                this.loading = true;
                this.page.pageSize = val
                http.get('/api/auth/v1/problemLibrary',this.page).then(data=>{
                    if(data.status.code === 0){
                        // console.log(data.data);
                        this.tabledata = data.data
                        this.forOfType(this.tabledata.list)
                    }else if(data.status.code == '2010001'){
                        this.$message({
                            type: 'warning',
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
                http.get('/api/auth/v1/problemLibrary',this.page).then(data=>{
                    if(data.status.code === 0){
                        // console.log(data.data);
                        this.tabledata = data.data
                        this.forOfType(this.tabledata.list)
                        this.loading = false;
                    }else if(data.status.code == '2010001'){
                        this.$message({
                            type: 'warning',
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

            // table数据           
            getTableData(){
                this.loading = true;
                http.get('/api/auth/v1/problemLibrary',this.page).then(data=>{
                    if(data.status.code === 0){
                        // console.log('table数据',data.data);
                        this.tabledata = data.data
                        this.forOfType(this.tabledata.list)
                        this.loading = false;
                    }else if(data.status.code == '2010001'){
                        this.$message({
                            type: 'warning',
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
                
                this.getTableData();
                this.$store.commit('getRole','listProblemLibrary,addProblemLibrary,changeProblemLibraryOpenFlag,getProblemLibrary,updateProblemLibrary,deleteProblemLibrary')
            }
        }
          
    }
</script>