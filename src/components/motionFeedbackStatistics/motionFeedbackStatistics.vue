<template>

    <div ref="motionFeedbackStatistics" class="motionFeedbackStatistics">
        <!-- search -->
        <div class="search" v-if="!$store.state.sportExerciseFeedbackList">
            <ul class="clearfix titleul">
                <li>
                    反馈日期:
                    <el-date-picker
                        style="width:140px;"
                        v-model="valueData"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择日期">
                    </el-date-picker>
                </li>
                <li>
                    区：
                    <el-select v-model="eareValue" placeholder="请选择区" style="width:120px;">
                        <el-option
                        v-for="item in eare"
                        :key="item.dataCode"
                        :label="item.dataName"
                        :value="item.dataCode">
                        </el-option>
                    </el-select>
                </li>
                <li>
                    学校:
                    <el-input placeholder="请输入学校" v-model.trim="schoolName" clearable style="width:200px;"></el-input>
                </li>
                <li>
                    班级:
                    <el-input placeholder="请输入班级" v-model.trim="classValue" clearable style="width:200px;"></el-input>
                </li>
                <li>
                    学生身份信息:
                    <el-input placeholder="请输入学生身份信息" v-model.trim="studentMessage" clearable style="width:180px;"></el-input> 
                </li>
                <li>
                    学生姓名:
                    <el-input placeholder="请输入学生姓名" v-model.trim="diseaseName" clearable style="width:180px;"></el-input>
                </li>
                <li>
                    周计划：
                    <el-select v-model="isWeekLyPlanValue" placeholder="请选周计划" style="width:120px;">
                        <el-option
                        v-for="item in isWeekLyPlan"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </li>
                <li>
                    <el-button type="" @click="search" style="margin-left:4px;background:#83BDF9;color:#fff;">查询</el-button>
                </li>
                <li>
                    <a id="downlink"></a>
                    <el-button :disabled="$store.state.feedbackListExport" style="margin-left:4px;background:#83BDF9;color:#fff;" @click="down">导出Excel</el-button>
                </li>
            </ul>               
        </div>


        <!-- table -->
        <el-table v-if="!$store.state.sportExerciseFeedbackList" :data="tabledata.list" style="width:100%;text-align:center;" class="border-radius" v-loading="loading">

            <el-table-column label="反馈日期">
                <template slot-scope="scope">
                    <span>{{ scope.row.createTime?scope.row.createTime.slice(0,10):'---' }}</span>
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
                    <span>{{ scope.row.name?scope.row.name:'---' }}</span>
                </template>
            </el-table-column>

            <el-table-column label="运动时长">
                <template slot-scope="scope">
                    <span>{{ scope.row.quOne?scope.row.quOne:'---' }}分钟</span>
                </template>
            </el-table-column>

            <el-table-column label="周计划">
                <template slot-scope="scope">
                    <span>{{ scope.row.isWeekLyPlan?scope.row.isWeekLyPlan:'---' }}</span>
                </template>
            </el-table-column>

        </el-table>


       <!-- page -->
        <div v-if="!$store.state.sportExerciseFeedbackList" class="block fr" style="padding:14px 26px;">
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

        <div v-if="$store.state.sportExerciseFeedbackList" class="ac">没有此权限</div>
    </div>
</template>
<style src="./motionFeedbackStatistics.scss" lang="scss">
        
</style>

<script>
    import XLSX from 'xlsx'
    import http from '../../utils/HttpClient'
    export default {
         data(){
            return {
                // loading
                loading:false,


                excelUrl:'',

                valueData:'',
               
                eareValue:'',
                isWeekLyPlanValue:'',
                classValue:'',
                relation:'',
                schoolName:'',
                student:'',
                studentMessage:'',
                diseaseName:'',
               

                eare:[],

                isWeekLyPlan:[{
                    id:'',
                    name:'全部'
                },{
                    id:'0',
                    name:'否'
                },{
                    id:'1',
                    name:'是'
                }],

                tabledata: [],
                // page  .........................
                currentPage4: 1,
                page:{
                    // 当前页
                    pageNum:1,
                    // 每页数量
                    pageSize:10
                },
             }
        },

        methods:{
           
            search(){
                this.loading = true;
                let params = {
                    dataCode:this.eareValue,
                    schoolName:this.schoolName,
                    classTitle:this.classValue,
                    name:this.student,
                    identityNumber:this.studentMessage,
                    name:this.diseaseName,
                    isWeekLyPlan:this.isWeekLyPlanValue,
                    createTime:this.valueData,
                    pageNum:1,
                    pageSize:7
                }
                console.log(params);

                http.get('/api/auth/v1/sportExercise/feedbackList',params).then(res=>{
                    
                    if(res.status.code == '0'){
                        this.tabledata = res.data;
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
                }).catch(error => {
                    this.$message({
                        type: 'error',
                        message: '请求数据失败'
                    });
                    this.loading = false;
                });
            },
             // 每页数量               
            handleSizeChange(val) {
                this.loading = true;
                // console.log(`每页 ${val} 条`);
                this.page.pageSize = val
                http.get('/api/auth/v1/sportExercise/feedbackList',this.page).then(data=>{
                    if(data.status.code === 0){
                        // console.log(data.data);
                        this.tabledata = data.data
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
                        message: '请求数据失败'
                    });
                    this.loading = false;
                });
            },
            // go to pageNum     
            handleCurrentChange(val) {
                this.loading = true;
                // console.log(`当前页: ${val}`);
                this.page.pageNum = val
                http.get('/api/auth/v1/sportExercise/feedbackList',this.page).then(data=>{
                    if(data.status.code === 0){
                        // console.log(data.data);
                        this.tabledata = data.data
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
                        message: '请求数据失败'
                    });
                    this.loading = false;
                });
            },
           
           

            getTableData(){
                this.loading = true;
                http.get('/api/auth/v1/sportExercise/feedbackList',this.page).then(res=>{
                    console.log('table数据',res);   
                    if(res.status.code == '0'){
                        this.tabledata = res.data
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
                }).catch(error => {
                    this.$message({
                        type: 'error',
                        message: '请求数据失败'
                    });
                    this.loading = false;
                });
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
                            type: 'error',
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
                        message: "获取区域失败"
                    });
                })
            },
            down(){
               
                let obj = {
                    dataCode:this.eareValue,
                    schoolName:this.schoolName,
                    classTitle:this.classValue,
                    name:this.student,
                    identityNumber:this.studentMessage,
                    name:this.diseaseName,
                    isWeekLyPlan:this.isWeekLyPlanValue,
                    createTime:this.valueData,
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
                window.open(this.excelUrl + "/api/auth/v1/sportExercise/feedbackList/export?"+str)

            }
           
        },
        mounted(){
            this.menuData = JSON.parse(localStorage.getItem("menuData"));
            if(this.menuData == '' || this.menuData == null || this.menuData == undefined){
                this.$router.push({name: 'login'});
            }else{

                this.excelUrl = process.env.BASE_API

                this.getTableData();
                this.getEare();

                this.$store.commit('getRole','sportExerciseFeedbackList,feedbackListExport')

            }
        }
    }
</script>