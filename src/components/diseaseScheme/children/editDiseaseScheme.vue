<template>
    <div>
        <div class="clearfix">
            <!-- title -->
            <p style="padding:10px 0px;">
                *标题：
                <el-input placeholder="请输入标题" v-model="editData.title" clearable style="width:80%;"></el-input>
            </p>
           
            <!-- 推送范围 -->
            <div class="fl clearfix">
                <span class="fl" style="padding-top:8px;">*推送范围：</span>   
                
                <!-- 年龄 -->
                <p class="fl clearfix" style="margin-bottom:10px;">
                    <span class="fl">
                        <el-radio v-model="radio" label="1" @change="radioChange">年龄</el-radio>
                        <el-select
                            class="select"
                            style="width:330px;"
                            :disabled="age"
                            v-model="pushAge"
                            multiple
                            placeholder="请选择推送年龄">
                            <el-option
                            v-for="item in pushAgeData"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </span>
                    <!-- 健康问题 health -->
                    <span class="fl" style="margin-left:10px;">
                        <el-radio v-model="radio" label="2" @change="radioChange">健康问题</el-radio>
                        <el-cascader
                            style="width:260px;"
                            ref="cascader"
                            :disabled="health"
                            :options="options"
                            :props="configuration"
                            v-model="selectedOptions"
                            @change="handleChange"
                            placeholder="请选择健康问题">
                        </el-cascader>
                    </span>
                </p>
                <!-- 上传图片 -->
                <p class="clearfix" style="width:500px;">
                    <span class="fl" style="margin-top:4px;">*缩略图：</span>
                    <el-upload
                        v-loading="loading"
s                        accept="image/*"
                        class="upload-demo"
                        :action="uploadPictureUrl"
                        :on-remove="handleRemove"
                        :on-success="success"
                        :limit="1"
                        :on-error="error"
                        :http-request="request"
                        :on-exceed="handleExceed"
                        :before-upload="beforeAvatarUpload"
                        :file-list="fileList2"
                        list-type="picture">
                        <el-button size="small" type="primary">点击上传</el-button>
                        <span style="color:red;font-size:12px;">建议上传图片大小为160*160，格式为jpeg等图片格式</span> 
                    </el-upload>
                </p>
                <!-- <span class="fl" style="padding-top:4px;color:red;">(请上传686*214的图片,格式为jpeg,png等图片格式)</span> -->
            </div>
        </div><br/>
        <!-- 富文本编辑器 -->
        <h2>*方案内容</h2>
        <div><br/>
            <Ueditor :content="content" :config="config" :id="ue" ref="ue"></Ueditor>
        </div><br/>

        <!-- footer -->
        <div class="ac">
            <p>
                <el-button @click="goback" style="background:#83BDF9;color:#fff;">取消</el-button>
                <el-button @click="publicSave($event,'1',$store.state.addDiseaseScheme,$store.state.updateDiseaseScheme)" style="background:#83BDF9;color:#fff;">保存并公开</el-button>
                <el-button @click="saveArticle($event,'0',$store.state.addDiseaseScheme,$store.state.updateDiseaseScheme)" style="background:#83BDF9;color:#fff;">保存</el-button>
            </p><br/>
        </div>
    </div>
</template>


<style src="./editDiseaseScheme.scss" scoped lang="scss">
    
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
                loading:false,
                uploadPictureUrl:'',
                options: [],
                selectedOptions: [],
                configuration:{
                    value:'id',
                    label:'name',
                    children:'children'
                },


                userId:'',
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
                // 推送年龄
                pushAge:[],
              
               
                // 参数 
                editData:{
                    createUser:'',
                    title:'',//标题
                    picUrl:'',//缩略图
                    content:'',//文章内容
                    pushAge:'',//推送范围条件-年龄  0-( 6-10岁） 1-(11-13)  2-(14岁以上)
                    pushValue:'',
                    healthType:'',   //...................................................
                    pushType:''
                },

                // 上传图片
                fileList2: [],
               

                // 年龄 年级单选
                radio: '',
                age:true,
                health:true,


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
            handleChange(value) {
                // console.log(value);
                // console.log(this.$refs.cascader.currentLabels)
                return this.$refs.cascader.currentLabels;
            },
            goback(){
                this.$router.go(-1);
            },
 
            publicSave(event,num,addTpye,editType){
                if(this.id == '' && addTpye == true){
                    return this.$message({
                        type: 'error',
                        message: '没此这权限'
                    });
                }

                if(this.id != '' && editType == true){
                    return this.$message({
                        type: 'error',
                        message: '没此这权限'
                    });
                }
                // console.log(num)
                this.saveArticle(event,num)
            },
            saveArticle(event,number,addTpye,editType){
                if(this.id == '' && addTpye == true){
                    return this.$message({
                        type: 'error',
                        message: '没此这权限'
                    });
                }

                if(this.id != '' && editType == true){
                    return this.$message({
                        type: 'error',
                        message: '没此这权限'
                    });
                }
                this.getUEContent();
                
                this.editData.content = this.getUEContent();
                // // 一般非空判断
                if(this.editData.title == ''){
                    return this.$message({
                        type: 'warning',
                        message: '请填写标题'
                    });
                }else if(this.editData.content == ''){
                    return this.$message({
                        type: 'warning',
                        message: '请选添加内容'
                    });
                }else if(this.radio == ''){
                    return this.$message({
                        type: 'warning',
                        message: '请选推送范围'
                    });
                }else if(this.pushAge.length<= '0' && this.selectedOptions.length<= '0'){
                    return this.$message({
                        type: 'warning',
                        message: '请选推送范围'
                    });
                }
            
                if(this.pushAge.length>=1){
                    let str = '';
                    let ageData = '';
                    for(let key of this.pushAge){
                        if(key == '0'){
                            ageData += '6-10岁,'
                        }else if(key == '1'){
                            ageData += '11-13岁,'
                        }else if(key == '2'){
                            ageData += '14岁以上,'
                        }
                        str += key+',';
                    }
                    this.editData.pushAge = str.slice(0,-1);
                    this.editData.pushValue = ageData.slice(0,-1)
                    this.editData.pushType = 1;
                }else{
                    this.editData.pushAge = '';
                }

                if(this.selectedOptions.length>=1){
                    let valueData = '';
                    let healthValue = this.handleChange();
                    for(var i=0;i<healthValue.length;i++){
                        // console.log(healthValue[i])
                        valueData += healthValue[i] + ','
                    }
                   
                    let strString = '';
                    for(let keys of this.selectedOptions){
                        strString += keys + ',';
                    }
                    this.editData.healthType = strString.slice(0,-1);

                    this.editData.pushValue = valueData.slice(0,-1);
                    this.editData.pushType = 2;
                }else{
                    this.editData.healthType = '';
                }

                this.editData.createUser = this.userId;

                // console.log("fileList2",this.fileList2)
                if(this.editData.picUrl == ''){
                    return this.$message({
                        type: 'warning',
                        message: '请上传图片'
                    });
                }

                this.editData.content = this.getUEContent();

                // console.log('editData',this.editData)

                if(number == 1){
                    if(this.id){
                        this.editData.id = this.id;
                        this.addpost('/api/auth/v1/diseaseScheme/',this.id,this.editData)
                    }else{
                        this.editData.openFlag = '1';
                        this.addpost('/api/auth/v1/diseaseScheme','',this.editData)
                    }
                   
                }else{
                    this.editData.openFlag = 0;
                    if(this.id){
                        this.editData.id = this.id;
                       
                        // console.log(this.editData);
                        this.addpost('/api/auth/v1/diseaseScheme/',this.id,this.editData)
                    }else{
                        this.addpost('/api/auth/v1/diseaseScheme','',this.editData)
                    }
                }
            },

            addpost(url,id,data){
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
                // console.log('------data-------',data);
                http.post(url+id,data).then(res=>{
                    if(res.status.code == 0){
                    // console.log('res',res)
                        loading.close();
                        this.$message({
                            type: 'success',
                            message: '保存成功'
                        });
                        this.$router.push('/diseaseScheme');
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
                        message: '保存失败'
                    });
                })

            },

          

          
            // 单选清空多选输入框
            radioChange(){
                if(this.radio == 1){
                    this.age = false;
                    this.health = true;
                    this.selectedOptions = [];
                }else if(this.radio == 2){
                    this.health = false;
                    this.age = true;
                    this.pushAge = [];
                }
            //    console.log('单选框',this.radio)
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
                this.loading = true;
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

                // console.log('name',times)
                formData.append('dir','/img/article/thumbnail')
                // formData.append('fileName','/img/article/thumbnail')

                // console.log('formData',formData);
                // 上传
                superagent
                .post(this.uploadPictureUrl)
                .set('Accept','application/json')
                .send(formData)
                .end((res,rep)=>{
                    // console.log(res,rep)
                    if(rep.body.status.code == 0){
                        this.editData.picUrl = rep.body.data.url;
                        this.loading = false;
                        this.success();
                    }else if(rep.body.status.code == '2010001'){
                        this.loading = false;
                        this.$message({
                            type: 'error',
                            message: 'token失效请重新登录'
                        });
                        this.$router.push({name: 'login'});
                    }else{
                        this.fileList2 = [];
                        this.loading = false;
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
                http.get('/api/auth/v1/diseaseScheme/'+id).then(res=>{
                    if(res.status.code == 0){
                        console.log('edit -- content',res);
                        // content 富文本
                        this.content = res.data.content;
                        this.editData = res.data;

                        // 缩略图片
                        this.fileList2 = [{
                            url:this.editData.picUrl
                        }];


                        if(this.editData.healthType){
                            // console.log(this.editData.healthType)
                            let arraySelect = this.editData.healthType.split(',')
                            // console.log(arraySelect)
                            for(var i=0;i<arraySelect.length;i++){
                                console.log(arraySelect[i])
                                this.selectedOptions.push(arraySelect[i]*1);
                            }


                            // console.log(this.selectedOptions)
                            this.radio = '2';
                            this.age = true;
                            this.health = false;
                            this.pushAge = [];
                        }

                        if(this.editData.pushAge){
                            this.pushAge = this.editData.pushAge.split(',')
                            this.radio = '1';
                            this.age = false;
                            this.health = true;
                            this.selectedOptions = []
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
                    loading.close();
                })
            },
          
            dropDownList(){
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
                http.get('/api/auth/v1/diseaseClassify').then(res=>{
                    if(res.status.code == 0){
                    //    console.log('dropDownList',res);
                       this.options = res.data;
                       for(let key of this.options){
                        //    console.log(key);
                           if(key.children.length>=1){
                               for(let item of key.children){
                                //    console.log('一级',item)
                                   if(item.children.length>=1){
                                       for(let keys of item.children){
                                        //    console.log('二级',keys)
                                           if(keys.children.length>=1){
                                            //    for(let items of keys.children){
                                            //        console.log('三级',items)

                                            //        if(items.children.length>=1){

                                            //        }else{
                                            //            delete items.children
                                            //        }
                                            //    }
                                           }else{
                                               delete keys.children
                                           }
                                       }
                                   }else{
                                       delete item.children
                                   }
                               }
                           }else{
                               delete key.children;
                           }
                        }
                        loading.close();
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
                        loading.close();
                    }
                }).catch(error=>{
                    this.$message({
                        type: 'error',
                        message: '获取内容失败'
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

                this.userId = JSON.parse(localStorage.getItem("ydl_user")).userId;
                // console.log(this.userId);

                this.dropDownList();

                let BASEURL = process.env.BASE_API
                // this.uploadPictureUrl = BASEURL.replace('s.op','s.file') + '/api/upload'
                this.uploadPictureUrl = process.env.UPLOAD_API + '/api/upload'
            }
        }
    }
</script>