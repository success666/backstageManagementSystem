<template>

    <div ref="history" class="appUser">
        <!-- search -->
        <div v-if="!$store.state.listAppAccount" class="search">
            <ul class="clearfix titleul">
                <li class="f">
                    <span>
                        手机号:
                        <el-input placeholder="请输入手机号" v-model.trim="number" clearable style="width:200px;"></el-input> 
                    </span>
                </li>
                <li class="fl">
                    <span>
                        用户身份:
                        <el-select v-model="userStatus" placeholder="请选择用户身份" style="width:100px;">
                            <el-option
                            v-for="item in relationData"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </span>
                </li>
                <li class="fl">
                    <span>
                        学校:
                        <el-input placeholder="请输入学校" v-model.trim="school" clearable style="width:200px;"></el-input>
                    </span>
                </li>
                <li class="fl">
                    <span>
                        班级:
                        <el-input placeholder="请输入班级" v-model.trim="classValue" clearable style="width:160px;"></el-input>
                    </span>
                </li>
                <li class="fl">
                    <span>
                        区:
                        <el-select v-model="eareValue" placeholder="请选择区" style="width:120px;">
                            <el-option
                            v-for="item in eare"
                            :key="item.id"
                            :label="item.dataName"
                            :value="item.dataCode">
                            </el-option>
                        </el-select>
                    </span>
                </li>
                <li class="fl">
                    <span>
                        学生身份信息:
                        <el-input placeholder="请输入学生身份信息" v-model.trim="student" clearable style="width:190px;"></el-input> 
                    </span>
                </li>
                <li class="fl">
                    <span>
                        学生姓名:
                        <el-input placeholder="请输入学生姓名" v-model.trim="studentName" clearable style="width:150px;"></el-input>
                    </span>
                </li>
                <li class="fl">
                    <el-button ref="searchData" @click="search" style="background:#83BDF9;color:#fff;">查询</el-button>
                </li>
                <li class="fl">
                    <el-button :disabled="$store.state.accountMgmtExport" style="background:#83BDF9;color:#fff;" @click="down">导出Excel</el-button>
                </li>
            </ul>               
        </div>


        <!-- table -->
        <el-table v-if="!$store.state.listAppAccount" :data="tabledata.list" class="border-radius ac" v-loading="loading">
          
            <el-table-column label="绑定时间">
                <template slot-scope="scope">
                    <span>{{ scope.row.createTime?scope.row.createTime.slice(0,16):'---' }}</span>
                </template>
            </el-table-column>

            <el-table-column label="手机号">
                <template slot-scope="scope">
                    <span>{{ scope.row.phoneNo?scope.row.phoneNo:'---' }}</span>
                </template>
            </el-table-column>

            <el-table-column label="用户身份">
                <template slot-scope="scope">
                    <span>{{ scope.row.identityType?scope.row.identityType:'---' }}</span>
                </template>
            </el-table-column>

            <el-table-column label="区">
                <template slot-scope="scope">
                    <span>{{ scope.row.dataName?scope.row.dataName:'---' }}</span>
                </template>
            </el-table-column>

            <el-table-column label="学校">
                <template slot-scope="scope">
                    <span>{{ scope.row.schoolName?scope.row.schoolName:'---' }}</span>
                </template>
            </el-table-column>

            <el-table-column label="班级">
                <template slot-scope="scope">
                    <span>{{ scope.row.classTitle?scope.row.classTitle:'---' }}</span>
                </template>
            </el-table-column>

            <el-table-column label="学生身份信息">
                <template slot-scope="scope">
                    <span>{{ scope.row.identityNumber?scope.row.identityNumber:'---' }}</span>
                </template>
            </el-table-column>

            <el-table-column label="学生姓名">
                <template slot-scope="scope">
                    <span>{{ scope.row.studentName?scope.row.studentName:'---' }}</span>
                </template>
            </el-table-column>

            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button
                    :disabled="$store.state.deleteRelation"
                    size="mini"
                    style="background:#83BDF9;color:#fff;"
                    @click="unbundle(scope.$index, scope.row)">解绑</el-button>
                </template>
            </el-table-column>

        </el-table>

       <!-- page -->
        <div v-if="!$store.state.listAppAccount" class="block fr page">
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

        <div v-if="$store.state.listAppAccount" class="ac">没有此权限</div>

    </div>
</template>

<style src="./appUser.scss" lang="scss">
    
</style>

<script>
    import http from '../../utils/HttpClient'
    export default {
         data(){
            return {
                // excel
                excelUrl:'',
                // loading
                loading:false,
                number:'',
                userStatus:'',
                eareValue:'',
                eare:[],
                school:'',
                classValue:'',
                student:'',
                studentName:'',

                relation:'',
                relationData:[{
                    id:'',
                    name:'全部'
                },{
                    id:'0',
                    name:'家长'
                },{
                    id:'1',
                    name:'学生'
                }],



                // table
                tabledata: [],

                // page 
                currentPage4: 1,
                page:{
                    pageNum:1,
                    pageSize:10
                },
                userId:''
             }
        },
        methods:{
            // array -> string
            forOfType(array){
                for(let key of array){
                    if(key.identityType == '0'){
                        key.identityType = '家长'
                    }else if(key.identityType == '1'){
                        key.identityType = '学生'
                    }
                }
            },

            // search
            search(){
                this.loading = true;
                let params = {
                    phoneNo:this.number,
                    identityType:this.userStatus,
                    dataCode:this.eareValue,
                    schoolName:this.school,
                    classTitle:this.classValue,
                    identityNumber:this.student,
                    studentName:this.studentName,
                    pageNum:1,
                    pageSize:10
                }

                http.get('/api/auth/v1/accountMgmt',params).then(res=>{
                    if(res.status.code == '0'){
                        this.tabledata = res.data;
                        this.forOfType(this.tabledata.list)
                        this.loading = false;
                    }else if(res.status.code == '2010001'){
                        this.loading = false;
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
                    this.$message({
                        type: 'error',
                        message: '获取数据失败'
                    });
                    this.loading = false;
                })
            },
             // 每页数量               
            handleSizeChange(val) {
                this.loading = true;
                this.page.pageSize = val
                http.get('/api/auth/v1/accountMgmt',this.page).then(data=>{
                    if(data.status.code === 0){
                        // console.log(data.data);
                        this.tabledata = data.data
                        this.forOfType(this.tabledata.list)
                        this.loading = false;
                    }else if(data.status.code == '2010001'){
                        this.loading = false;
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
                        message: '获取数据失败'
                    });
                    this.loading = false;
                });
            },

            // go to pageNum     
            handleCurrentChange(val) {
                this.loading = true;
                this.page.pageNum = val
                http.get('/api/auth/v1/accountMgmt',this.page).then(data=>{
                    if(data.status.code === 0){
                        // console.log(data.data);
                        this.tabledata = data.data
                        this.forOfType(this.tabledata.list)
                        this.loading = false;
                    }else if(data.status.code == '2010001'){
                        this.loading = false;
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
                        message: '获取数据失败'
                    });
                    this.loading = false;
                });
            },

            //解绑    ......................................................
            unbundle(index,row){
                // console.log(row)
                 this.$confirm('解绑后,该用户将无法再查看该生信息,但可再进行绑定?', '提示', {
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
                    http.delete(`/api/auth/v1/accountMgmt/${row.accountStuRelId}`).then(res=>{
                        // console.log(res,'删除成功');
                        if(res.body.status.code == '0'){
                            loading.close();
                            this.$message({
                                type: 'success',
                                message: '解绑成功'
                            });
                            let paramsData = {
                                phoneNo:this.number,
                                identityType:this.userStatus,
                                dataCode:this.eareValue,
                                schoolName:this.school,
                                classTitle:this.classValue,
                                identityNumber:this.student,
                                studentName:this.studentName,
                                pageNum:1,
                                pageSize:10
                            }
                            this.getTableData(paramsData);
                            loading.close()
                        }else if(res.body.status.code == '2010001'){
                            this.$message({
                                type: 'error',
                                message: 'token失效请重新登录'
                            });
                            this.$router.push({name: 'login'});
                            loading.close()
                        }else{
                            this.$message({
                                type: 'error',
                                message: res.body.status.msg
                            });
                            loading.close()
                        }
                    }).catch(error=>{
                        this.$message({
                            type: 'error',
                            message: '解绑失败'
                        });
                        loading.close()
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消解绑'
                    });          
                });               
            },

            // get data
            getTableData(paramsData){
                if(paramsData){
                    this.page = paramsData;
                }
                this.loading = true;
                http.get('/api/auth/v1/accountMgmt',this.page).then(res=>{
                    
                    if(res.status.code == '0'){
                        // console.log('table数据---',res.data); 
                        this.tabledata = res.data
                        this.forOfType(this.tabledata.list)
                        this.loading = false;
                    }else if(res.status.code == '2010001'){
                        this.loading = false;
                        this.$message({
                            type: 'warning',
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
                }).catch(error => {
                    this.$message({
                        type: 'error',
                        message: '获取数据失败'
                    });
                    this.loading = false;
                });
            },

            // 导出
            down(){
                let obj = {
                    phoneNo:this.number,
                    identityType:this.userStatus,
                    dataCode:this.eareValue,
                    schoolName:this.school,
                    classTitle:this.classValue,
                    identityNumber:this.student,
                    studentName:this.studentName
                }
                let str = '';
                for(let key in obj){
                    // console.log(key);
                    if(obj[key]!=''&&obj[key]!=undefined){
                        str+=key+'='+obj[key]+'&';
                    }
                }
                str = str.slice(0,-1);
                // console.log(str);
                window.open(this.excelUrl + "/api/v1/accountMgmt/export?"+str)
            },

            getEare(){
                http.get('/api/v1/area/list').then(res=>{
                    if(res.status.code == '0'){
                        let eareObj = {
                            dataCode:'',
                            dataName:'全部'
                        }
                        this.eare = res.data;
                        this.eare.unshift(eareObj)
                    }else if(res.status.code == '2010001'){
                        this.$message({
                            type: 'warning',
                            message: 'token失效请重新登录'
                        });
                        this.$router.push({name: 'login'});
                    }else{
                        this.$message({
                            type: 'error',
                            message: res.status.msg
                        });
                    }
                }).catch(error=>{
                    this.$message({
                        type: 'error',
                        message: '获取区域失败'
                    });
                })
                
            }
           
        },
        mounted(){

            this.menuData = JSON.parse(localStorage.getItem("menuData"));

            if(this.menuData == '' || this.menuData == null || this.menuData == undefined){
                this.$router.push({name: 'login'});
            }else{

                this.getTableData();
                this.getEare();
                this.userId = JSON.parse(localStorage.getItem("ydl_user")).userId;

                this.excelUrl = process.env.BASE_API

                this.$store.commit('getRole','listAppAccount,accountMgmtExport,deleteRelation')
            }
          

        }
    }
</script>