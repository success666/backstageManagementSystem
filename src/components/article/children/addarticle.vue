<template>
    <div class="editArticle">
        <div class="clearfix">
            <!-- title -->
            <p>
                *标题：
                <el-input placeholder="请输入标题" v-model="addArticleData.title" clearable class="title"></el-input>
            </p><br/>
            <p>
                *类型：
                <el-select v-model="articleType" placeholder="请选择类型">
                    <el-option
                    v-for="item in type"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                    </el-option>
                </el-select> 
                &nbsp;&nbsp;&nbsp;&nbsp;*作者：
                <el-input placeholder="请输入作者" v-model="addArticleData.author" clearable class="width"></el-input> 
            </p><br/>
            <!-- 上传图片 -->
            <p class="clearfix" style="width:500px;">
                <span class="fl" style="margin-top:4px;">*缩略图：</span>
                <el-upload
                    v-loading="articleLoading"
                    accept="image/*"
                    class="upload-demo"
                    :action="uploadPictureUrl"
                    :on-remove="handleRemove"
                    :on-success="success"
                    :limit="1"
                    :on-error="error"
                    :http-request="request"
                    :on-exceed="handleExceed"
                    :file-list="fileList2"
                    :before-upload="beforeAvatarUpload"
                    list-type="picture">
                    <el-button size="small" style="background:#83BDF9;color:#fff;">点击上传</el-button>
                    <span style="color:red;font-size:12px;">建议上传图片大小为160*160，格式为jpeg等图片格式</span> 
                </el-upload>
            </p><br/>
            
            <!-- 推送范围 -->
            <div class="fl clearfix range">
                <span class="fl rangeSpan">*推送范围：</span>   
                <span class="fl">
                    <el-checkbox-group v-model="checkedCities">
                        <el-checkbox label="个人版" @change="checked1"  class="personage"></el-checkbox>
                        <el-checkbox label="学校版" @change="checked2" class="schools"></el-checkbox>
                        <el-checkbox label="abc" style="display:none;"></el-checkbox>
                    </el-checkbox-group>
                </span>
                <!-- 年龄 -->
                <p class="fl clearfix age">
                    <span class="fl">
                        <el-radio v-model="radio" label="1" :disabled="self" @change="radioChange">年龄</el-radio>
                        <el-select
                            class="select width"
                            :disabled="age"
                            v-model="pushAge"
                            multiple
                            collapse-tags
                            placeholder="请选择推送年龄">
                            <el-option
                            v-for="item in pushAgeData"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                        <!-- 性别 -->
                        <span class="sex">
                            *性别
                            <el-select
                                class="width"
                                :disabled="self"
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
                        </span><br/><br/>
                        <!-- 年级 -->
                        <span class="grade">
                            <el-radio v-model="radio" label="2" :disabled="self" @change="radioChange">年级</el-radio>
                            <el-select
                                class="width"
                                :disabled="classs"
                                v-model="classValue"
                                multiple
                                collapse-tags
                                placeholder="请选推送年级">
                                <el-option
                                v-for="item in classType"
                                :key="item.code"
                                :label="item.name"
                                :value="item.code">
                                </el-option>
                            </el-select>
                        </span>
                    </span>
                    <!-- 学校类型 -->
                    <span class="fl">
                        <el-select
                            class="schoolType"
                            :disabled="school"
                            v-model="schoolType"
                            multiple
                            placeholder="请选择推送学校类型">
                            <el-option
                            v-for="item in schoolTypeData"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </span>
                </p>
            </div>
        </div>
        <!-- 富文本编辑器 -->
        <div>
            <p>*文章内容</p><br/>
            <Ueditor :content="content1" :config="config" :id="ue" ref="ue"></Ueditor><br/>
        </div>


        <!-- footer -->
        <div style="text-align:center;">
            <p>
                <el-button @click="goback" style="background:#83BDF9;color:#fff;">取消</el-button>
                <el-button @click="publicSave($event,'1',$store.state.addArticle,$store.state.updateArticle)" style="background:#83BDF9;color:#fff;">保存并公开</el-button>
                <el-button @click="saveArticle($event,'0',$store.state.addArticle,$store.state.updateArticle)" style="background:#83BDF9;color:#fff;">保存</el-button>
            </p>
        </div><br/>
    </div>
</template>


<style src="./addarticle.scss" lang="scss">
    
</style>
<script>
    import superagent from 'superagent'
    import http from '../../../utils/HttpClient'
    import Ueditor from './ueditor.vue'


    export default {
        components:{
            Ueditor
        },
        data(){
            return {
                // loading
                articleLoading:false,
                uploadPictureUrl:'',
                // 年级类型
                classType: [],
                // 年级类型
                classValue: [],


                // 推送年龄
                pushAge:[],
                // 推送年级
                schoolType:[],
                // 推送性别
                sex:[],
                // 文章类型
                articleType:'',

                type:[{
                    id:0,
                    name:'营养',
                },{
                    id:1,
                    name:'健康'
                },{
                    id:2,
                    name:'运动'
                },{
                    id:3,
                    name:'疾病'
                }],
                sexData:[{
                    id:0,
                    value:'0',
                    label:'男'
                },{
                    id:1,
                    value:'1',
                    label:'女'
                }],
                pushAgeData:[{
                    id:0,
                    value:'0',
                    label:'6-10岁'
                },{
                    id:1,
                    value:'1',
                    label:'11-13岁'
                },{
                    id:2,
                    value:'2',
                    label:'14岁以上'
                }],
                 schoolTypeData:[{
                    id:0,
                    value:'0',
                    label:'小学'
                },{
                    id:1,
                    value:'1',
                    label:'初中'
                },{
                    id:2,
                    value:'2',
                    label:'高中'
                }],
                // 参数 
                addArticleData:{
                    id:'',
                    title:'',//标题
                    author:'',//作者
                    picUrl:'',//缩略图
                    content:'',//文章内容
                    openFlag:'',//公开状态 0 不公开 1公开
                    articleType:'',//文章类型  0 营养  1 健康  2 运动 3 疾病  
                    sex:'',//推送范围条件-性别 0 男 1女     
                    schoolType:'',// 推送范围条件-学校类型 0 小学 1初中 2高中 
                    pushVersion:'',//推送范围条件-版本 0 学校版 1 个人版
                    pushType:'', 
                    pushAge:'',//推送范围条件-年龄  0-( 6-10岁） 1-(11-13)  2-(14岁以上)
                    pushGrade:''//推送范围条件-年级 引用年级字典表 t_dict_grade
                },

                // 上传图片
                fileList2: [],
               

                // 个人版 学校版 多选
                checkedCities: ['abc'],

                // 年龄 年级单选
                radio: '',

                // 状态 
                self:true,
                school:true,
                age:true,
                classs:true,

                // 富文本
                content1: '',
                config: {
                    initialFrameWidth: "100%",
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
            strForOf(output,input){
                
            },
            publicSave(event,num,addType,editType){
                
                this.saveArticle(event,num,addType,editType)
            },
            saveArticle(event,number,addTpye,editType){

                if(this.id == '' && addTpye != ''){
                    return this.$message({
                        type: 'error',
                        message: '没此这权限'
                    });
                }

                if(this.id != '' && editType != ''){
                    return this.$message({
                        type: 'error',
                        message: '没此这权限'
                    });
                }

                this.getUEContent();
                
                this.addArticleData.content = this.getUEContent();
                // 一般非空判断
                if(this.addArticleData.title == ''){
                    return this.$message({
                        type: 'warning',
                        message: '请填写标题'
                    });
                }else if(this.addArticleData.author == ''){
                    return this.$message({
                        type: 'warning',
                        message: '请填写作者'
                    });
                }else if(this.articleType.toString == ''){
                    return this.$message({
                        type: 'warning',
                        message: '请选择类型'
                    });
                }else if(this.addArticleData.content == ''){
                    return this.$message({
                        type: 'warning',
                        message: '请选添加内容'
                    });
                }


                // 推送范围非空判断
                let strs = '';
                for(let key of this.checkedCities){
                    // console.log(key);
                    if(key == '个人版'){
                        strs += '1,'
                    }else if(key == '学校版'){
                        strs += '0,';
                    }
                }
                this.addArticleData.pushVersion = strs.slice(0,-1);

                if(this.addArticleData.pushVersion.length == 0){
                    return this.$message({
                        type: 'warning',
                        message: '请选择推送范围'
                    });
                }else{
                    let arr = strs.split(',')
                    for(let key of arr){
                        if(key == '0'){
                            let length = this.schoolType.length;
                            if(length < 1){
                                return this.$message({
                                    type: 'warning',
                                    message: '请选择学校类型'
                                });
                            }
                        }else if(key == '1'){
                            let len = this.sex.length;
                            let ageLeng = this.pushAge;
                            let classLeng = this.classValue;
                            if(len < 1){
                                return this.$message({
                                    type: 'warning',
                                    message: '请选择性别'
                                });
                            }
                            // console.log(ageLeng,classLeng)
                            if(ageLeng.length <1 && classLeng.length <1){
                                return this.$message({
                                    type: 'warning',
                                    message: '请选择推送的年龄或年级'
                                });
                            }

                        }
                    }
               
                }



                // array => string
                if(this.sex.length>=1){
                    let str = '';
                    for(let key of this.sex){
                        str += key+',';
                    }
                    this.addArticleData.sex = str.slice(0,-1);
                }else{
                    this.addArticleData.sex = '';
                }

                if(this.schoolType.length>=1){
                    let str = '';
                    for(let key of this.schoolType){
                        str += key+',';
                    }
                    this.addArticleData.schoolType = str.slice(0,-1);
                }else{
                    this.addArticleData.schoolType = '';
                }

                if(this.pushAge.length>=1){
                    let str = '';
                    for(let key of this.pushAge){
                        str += key+',';
                    }
                    this.addArticleData.pushAge = str.slice(0,-1);
                    this.addArticleData.pushType = '1'
                }else{
                    this.addArticleData.pushAge = '';
                }

              
                // pushGrade  
                if(this.classValue.length<1){
                    this.addArticleData.pushGrade = '';

                }else{
                    let str = '';
                    for(let key of this.classValue){
                        str += key+',';
                    }
                    this.addArticleData.pushGrade = str.slice(0,-1);
                    this.addArticleData.pushType = '2'
                }

                if(this.addArticleData.picUrl == ''){
                    return this.$message({
                        type: 'warning',
                        message: '请上传图片'
                    });
                }

                this.addArticleData.articleType = this.articleType;
                
                let pushVersion = this.addArticleData.pushVersion.split(',');

                let arrayPushVersion = new Set(pushVersion)

                this.addArticleData.pushVersion = Array.from(arrayPushVersion)

                if(this.addArticleData.pushVersion.length == '1'){
                    this.addArticleData.pushVersion = this.addArticleData.pushVersion[0];
                }else if(this.addArticleData.pushVersion.length == '2'){
                    this.addArticleData.pushVersion = '0,1';
                }


                if(number == 1){
                    this.addArticleData.openFlag = '1';
                    if(this.id){
                        this.addArticleData.id = this.id;
                        delete this.addArticleData.createTime
                        delete this.addArticleData.updateTime
                        delete this.addArticleData.createUser
                        this.addpost('/api/auth/v1/article/',this.id,this.addArticleData)
                    }else{
                        this.addpost('/api/auth/v1/article/','',this.addArticleData)
                    }
                   
                }else{
                    this.addArticleData.openFlag = '0';
                    if(this.id){
                        this.addArticleData.id = this.id;
                        delete this.addArticleData.createTime
                        delete this.addArticleData.updateTime
                        delete this.addArticleData.createUser
                        
                        this.addpost('/api/auth/v1/article/',this.id,this.addArticleData)
                    }else{
                        this.addpost('/api/auth/v1/article/','',this.addArticleData)
                    }
                }
            },

            addpost(url,id,data){
                // console.log('params',data)
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
                http.post(url+id,data).then(res=>{
                    if(res.status.code == '0'){
                        loading.close();
                        this.$message({
                            type: 'success',
                            message: '保存成功'
                        });
                        this.$router.push('/article');
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

            // 个人版 条件是否可用
            checked1(){
                for(var key of this.checkedCities){
                    // console.log(key);
                    if(key == '个人版'){
                        this.self = false;
                        this.classs = true;
                        this.age = false;
                        this.radio = '1';
                    }else{
                        this.sex = [];
                        this.pushAge = [];
                        this.classValue = [];
                        this.radio = '';
                        this.self = true;
                        this.classs = true;
                        this.age = true;
                    } 
                }
            },

            // 学校版 条件是否可用
            checked2(){
                for(var key of this.checkedCities){
                    if(key == '学校版'){
                        this.school = false;
                    }else{
                        this.school = true;
                        this.schoolType = [];
                    }
                }
            },


            // 单选清空多选输入框
            radioChange(){
                // console.log(this.radio);
                if(this.radio == 1){
                    this.age = false;
                    this.classs = true;
                    this.classValue = [];
                }else if(this.radio == 2){
                    this.classs = false;
                    this.age = true;
                    this.pushAge = [];
                }
            },


            // 年级类型
            getClass(){
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
                http.get('/api/auth/v1/common/getPushClass').then(res=>{
                    if(res.status.code == 0){
                        this.classType = res.data;

                        // console.log(this.classType);
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
                        message: '年级数据获取失败'
                    });
                })
            },

            // 上传图片成功的钩子函数
            success(response,file,fileList){
                this.$message({
                    type: 'success',
                    message: '上传文件成功'
                });
            },
            // 删除的钩子函数
            handleRemove(file, fileList) {
                console.log(file);

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
            // 上传图片失败的钩子函数
            error(){
                this.$message({
                    type: 'error',
                    message: '上传文件失败'
                });
            },


            beforeAvatarUpload(file) {

                let arrayImg = file.name.split('.');

                let len = arrayImg.length-1;
                
                if(arrayImg[len] == 'gif'){
                    return false;
                }


            },

            // 自定义上传图片 
            request(content){
                this.articleLoading = true;
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

                // console.log('formData',formData);
                // 上传
                superagent
                .post(this.uploadPictureUrl)
                .set('Accept','application/json')
                .send(formData)
                .end((res,rep)=>{
                    console.log(res,rep)
                    if(rep.body.status.code == '0'){
                        this.addArticleData.picUrl = rep.body.data.url;
                        this.articleLoading = false;
                        this.success();
                    }else if(rep.body.status.code == '2010001'){
                        this.articleLoading = false;
                        this.$message({
                            type: 'error',
                            message: 'token失效请重新登录'
                        });
                        this.$router.push({name: 'login'});
                    }else{
                        this.articleLoading = false;
                        this.fileList2 = [];
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
                http.get('/api/auth/v1/article/'+id).then(res=>{
                    // console.log('editData',res);
                    if(res.status.code == "0"){
                        // console.log('content',res);
                        // content 富文本
                        this.content1 = res.data.content;

                        this.addArticleData = res.data;
                        // 缩略图片
                        this.fileList2 = [{
                            url:this.addArticleData.picUrl
                        }];

                        if(this.addArticleData.pushGrade){

                            this.classValue = this.addArticleData.pushGrade.split(',')
                           
                            if(this.classValue[0] == ''){
                                this.classValue = [];
                            }
                            
                            if(this.classValue.length>0){
                                this.classs = false;
                                this.radio = '2'
                                this.checkedCities.push('个人版')
                            }
                        }

                        // 推送年龄
                        if(this.addArticleData.pushAge){
                            this.pushAge = this.addArticleData.pushAge.split(',')
                            if(this.pushAge[0] == ''){
                                this.pushAge = [];
                            }
                            if(this.pushAge.length>0){
                                this.age = false;
                                this.radio = '1'
                                this.checkedCities.push('个人版')
                            }
                        }



                        // 推送性别
                        this.sex = this.addArticleData.sex.split(',')
                        // console.log(this.sex,'推送性别')
                        if(this.sex[0] == ''){
                            this.sex = [];
                        }
                        if(this.sex.length>0){
                            this.self = false;
                            
                        }

                        // 推送学校
                        this.schoolType = this.addArticleData.schoolType.split(',')
                        if(this.schoolType[0] == ''){
                            this.schoolType = [];
                        }
                        if(this.schoolType.length>0){
                            // console.log('this.schoolType',this.schoolType);
                            this.school = false;
                            this.checkedCities.push('学校版')
                        }

                        
                        this.articleType = this.addArticleData.articleType*1
                        



                        // 推送版本
                        if(this.addArticleData.pushVersion){
                            // console.log(this.addArticleData.pushVersion);
                            let array = this.addArticleData.pushVersion.split(',');
                            for(let key of array){
                                if(key == 0){
                                    this.checkedCities.push('学校版')
                                }else if(key == 1){
                                    this.checkedCities.push('个人版')
                                }
                               
                            }

                        }
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
                        message: '获取内容失败'
                    });
                })
            }
        },
        mounted(){
            this.menuData = JSON.parse(localStorage.getItem("menuData"));

            if(this.menuData == '' || this.menuData == null || this.menuData == undefined){
                this.$router.push({name: 'login'});
            }else{

                this.id = this.$route.query.id || '';
                this.getClass();
                let BASEURL = process.env.BASE_API

                // this.uploadPictureUrl = BASEURL.replace('s.op','s.file') + '/api/upload'
                this.uploadPictureUrl = process.env.UPLOAD_API + '/api/upload'

                // console.log('process.env.BASE_API',BASEURL,this.uploadPictureUrl)
                if(this.id){
                    this.edit(this.id);
                }

                this.$store.commit('getRole','addArticle,updateArticle')
            }

        }
    }

</script>