<template>
    <div style="height:100%;">
        <el-container style="height:100%;">
            <el-aside width="200px" style="height:100%;background:#29ADFF;">
                <gzhc-nav></gzhc-nav>
            </el-aside>
            <el-container>
                <el-header height="80" style="padding-left:0px;">
                    <gzhc-header></gzhc-header>  
                </el-header>
                <el-main style="background:#EFEFEF;height:100%;">
                    <div style="height:100%;">
                        <router-view></router-view>
                    </div>
                </el-main>
            </el-container>
        </el-container>

    </div>
</template>
<style src="./home.scss" scoped>
</style>

<script>
    import Header from "./../header/header.vue";
    import Nav from "./../nav/nav.vue";
    import http from "./../../utils/HttpClient";
    import url from "./../../baseurl/baseurl";

export default {
    components: {
        "gzhc-header": Header,
        "gzhc-nav":Nav
    },
    data() {
        return {

        }
    },
    methods: {
        handleNodeClick(data) {
            // console.log(data);
        }
    },
    mounted() {
        let token = window.localStorage.getItem('access_token')
        // console.log(token);
        let beforeNum = token.indexOf('.');
        token = token.slice(beforeNum*1+1);
        let lastNum = token.indexOf('.');
        token = token.slice(0,lastNum);
        token = token.replace('_','X')
        // console.log('token',token);
        if(!token){
            this.$router.push({name: 'login'});
        }else{
            // this.$store.commit('base64',token)
        }

        
        // console.log(this.$children)
    }
}
</script>