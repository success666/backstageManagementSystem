<template>
    <div class="issuesManagementLook border-radius">
        <div class="content">
            <p class="lh40">
                <el-col :span="8">
                    <span>提问人：{{details.askName?details.askName:'---'}}</span>
                </el-col>
                <el-col :span="8">
                    <span>类型：{{details.questionType?details.questionType:'---'}}</span>
                </el-col>
                <el-col :span="8">
                    <span>状态：{{details.replyStatus=='0'?'未回复':'已回复'}}</span>
                </el-col>
            </p>
            <p class="lh40">
                <span>提问：{{details.content}}</span>
            </p>
            <div>
                <p class="lh40">
                    <span>缩略图：</span><span v-if="!details.picUrl">- - -</span>
                </p>
                <span v-if="details.picUrl.length>=1" v-for="(key,index) in details.picUrl" :key="key.id">
                    <img :src="key" @click="openPicture($event,index,'0')" style="height:200px;width:300px;margin-left:4px;">
                </span>
                
            </div><br/>

            <div style="padding-top:20px;padding-right:20px;" v-for="(item,idx) in askQuestionReplys" :key="item.id">
                <div v-if="item.replyType == '0'" style="border-bottom:1px solid #ccc;">
                    <p>
                        <span>回复：{{item.content?item.content:'---'}}</span>
                    </p><br/>
                    <span v-if="item.picUrl">
                        <span  v-for="(key,index) in item.picUrl.split(',')" :key="key.id">
                            <img :src="key" @click="openPicture($event,index,'1',idx)" style="height:200px;width:300px;margin-left:4px;">
                        </span>
                    </span>
                    <p><br/>
                        <span>账号名：{{item.accountName?item.accountName:'---'}}</span><br/><br/>
                        <span>{{item.createTime?item.createTime:'---'}}</span>
                    </p>
                <br/><br/>
                </div>
                <div v-else style="border-bottom:1px solid #ccc;">
                    <p>
                        <span>提问：{{item.content?item.content:'---'}}</span>
                    </p><br/>
                    <p>
                        <span>{{item.createTime?item.createTime:'---'}}</span>
                    </p><br/>
                </div>

            </div><br/><br/>
            <div v-if="typeof($store.state[postType])=='boolean'">
                <p class="clearfix" style="width:500px;">
                    <span class="fl" style="margin-top:4px;">回复图片：</span>
                    <el-upload
                        v-loading="loading"
                        accept="image/*"
                        class="upload-demo"
                        :action="uploadPictureUrl"
                        :on-remove="handleRemove"
                        :on-success="success"
                        :limit="3"
                        :on-error="error"
                        :http-request="request"
                        :on-exceed="handleExceed"
                        :before-upload="beforeAvatarUpload"
                        :file-list="fileList2"
                        list-type="picture">
                        <el-button size="small" type="primary">点击上传</el-button>
                        <span style="color:red;font-size:12px;">最多上传3张图片，格式为jpeg等图片格式</span> 
                    </el-upload>
                </p><br/>
                <p class="clearfix">
                    <textarea :disabled="$store.state[postType]" name="return" id="return" ref="return" cols="90" rows="14" class="fl" style="font-size:18px;"></textarea>
                    <el-button class="fl" style="background:#83BDF9;color:#fff;margin:244px 0px 0px 16px;" @click="reply($store.state[postType])">回复</el-button>
                </p>
            </div><br/><br/>

            <span v-for="key in details.picUrl" :key="key.id">
                <img :src="key" ref="size" style="display:none;">
            </span>

            <div id="look">
                <p v-for="item in askQuestionReplys" :key="item.id">
                    <i v-if="item.picUrl">
                        <span v-for="(key,index) in item.picUrl.split(',')" :key="key.id">
                            <img :src="key" @click="openPicture($event,index,'1')" style="display:none;" />
                        </span>
                    </i>
                </p>
            </div>
            
        </div>

        
        <el-dialog
            style="background:#000;"
            title="图片预览"
            :visible.sync="dialogVisible"
            :fullscreen="true">
            <div style="text-align: center;">
                <img :src="url" :style="'width:'+width+'px;height:'+height+'px;'">
            </div>
        </el-dialog>
    </div>
</template>

<style src="./issuesManagementLook.scss" lang="scss">

</style>


<script>
    import superagent from 'superagent'
    import http from '../../../utils/HttpClient'
    export default {
        data(){
            return {
                loading:false,
                id:'',
                details:[],
                askQuestionReplys:[],
                dialogVisible:false,
                url:'',
                width:'',
                height:'',

                uploadPictureUrl:'',
                // 上传图片
                fileList2: [],
                urlPicture:'',
                array:[],
                accountName:'',

                postType:''
            }
        },
        methods:{
            openPicture(event,index,type,idx) {
                let imgSrc;

                console.log(event,index,type,idx);
                let originalHeight;
                let originalWidth;

                if(type == '0'){
                    this.height = this.$refs.size[index].height;
                    this.width = this.$refs.size[index].width;
    
                    originalHeight = this.$refs.size[index].height;
                    originalWidth = this.$refs.size[index].width;
                }else if(type == '1'){
                    imgSrc = document.querySelector('#look').querySelectorAll('p');
                    imgSrc = imgSrc[idx].querySelectorAll('img');
                    this.height = imgSrc[index].height;
                    this.width = imgSrc[index].width;

                    originalHeight = imgSrc[index].height;
                    originalWidth = imgSrc[index].width;
                }

             
                if(this.height>=document.documentElement.clientHeight-114){
                    this.height = document.documentElement.clientHeight-120
                    this.width = this.height/originalHeight*this.width
                }
                

                if(this.width>=document.documentElement.clientWidth-60){
                    this.width = document.documentElement.clientWidth-60
                    this.height = this.width/originalWidth*this.height
                }
                


                if(originalHeight>=document.documentElement.clientHeight*2){
                    this.height = originalHeight
                    this.width = originalWidth
                }else if(originalWidth>=document.documentElement.originalWidth*2){
                    this.height = originalHeight
                    this.width = originalWidth
                }


                this.dialogVisible = true;
                this.url = event.target.src;
              
            },
            // sale
            articleDetails(id){
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
                http.get('/api/auth/v1/askQuestion/'+id).then(res=>{
                    if(res.status.code == 0){

                        // console.log('详情',res);
                        
                        this.details = res.data;  
                        if(this.details.picUrl.length>=1){
                            this.details.picUrl = this.details.picUrl.split(',')
                        }
                        this.askQuestionReplys = res.data.askQuestionReplys;

                        if(this.details.questionType == '0'){
                            this.details.questionType = '营养指导'
                            this.postType = 'nutritionReply'
                        }else if(this.details.questionType == '1'){
                            this.details.questionType = '运动指导'
                            this.postType = 'sportReply'
                        }else if(this.details.questionType == '2'){
                            this.details.questionType = '疾病防控'
                            this.postType = 'diseaseReply'
                        }
                        
                        // console.log('arr',this.details.picUrl);
                        // console.log('askQuestionReplys',this.askQuestionReplys)

                        loading.close();
                    }else if(res.status.code == '2010001'){
                        this.$message({
                            type: 'error',
                            message: 'token失效请重新登录'
                        });
                        this.$router.push({name: 'login'});
                        loading.close();
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
                        message: '请求数据失败!'
                    });
                    loading.close();
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
                    `最多可上传 3 个文件`
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
                    console.log(res,rep)
                    if(rep.body.status.code == 0){
                        // console.log(rep.body.data.url)
                        this.array.push(rep.body.data.url);
                        // console.log(this.fileList2)
                        this.success();
                        this.loading = false;
                    }else if(rep.body.status.code == '2010001'){
                        this.loading = false;
                        this.$message({
                            type: 'error',
                            message: 'token失效请重新登录'
                        });
                        this.$router.push({name: 'login'});
                    }else{
                        this.loading = false;
                        // console.log(imgUl)
                        this.fileList2 = [];
                        return this.$message({
                            type: 'error',
                            message: rep.body.status.msg
                        });
                    }
                })

               
            },
            reply(role){
                // console.log(role)
                // console.log('role',role.toString())

                let roleStatus = role.toString()

                // console.log(roleStatus);
                if(roleStatus != 'false'){
                    return this.$message({
                        type: 'warning',
                        message: '没有此权限'
                    });
                }
                
                if(this.$refs.return.value.length<=0){
                    return this.$message({
                        type: 'warning',
                        message: '请填写回复内容'
                    });
                }
                
                 const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });

                if(this.array.length>=1){

                    let str = '';
                    for(let i=0;i<this.array.length;i++){
                        str += this.array[i] + ',';
                    }
                    this.urlPicture = str.slice(0,-1);
                }

                let params = {
                    askQuestionId:this.details.id,
                    // accountName:'',
                    content:this.$refs.return.value,
                    picUrl:this.urlPicture,
                    accountName:this.accountName
                }

                // let user = window.localStorage.getItem('ydl_user')
                // console.log(user);

                // console.log(this.details);
                // console.log(this.$refs.return.value);
                http.post('/api/auth/v1/askQuestion/'+this.postType,params).then(res=>{
                    if(res.status.code == 0){
                        loading.close();
                        this.fileList2 = [];
                        this.$message({
                            type: 'success',
                            message: '回复成功'
                        });
                        document.querySelector('ul.el-upload-list').innerHTML = '';
                        // this.$router.push('/IssuesManagement');
                        this.$refs.return.value = ''
                        this.articleDetails(this.id)
                    }else if(res.status.code == '2010001'){
                        this.$message({
                            type: 'error',
                            message: 'token失效请重新登录'
                        });
                        this.$router.push({name: 'login'});
                        loading.close();
                    }else{
                        this.$message({
                            type: 'error',
                            message: res.status.msg
                        });
                        loading.close();
                    }
                })
            }
           
           
        },
        mounted(){
            this.menuData = JSON.parse(localStorage.getItem("menuData"));
            if(this.menuData == '' || this.menuData == null || this.menuData == undefined){
                this.$router.push({name: 'login'});
            }else{

                this.id = this.$route.query.id;
                // console.log(this.id);
                this.articleDetails(this.id)

                const user = JSON.parse(window.localStorage.getItem('ydl_user'));

                this.accountName = user.username;
                
                this.$store.commit('getRole','nutritionReply,sportReply,diseaseReply')

                let BASEURL = process.env.BASE_API
                // this.uploadPictureUrl = BASEURL.replace('s.op','s.file') + '/api/upload'
                this.uploadPictureUrl = process.env.UPLOAD_API + '/api/upload'

            }
           
        },
        computed: {
            count(){
                return this.$store.state[this.postType]
            }
        } 
    }
</script>