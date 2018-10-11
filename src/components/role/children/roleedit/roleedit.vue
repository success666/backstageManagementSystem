<template>
    <div style="background:#fff;margin-bottom:20px;" class="border-radius">
        <p style="padding:20px;">
            角色名:
            <el-input placeholder="请输入角色名" v-model="username" clearable style="width:60%;"></el-input> 
        </p>
        <el-tree
            :data="treedata"
            show-checkbox
            ref="tree"
            node-key="id"
            :props="defaultProps">
        </el-tree>
        <div class="buttons" style="padding: 20px;">
            <el-button @click="goback" style="background:#83BDF9;color:#fff;">取消</el-button>
            <el-button @click="resetChecked" style="background:#83BDF9;color:#fff;">清空</el-button>
            <el-button @click="save($event,$store.state.addRole,$store.state.updateRole)" type="" style="background:#83BDF9;color:#fff;">保存</el-button>
        </div>
    </div>
</template>

<style src="./roleedit.scss">
    
</style>

<script>
    import http from './../../../../utils/HttpClient'
    export default {
        data(){
            return {
                username:'',
                treedata:[],
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                arr:[],
                id:''
        
            }
        },
        methods:{
            
            getCheckedKeys() {
                // console.log(this.$refs.tree.getCheckedKeys());
            },
            resetChecked() {
                this.$refs.tree.setCheckedKeys([]);
            },
            goback() {
                this.$router.go(-1)
            },
            save(event,addTpye,editType){
                // console.log(addTpye,editType)
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

                if(this.username){
                    const loading = this.$loading({
                        lock: true,
                        text: 'Loading',
                        spinner: 'el-icon-loading',
                        background: 'rgba(0, 0, 0, 0.7)'
                    });
                    // let array = this.$refs.tree.getCheckedKeys()
                    // console.log('array',array);
                    let array = this.$refs.tree.getCheckedNodes()
                    // console.log('array-node',this.$refs.tree.getCheckedNodes());  

                    // console.log(array)

                    let parentId = []
                    for(let item of array){
                        // console.log(item);
                        parentId.push(item.id);
                        parentId.push(item.parentId);
                    // console.log('parentId',parentId);
                    }

                    array = Array.from(new Set(parentId));
                    // console.log('array-1',array);

                    for(let keys of this.treedata){
                        if(keys.children.length>=1){
                            for(let child of keys.children){

                                if(array.indexOf(child.id)>=0){
                                    array.push(child.parentId);
                                }
                            }
                        }
                    }

                    array = Array.from(new Set(array));
                    // console.log('array-2',array);



                    let obj = {"name":this.username,"menuIds":array};
                    // console.log(obj)
                    http.post('/api/auth/v1/role/'+this.id,{id:this.id,name:this.username,"menuIds":array}).then(res=>{
                        if(res.status.code == 0){
                            // console.log(res)
                            let obj = {
                                self:this,
                                type:'success',
                                text:'保存成功'
                            }
                            this.$store.commit('openSuccess',obj);
                            loading.close();
                            this.$router.push({name: 'role'});
                            // console.log(res);
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
                        let obj = {
                            self:this,
                            type:'error',
                            text:'保存失败'
                        }
                        this.$store.commit('openSuccess',obj);
                    });
                }else{
                    let obj = {
                        self:this,
                        type:'warning',
                        text:'请填写角色名'
                    }
                    this.$store.commit('openSuccess',obj);
                }
            },

            getId(id){
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
                http.get('/api/auth/v1/role/'+id).then(res=>{
                    if(res.status.code == 0){
                        // console.log('res',res)
                        this.treedata = res.data.menuList;

                        let parentArray = [];
                        for(let key of this.treedata){
                            // console.log(key.parentId);
                            parentArray.push(key.parentId)
                            if(key.children){
                                for(let item of key.children){
                                    // console.log('item',item);
                                    if(item.parentId){
                                        parentArray.push(item.parentId);

                                    }

                                    if(item.children){
                                        for(let items of item.children){
                                            if(items.parentId){
                                                parentArray.push(items.parentId);
                                            }
                                        }
                                    }
                                }
                            }
                        }

                        parentArray = Array.from(new Set(parentArray))
                        // console.log('parentArray',parentArray);
                        this.arr = res.data.permissionIds

                        for(var i=0;i<parentArray.length;i++){
                            if(this.arr.indexOf(parentArray[i])>=0){
                                let num = this.arr.indexOf(parentArray[i])
                                // console.log('num',num)
                                // console.log('this.arr[i]',this.arr[i]);
                                this.arr.splice(num,1);
                            }
                        }
                        // console.log('this.arr',this.arr);

                        setTimeout(()=>{
                            this.$refs.tree.setCheckedKeys(this.arr);
                            loading.close();
                        },1000);
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
                    let obj = {
                        self:this,
                        type:'error',
                        text:'数据获取失败'
                    }
                    this.$store.commit('openSuccess',obj);
                })
            },

            getList(){
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
                http.get('/api/auth/v1/user/menus').then(res=>{
                    if(res.status.code == 0){
                        this.treedata = res.data;
                        // console.log(this.treedata);
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
                    let obj = {
                        self:this,
                        type:'error',
                        text:'数据获取失败'
                    }
                    this.$store.commit('openSuccess',obj);
                })

            }
        },
        mounted(){
            this.menuData = JSON.parse(localStorage.getItem("menuData"));
            if(this.menuData == '' || this.menuData == null || this.menuData == undefined){
                this.$router.push({name: 'login'});
            }else{

                this.id = this.$route.query.id || this.id;
                if(this.id){
                    this.username = this.$route.query.name;
                    this.getId(this.id)
                }else{
                    this.getList();
                }

                this.$store.commit('getRole','addRole,updateRole')
            }
        }
    }
</script>