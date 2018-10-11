<template>
    <div>
        <div class="clearfix">
            <!-- title -->
            <p style="padding:10px 0px;">
                *名称：
                <el-input placeholder="请输入名称" v-model="editData.title" clearable style="width:80%;"></el-input>
            </p>
            <!-- 上传图片 -->
            <p class="clearfix" style="width:550px;">
                <span class="fl" style="margin-top:4px;">*缩略图：</span>
                <el-upload
                    v-loading="loadingPicUrl"
                    accept="image/*"
                    class="upload-demo w200"
                    :action="uploadPictureUrl"
                    :on-remove="handleRemove"
                    :limit="1"
                    :http-request="requestPicUrl"
                    :before-upload="beforeAvatarUpload"
                    :on-exceed="handleExceed"
                    :file-list="fileList1"
                    list-type="picture">    
                    <el-button size="small" type="primary" style="background:#83BDF9;color:#fff;">点击上传</el-button>
                    <span style="color:red;font-size:12px;">建议上传180*130图片，大小不超过100KB，格式为jpeg等图片格式</span> 
                </el-upload>
            </p>
            <br/><hr/><br/>
            <!-- 适合人群 -->
            <div>
                <p>适合人群</p><br/>
                <el-row>
                    <el-col :span="12">
                        *年级
                        <el-select
                            style="width:200px;"
                            v-model="pushClass"
                            multiple
                            collapse-tags
                            placeholder="请选推送年级">
                            <el-option
                            v-for="item in classData"
                            :key="item.code"
                            :label="item.name"
                            :value="item.code">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="12">
                        *性别
                        <el-select
                            style="width:200px;"
                            v-model="sex"
                            multiple
                            placeholder="请选推送性别">
                            <el-option
                            v-for="item in sexData"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-col>
                </el-row>
            </div>
            <br/><hr/><br/>
            <!-- 指导点属性 -->
            <div>
                <p>指导点属性</p><br/>
                <p>
                    <el-col :span="8">
                        *运动类型：
                        <el-select
                            style="width:220px;"
                            v-model="sportTypeData"
                            multiple
                            collapse-tags
                            placeholder="请选推送运动类型">
                            <el-option
                            v-for="item in sportType"
                            :key="item.code"
                            :label="item.name"
                            :value="item.code">
                            </el-option>
                        </el-select>
                    </el-col>
                    *锻炼部位：
                    <el-select
                        style="width:220px;"
                        v-model="exercisePositionData"
                        multiple
                        collapse-tags
                        placeholder="请选推送锻炼部位">
                        <el-option
                        v-for="item in exercisePosition"
                        :key="item.code"
                        :label="item.name"
                        :value="item.code">
                        </el-option>
                    </el-select>
                </p><br/>
                <p>
                    <el-col :span="8">
                        <span style="margin-left:32px;">
                            *强度：
                            <el-select
                                style="width:220px;"
                                v-model="exerciseIntensityData"
                                filterable
                                allow-create
                                default-first-option
                                placeholder="请选推送强度">
                                <el-option
                                v-for="item in exerciseIntensity"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                        </span>
                    </el-col>
                    <span style="margin-left:16px;">
                        *运动数：
                        <el-input placeholder="组数量" v-model="editData.exerciseGroup" clearable style="width:120px;"></el-input>
                        组&nbsp;&nbsp;
                        每组
                        <el-input placeholder="每组数量" v-model="editData.groupValue" clearable style="width:120px;"></el-input>
                        <el-select
                            style="width:120px;"
                            v-model="editData.groupType"
                            filterable
                            allow-create
                            default-first-option
                            placeholder="请选择单位">
                            <el-option
                            v-for="item in sportNumber"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </span>
                    
                </p><br/>
                <p>
                    <el-col :span="8">
                        <span style="margin-left:32px;">
                            *场地：
                            <el-select
                                style="width:220px;"
                                v-model="editData.site"
                                filterable
                                allow-create
                                default-first-option
                                placeholder="请选推送场地">
                                <el-option
                                v-for="item in site"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                        </span>
                    </el-col>
                    <span style="margin-left:32px;">
                        *器械：
                        <el-select
                            style="width:220px;"
                            v-model="instrumentData"
                            multiple
                            collapse-tags
                            placeholder="请选推送器械">
                            <el-option
                            v-for="item in instrument"
                            :key="item.code"
                            :label="item.name"
                            :value="item.code">
                            </el-option>
                        </el-select>
                    </span>
                </p><br/>
                <p>
                    <el-col :span="8">
                        *关联素质：
                        <el-select
                            style="width:220px;"
                            v-model="relevanceQualityData"
                            multiple
                            collapse-tags
                            placeholder="请选推送关联素质">
                            <el-option
                            v-for="item in relevanceQuality"
                            :key="item.code"
                            :label="item.name"
                            :value="item.code">
                            </el-option>
                        </el-select>
                    </el-col>
                    <span  style="visibility:hidden;">*</span>关联运动：
                    <el-select
                        style="width:220px;"
                        v-model="relevanceSportData"
                        multiple
                        collapse-tags
                        placeholder="请选推送关联运动">
                        <el-option
                        v-for="item in relevanceSport"
                        :key="item.code"
                        :label="item.name"
                        :value="item.code">
                        </el-option>
                    </el-select>
                </p>
                
            </div>
            <br/><hr/><br/>


            <div>
                <p>指导点内容</p><br/>
                <p>*动作描述：</p><br/>
                <Ueditor :content="content" :config="config" :id="ue" ref="ue"></Ueditor><br/>
                <!-- 上传图片 -->
                <p class="clearfix" style="width:400px;">
                    <span class="fl" style="margin-top:4px;">*封面图：</span>
                    <el-upload
                        v-loading="loadingCoverPic"
                        accept="image/*"
                        class="upload-demo w200"
                        :action="uploadPictureUrl"
                        :on-remove="handleRemove"
                        :limit="1"
                        :http-request="requestCoverPic"
                        :on-exceed="handleExceed"
                        :file-list="fileList2"
                        list-type="picture">
                        <el-button size="small" type="primary" style="background:#83BDF9;color:#fff;">点击上传</el-button>
                        <span style="color:red;font-size:12px;">建议上传4:3图片，格式为jpeg等图片格式</span>
                    </el-upload>
                </p>
            </div>
        </div><br/>
        <!-- 富文本编辑器 -->


        <!-- footer -->
        <div style="text-align:center;">
            <p>
                <el-button @click="goback" style="background:#83BDF9;color:#fff;">取消</el-button>
                <el-button @click="publicSave($event,'1',$store.state.addSportPoint,$store.state.updateSportPoint)" style="background:#83BDF9;color:#fff;">保存并公开</el-button>
                <el-button @click="saveArticle($event,'0',$store.state.addSportPoint,$store.state.updateSportPoint)" style="background:#83BDF9;color:#fff;">保存</el-button>
            </p>
        </div><br/>
    </div>
</template>


<style src="./editMovingManagement.scss" scoped lang="scss">
    
</style>
<script>
    import superagent from 'superagent'
    import Ueditor from './ueditor.vue'
    import http from '../../../utils/HttpClient'

    export default {
        components:{
            Ueditor
        },
        data(){
            return {
                // loading
                loadingCoverPic:false,
                loadingPicUrl:false,

                uploadPictureUrl:'',
                classData:[],
                pushClass:[],

                sexData:[{
                    id:0,
                    value:'0',
                    label:'男'
                },{
                    id:1,
                    value:'1',
                    label:'女'
                }],
                sex:[],

                sportType:[],
                sportTypeData:[],

                exercisePosition:[],
                exercisePositionData:[],

                exerciseIntensity:[{
                    id:'0',
                    value:'0',
                    label:'低',
                },{
                    id:'1',
                    value:'1',
                    label:'中'
                },{
                    id:'2',
                    value:'2',
                    label:'高'
                }],
                exerciseIntensityData:[],

                sportNumber:[{
                    id:'0',
                    value:'0',
                    label:'次',
                },{
                    id:'1',
                    value:'1',
                    label:'秒'
                }],

                site:[{
                    id:'0',
                    value:'0',
                    label:'室内'
                },{
                    id:'1',
                    value:'1',
                    label:'室外'
                }],
                instrument:[],
                instrumentData:[],

                relevanceQuality:[],
                relevanceQualityData:[],

                relevanceSport:[],
                relevanceSportData:[],

                editData:{
                    title: "",//标题
                    sex: "",//推送条件-性别 0 男 ；1 女 可多选
                    content: "",//动作描述
                    picUrl: "",//缩略图
                    coverPic: "",//封面图
                    pushClass: "",//推送条件-年级 可多选 关联 t_dict_details(code)
                    openFlag: '',//公开状态 0 不公开 1公开
                    sportType: "",//运动类型 关联 t_dict_details(code)
                    exercisePosition: "",//锻炼位置 关联 t_dict_details(code)
                    exerciseIntensity:'',//锻炼强度 0 低 1 中 2 高
                    exerciseGroup: "",//运动数(多少组)
                    groupValue: "",//每组的数量
                    groupType: '',//0 次 1 秒 (组单位)
                    site:'',//0 室内 1 室外
                    instrument: "",//锻炼器械 关联 t_dict_details(code)
                    relevanceQuality: "",//关联素质 关联 t_dict_details(code)
                    relevanceSport: "",//关联运动 关联 t_dict_details(code)
                    // delFlag: '',//删除标识 0-否 1- 是
                    createUser: '',//创建用户id
                    // pushStatus: ''//推送标识 0-否 1- 是
                },
                
                // 上传图片
                fileList1:[],
                fileList2: [],
               
                // 富文本
                content: '',
                config: {
                    initialFrameWidth: '100%',
                    initialFrameHeight: 400,
                    wordCount: false,
                },
                ue: "ue", // 不同编辑器必须不同的id

                id:''
            }
        },
        methods:{
            goback(){
                this.$router.go(-1);
            },
            publicSave(event,num,addTpye,editType){
                
                this.saveArticle(event,num,addTpye,editType)
            },
            saveArticle(event,number,addTpye,editType){
                // console.log(addTpye,editType,'----');
                if(this.id == '' && addTpye != false){
                    return this.$message({
                        type: 'error',
                        message: '没此这权限'
                    });
                }

                if(this.id != '' && editType != false){
                    return this.$message({
                        type: 'error',
                        message: '没此这权限'
                    });
                }
                this.editData.createUser = JSON.parse(localStorage.getItem("ydl_user")).userId;

                if(this.editData.title.length<1){
                    return this.$message({
                        type:'warning',
                        message:'请输入名称'
                    })
                }

                if(this.editData.picUrl == ''){
                    return this.$message({
                        type:'warning',
                        message:'请上传缩略图'
                    })
                }

                if(this.pushClass.length>=1){
                    let str = '';
                    for(let key of this.pushClass){
                        str += key+','
                    }
                    this.editData.pushClass = str.slice(0,-1); 
                    // console.log(this.editData.pushClass);
                }else{
                    return this.$message({
                        type:'warning',
                        message:'请选推送年级'
                    })
                }


                if(this.sex.length>=1){
                    let str = '';
                    for(let key of this.sex){
                        str += key+','
                    }
                    this.editData.sex = str.slice(0,-1); 
                }else{
                    return this.$message({
                        type:'warning',
                        message:'请选推送性别'
                    })
                }

                if(this.sportTypeData.length>=1){
                    let str = ''
                    for(let key of this.sportTypeData){
                        // console.log('key',key)
                        str += key+','
                    }
                    this.editData.sportType = str.slice(0,-1); 
                }else{
                    return this.$message({
                        type:'warning',
                        message:'请选推送运动类型'
                    })
                }

                if(this.exercisePositionData.length>=1){
                    let str = '';
                    for(let key of this.exercisePositionData){
                        str += key+','
                    }
                    this.editData.exercisePosition = str.slice(0,-1); 
                }else{
                    return this.$message({
                        type:'warning',
                        message:'请选推送锻炼部位'
                    })
                }

                if(this.exerciseIntensityData.length>=1){
                    this.editData.exerciseIntensity = this.exerciseIntensityData;
                }else{
                    return this.$message({
                        type:'warning',
                        message:'请选推送强度'
                    })
                }
                
                if(this.relevanceQualityData.length>=1){
                    let str = '';
                    for(let key of this.relevanceQualityData){
                        str += key+','
                    }
                    this.editData.relevanceQuality = str.slice(0,-1); 
                }else{
                    return this.$message({
                        type:'warning',
                        message:'请选推送关联素质'
                    })
                }
           
                
                if(this.relevanceSportData.length>=1){
                    let str = '';
                    for(let key of this.relevanceSportData){
                        str += key+','
                    }
                    this.editData.relevanceSport = str.slice(0,-1); 
                }else{
                    // return this.$message({
                    //     type:'warning',
                    //     message:'请选推送关联运动'
                    // })
                    this.editData.relevanceSport = '';
                }

                if(this.instrumentData.length>=1){
                    let str = '';
                    for(let key of this.instrumentData){
                        str += key+','
                    }
                    this.editData.instrument = str.slice(0,-1); 
                }else{
                    return this.$message({
                        type:'warning',
                        message:'请选推送器械'
                    })
                }

                this.editData.content = this.getUEContent();
                if(this.editData.content.length<1){
                    return this.$message({
                        type:'warning',
                        message:'请输入内容'
                    })
                }

                if(this.editData.coverPic == ''){
                    return this.$message({
                        type:'warning',
                        message:'请上传封面图'
                    })
                }


                if(number == 1){
                    // console.log('1111111111openFlag111111111111111')
                    this.editData.openFlag = '1';

                    if(this.id){
                        
                        this.editData.createUser = this.id;
                       
                        this.addpost('/api/auth/v1/sportPoint/',this.id,this.editData)
                    }else{
                        this.addpost('/api/auth/v1/sportPoint/','',this.editData)
                    }
                   
                }else{
                    // console.log('00000000000000openFlag000000000000000')
                    this.editData.openFlag = '0';
                    if(this.id){
                        this.editData.createUser = this.id;
                        
                        this.addpost('/api/auth/v1/sportPoint/',this.id,this.editData)
                    }else{
                        this.addpost('/api/auth/v1/sportPoint/','',this.editData)
                    }
                }
            },

            addpost(url,id,data){
                // console.log(data);
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
                // console.log('params',data);
                http.post(url+id,data).then(res=>{
                    if(res.status.code == '0'){
                        this.$message({
                            type: 'success',
                            message: '保存成功'
                        });
                        this.$router.push('/movingManagement');
                        loading.close();
                    }else if(res.status.code == '2010001'){
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

            // 运动类型数据
            getSportType(){
                http.get('/api/auth/v1/common/getSportType').then(res=>{
                    // console.log('sport',res)
                    if(res.status.code == '0'){
                        this.sportType = res.data;
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
                        message: '运动类型数据获取失败'
                    });
                })
            },
            // 锻炼部位数据
            getExercisePosition(){
                http.get('/api/auth/v1/common/getExercisePosition').then(res=>{
                    // console.log('getExercisePosition',res);
                    if(res.status.code == '0'){

                        this.exercisePosition = res.data;
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
                        message: '锻炼部位数据获取失败'
                    });
                })
            },

            // 器械数据
            getInstrumentType(){
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });


                http.get('/api/auth/v1/common/getInstrumentType').then(res=>{
                    if(res.status.code == '0'){
                        // console.log('器械数据',res)
                        this.instrument = res.data;
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
                        message: '器械数据获取失败'
                    });
                })
            },
            // 关联素质数据
            getSportQuality(){
                http.get('/api/auth/v1/common/getSportQuality').then(res=>{
                    // console.log('getSportQuality',res);
                    if(res.status.code == '0'){

                        this.relevanceQuality = res.data;
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
                        message: '关联素质数据获取失败'
                    });
                })
            },
            
            // 关联运动数据
            getRelevanceSportType(){
                http.get('/api/auth/v1/common/getRelevanceSportType').then(res=>{
                    // console.log('getRelevanceSportType',res);
                    if(res.status.code == '0'){

                        this.relevanceSport = res.data
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
                        message: '关联运动数据获取失败'
                    });
                })
            },
            // 年级类型
            getClass(){
                http.get('/api/auth/v1/common/getPushClass').then(res=>{
                   // console.log('年级',res)
                    if(res.status.code == 0){
                        this.classData = res.data;
                      
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
                        message: '年级数据获取失败'
                    });
                })
            },

            
            // 删除的钩子函数
            handleRemove(file, fileList) {
                if(file.name){

                    let arrayImg = file.name.split('.');
    
                    let len = arrayImg.length-1;
                     if(arrayImg[len] == 'gif'){
                        return this.$message({
                            type: 'warning',
                            message: '不可上传gif图片'
                        });
                     }
                }else{

                    this.$message({
                        type: 'success',
                        message: '删除成功'
                    });
                }
            },
           
            // 限制文件个数 
            handleExceed(files, fileList) {
                this.$message.warning(
                    `当前限制选择 1 个文件`
                );
            },
           
            beforeAvatarUpload(file) {

                let arrayImg = file.name.split('.');

                let len = arrayImg.length-1;
                
                if(arrayImg[len] == 'gif'){
                    return false;
                }

            },

            // 自定义上传图片 
            requestPicUrl(content){
                this.loadingPicUrl = true;
                let formData = new FormData;
                formData.append('file', content.file);
                // 毫秒数
                var myData = new Date(); 
                var times = myData.getTime()
                let name = content.file.name;

                let arrayImg = name.split('.');

                let len = arrayImg.length-1;
                // console.log(arrayImg[len]);


                formData.append('fileName',times+'.'+arrayImg[len]);

                formData.append('dir','/img/article/thumbnail')

                // 上传
                superagent
                .post(this.uploadPictureUrl)
                .set('Accept','application/json')
                .send(formData)
                .end((res,rep)=>{
                    // console.log(res,rep)
                    if(rep.body.status.code == 0){
                        this.editData.picUrl = rep.body.data.url;
                        this.loadingPicUrl = false;
                        this.$message({
                            type: 'success',
                            message: '上传文件成功'
                        });
                    }else if(rep.body.status.code == '2010001'){
                        this.loadingPicUrl = false;
                        this.$message({
                            type: 'error',
                            message: 'token失效请重新登录'
                        });
                        this.$router.push({name: 'login'});
                    }else{
                        this.fileList1 = [];
                        this.loadingPicUrl = false;
                        this.$message({
                            type: 'error',
                            message: rep.body.status.msg
                        });
                    }
                })
               
            },

            requestCoverPic(content){
                this.loadingCoverPic = true;
                let formData = new FormData;
                formData.append('file', content.file);
                // 毫秒数
                var myData = new Date(); 
                var times = myData.getTime()
                let name = content.file.name;

                let arrayImg = name.split('.');

                let len = arrayImg.length-1;
                console.log(arrayImg[len]);

                formData.append('fileName',times+'.'+arrayImg[len]);

                formData.append('dir','/img/article/thumbnail')

                // 上传
                superagent
                .post(this.uploadPictureUrl)
                .set('Accept','application/json')
                .send(formData)
                .end((res,rep)=>{
                    // console.log(res,rep)
                    if(rep.body.status.code == 0){
                        this.editData.coverPic = rep.body.data.url;
                        this.loadingCoverPic = false;
                        this.$message({
                            type: 'success',
                            message: '上传文件成功'
                        });
                    }else if(rep.body.status.code == '2010001'){
                        this.loadingCoverPic = false;
                        this.$message({
                            type: 'error',
                            message: 'token失效请重新登录'
                        });
                        this.$router.push({name: 'login'});
                    }else{
                        this.fileList2 = [];
                        this.loadingCoverPic = false;
                        this.$message({
                            type: 'error',
                            message: rep.body.status.msg
                        });
                    }
                })
            },
           
            // 获取ueditor的html
            getUEContent() {
                return UE.getEditor(this.ue).getContent();
            },
            edit(id){
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
                http.get('/api/auth/v1/sportPoint/'+id).then(res=>{
                    if(res.status.code == '0'){
                        this.editData = res.data;
                        this.fileList1 = [{url:this.editData.picUrl}]
                        this.fileList2 = [{url:this.editData.coverPic}]

                        this.pushClass = this.editData.pushClass.split(',');
                        this.instrumentData = this.editData.instrument.split(',');
                        this.sex = this.editData.sex.split(',');
                        this.sportTypeData = this.editData.sportType.split(',');
                        this.exercisePositionData = this.editData.exercisePosition.split(',')
                        this.exerciseIntensityData = String(this.editData.exerciseIntensity);


                        if(this.editData.site == '0'){
                            this.editData.site = '0'
                        }else if(this.editData.site == '1'){
                            this.editData.site = '1'
                        }
                        this.editData.groupType = String(this.editData.groupType);
                        this.relevanceQualityData = this.editData.relevanceQuality.split(',');
                        if(this.editData.relevanceSport){
                            this.relevanceSportData = this.editData.relevanceSport.split(',')
                        }

                        this.content = this.editData.content;
                        // console.log(this.editData.content);
                        loading.close();
                    }else if(res.status.code == '2010001'){
                        loading.close();
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
                        loading.close();
                    }
                }).catch(error=>{
                    this.$message({
                        type: 'error',
                        message: '保存失败'
                    });
                    loading.close();
                })
            }
        },
        mounted(){

            this.menuData = JSON.parse(localStorage.getItem("menuData"));

            if(this.menuData == '' || this.menuData == null || this.menuData == undefined){
                this.$router.push({name: 'login'});
            }else{

                this.id = this.$route.query.id || ''; 
    
                if(this.id){
                    this.edit(this.id);
                }
                this.getClass();
                this.getSportType();
                this.getExercisePosition();
                this.getSportQuality();
                this.getRelevanceSportType();
                this.getInstrumentType();
                
                let BASEURL = process.env.BASE_API
                // this.uploadPictureUrl = BASEURL.replace('s.op','s.file') + '/api/upload'
                this.uploadPictureUrl = process.env.UPLOAD_API + '/api/upload'
    
                this.$store.commit('getRole','addSportPoint,updateSportPoint')
            }
        }
    }

</script>