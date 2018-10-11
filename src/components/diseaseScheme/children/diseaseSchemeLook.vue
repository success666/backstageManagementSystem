<template>
    <div v-loading="loading" class="diseaseSchemeLook">
        <div class="clearfix">
            <p class="header fr">
                <el-button :disabled="$store.state.updateDiseaseScheme" @click="goedit" style="background:#83BDF9;color:#fff;">编辑</el-button>
            </p>
        </div>
        <div class="content">
            <p class="lh40">
                <span>标题：{{details.title?details.title:'---'}}</span>
            </p>

            <div>
                <el-col :span="8">
                    <span>推送范围：</span>
                    <span>{{details.pushValue?details.pushValue:'---'}}</span>
                </el-col>
                <span>更新时间：{{details.updateTime?details.updateTime:'---'}}</span>
            </div>
            <div>
                <p class="lh40">
                    <span>缩略图：</span>
                </p>
                <img  @click="openPicture($event)" :src="details.picUrl?details.picUrl:'./../../../../static/imgs/placeholder.jpg'" alt="" style="height:200px;width:300px;">
            </div>

            <div class="article">
                <h1 class="lh40 font20">方案内容</h1>
                <div ref="content" style="padding-bottom:60px;"></div>
            </div>

            <img style="display:none;" ref="img" :src="details.picUrl?details.picUrl:'./../../../../static/imgs/placeholder.jpg'" alt=""/>

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

    </div>
</template>

<style src="./diseaseSchemeLook.scss" lang="scss">

</style>

<script>
    import http from '../../../utils/HttpClient'
    export default {
        data(){
            return {
                loading:false,
                id:'',
                details:[],
                dialogVisible:false,
                height:'',
                width:'',
                url:''
            }
        },
        methods:{
            openPicture(event) {
                // window.open(event.target.src);

                
                this.height = this.$refs.img.height;
                this.width = this.$refs.img.width;

                let originalHeight = this.$refs.img.height;
                let originalWidth = this.$refs.img.width;

                // console.log(this.height,this.width)
                // console.log(document.documentElement.clientHeight,document.documentElement.clientWidth);

             
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
            // 文章详情
            Details(id){
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
                http.get('/api/auth/v1/diseaseScheme/'+id).then(res=>{
                    if(res.status.code == 0){
                        // console.log(res);
                        this.details = res.data;
                        // console.log('details',this.details)
                       
                        this.$refs.content.innerHTML = this.details.content
                        if(this.details.pushType == 2){
                            let reg = new RegExp( ',' , "g" )
                            this.details.pushValue = this.details.pushValue.replace( reg , '>' );
                        }
                        loading.close();
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
                        message: '请求数据失败!'
                    });
                })
            },

            goedit(){
                this.$router.push({path: '/diseaseScheme/diseaseSchemeEdit', query:{"id": this.id}})
            }
        },
        mounted(){
            this.menuData = JSON.parse(localStorage.getItem("menuData"));
            if(this.menuData == '' || this.menuData == null || this.menuData == undefined){
                this.$router.push({name: 'login'});
            }else{

                this.id = this.$route.query.id;
                // console.log(this.id);
                this.Details(this.id)

                this.$store.commit('getRole','updateDiseaseScheme')
            }
        }
    }
</script>