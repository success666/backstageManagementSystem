import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state:{
        // app版本号管理 
        listAppVersion:'',
        addAppVersion:'',
        getAppVersion:'',
        deleteAppVersion:'',

        // APP用户管理s
        listAppAccount:'',
        accountMgmtExport:'',
        deleteRelation:'',

        // 在线统计
        listAppLoginLog:'',
        appLoginLogExport:'',

        // 运动记录统计                  
        sportExerciseFeedbackList:'',
        feedbackListExport:'',

        // 运动更新统计
        sportExerciseUpdateList:'',
        seUpdateListExport:'',


        // 学生关系疾病史
        listStudentRelationDiseaseHistory:'',

        // 疾病方案管理
        listDiseaseScheme:'',
        addDiseaseScheme:'',
        deleteDiseaseScheme:'',
        getDiseaseScheme:'',
        changeDiseaseSchemeOpenFlag:'',
        updateDiseaseScheme:'',

        // 运动点方案
        lietSportPoint:'',
        addSportPoint:'',
        updateSportPoint:'',
        deleteSportPoint:'',
        getSportPoint:'',

        // 营养方案管理
        listNutritionScheme:'',
        addNutritionScheme:'',
        updateNutritionScheme:'',
        deleteNutritionScheme:'',
        getNutritionScheme:'',
        changeNutritionSchemeOpenFlag:'',

        // 文章
        listArticle:'',
        addArticle:'',
        updateArticle:'',
        deleteArticle:'',
        getArticle:'',
        changeArticleOpenFlag:'',
        getArticleComment:'',
        changeArticleCommentShow:'',

        // 问题库
        listProblemLibrary:'',
        addProblemLibrary:'',
        getProblemLibrary:'',
        deleteProblemLibrary:'',
        changeProblemLibraryOpenFlag:'',
        updateProblemLibrary:'',

        // 提问管理
        listAskQuestion:'',
        getQuestionReplyList:'',
        // addAskQuestionReply:'',
        nutritionReply:'',
        sportReply:'',
        diseaseReply:'',

        // 用户管理
        listUser:'',
        getUser:'',
        addUser:'',
        updateUser:'',
        deleteUser:'',
        resetPassword:'',

        // 角色管理
        listRole:'',
        updateRole:true,
        addRole:true,

        // 更新密码
        updatePassword:'',
        Breadcrumb:''
    },
    mutations:{
        
        getRole(event,str){

            let array = str.split(',');

            let token = window.localStorage.getItem('access_token')
            // console.log(token);
            let beforeNum = token.indexOf('.');
            token = token.slice(beforeNum*1+1);
            let lastNum = token.indexOf('.');
            token = token.slice(0,lastNum);
            let reg = new RegExp( '_' , "g" )
            let regexp = new RegExp('-',"g");
            token = token.replace(reg,'/').replace(regexp,'+')

            let tokenObj
            if(!token){
                this.$router.push({name: 'login'});
            }else{
                tokenObj = decodeURIComponent(atob(token).split('').map(function(c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));
                tokenObj = JSON.parse(JSON.parse(tokenObj).sub).menus
            }

            // console.log('array',array);
            // console.log(tokenObj);
            for(let i=0;i<array.length;i++){
                // console.log(array[i]);
                for(let item of tokenObj){
                    if(item.code == array[i]){
                        this.state[array[i]] = false;
                    }
                    // console.log(item.code);
                }
            }
          
        },
        // loading
        loading(e,self) {
            const loading = self.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            setTimeout(() => {
                loading.close();
            }, 1000);
        },
      
        // 消息提示 成功 success 警告 warning 错误 error
        openSuccess(e,obj) {
            obj.self.$message({
                showClose: obj.show,
                message: obj.text,
                type: obj.type
            });
        },
        clearState(){
            // console.log(this.state)
            for(let key in this.state){
                // console.log(key);
                this.state[key] = '';
            }

            // app版本号管理 
            // this.state.listAppVersion = false
            // this.state.addAppVersion = true
            // this.state.getAppVersion = true
            // this.state.delectAppVersion = true

            // // APP用户管理
            // this.state.listAppAccount = false
            // this.state.accountMgmtExport = true
            // this.state.deleteRelation = true

            // // 在线统计
            // this.state.listAppLoginLog = false
            // this.state.appLoginLogExport = true

            // // 学生关系疾病史
            // this.state.listStudentRelationDiseaseHistory = false

            // // 疾病方案管理
            // this.state.listDiseaseScheme = false
            // this.state.addDiseaseScheme = true
            // this.state.deleteDiseaseScheme = true
            // this.state.getDiseaseScheme = true
            // this.state.changeDiseaseSchemeOpenFlag = true
            // this.state.updateDiseaseScheme = true

            // // 运动点方案
            // this.state.lietSportPoint = false
            // this.state.addSportPoint = true
            // this.state.updateSportPoint = true
            // this.state.deleteSportPoint = true
            // this.state.getSportPoint = true

            // // 营养方案管理
            // this.state.listNutritionScheme = false
            // this.state.addNutritionScheme = true
            // this.state.updateNutritionScheme = true
            // this.state.deleteNutritionScheme = true
            // this.state.getNutritionScheme = true
            // this.state.changeNutritionSchemeOpenFlag = true

            // // 文章
            // this.state.listArticle = false
            // this.state.addArticle = true
            // this.state.updateArticle = true
            // this.state.deleteArticle = true
            // this.state.getArticle = true
            // this.state.changeArticleOpenFlag = true
            // this.state.getArticleComment = true
            // this.state.changeArticleCommentShow = true

            // // 问题库
            // this.state.listProblemLibrary = false
            // this.state.addProblemLibrary = true
            // this.state.getProblemLibrary = true
            // this.state.deleteProblemLibrary = true
            // this.state.changeProblemLibraryOpenFlag = true
            // this.state.updateProblemLibrary = true

            // // 提问管理
            // this.state.listAskQuestion = false
            // this.state.getQuestionReplyList = true
            // this.state.addAskQuestionReply = true

            // // 用户管理
            // this.state.listUser = false
            // this.state.getUser = true
            // this.state.addUser = true
            // this.state.updateUser = true
            // this.state.deleteUser = true
            // this.state.resetPassword = true

            // // 角色管理
            // this.state.listRole = false
            // this.state.updateRole = true
            // this.state.addRole = true

            // // 更新密码
            // this.state.updatePassword = true
        },
        role(){
            return true;
        },
        base64(e,token){
            let tokenObj = decodeURIComponent(atob(token).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            tokenObj = JSON.parse(JSON.parse(tokenObj).sub).menus
            this.state.Breadcrumb = tokenObj;

            // for(let key of tokenObj){
            //     console.log(key.code);
            //     // app版本号管理 
            //     if(key.code == "listAppVersion"){
            //         this.state.listAppVersion = true;
            //     }else if(key.code == "addAppVersion"){
            //         this.state.addAppVersion = false;
            //     }else if(key.code == "getAppVersion"){
            //         this.state.getAppVersion = false;
            //     }else if(key.code == "deleteAppVersion"){
            //         this.state.deleteAppVersion = false;
            //     }
            //     // APP用户管理
            //     else if(key.code == "listAppAccount"){
            //         this.state.listAppAccount = true;
            //     }else if(key.code == "accountMgmtExport"){
            //         this.state.accountMgmtExport = false;
            //     }else if(key.code == "deleteRelation"){
            //         this.state.deleteRelation = false;
            //     }
            //     // 在线统计
            //     else if(key.code == "listAppLoginLog"){
            //         this.state.listAppLoginLog = true;
            //     }else if(key.code == "appLoginLogExport"){
            //         this.state.appLoginLogExport = false;
            //     }
            //     // 学生关系疾病史
            //     else if(key.code == "listStudentRelationDiseaseHistory"){
            //         this.state.listStudentRelationDiseaseHistory = true;
            //     }
            //     // 疾病方案管理
            //     else if(key.code == "listDiseaseScheme"){
            //         this.state.listDiseaseScheme = true;
            //     }else if(key.code == "addDiseaseScheme"){
            //         this.state.addDiseaseScheme = false;
            //     }else if(key.code == "deleteDiseaseScheme"){
            //         this.state.deleteDiseaseScheme = false;
            //     }else if(key.code == "getDiseaseScheme"){
            //         this.state.getDiseaseScheme = false;
            //     }else if(key.code == "changeDiseaseSchemeOpenFlag"){
            //         this.state.changeDiseaseSchemeOpenFlag = false;
            //     }else if(key.code == "updateDiseaseScheme"){
            //         this.state.updateDiseaseScheme = false;
            //     }
            //     // 运动点方案
            //     else if(key.code == "lietSportPoint"){
            //         this.state.lietSportPoint = true;
            //     }else if(key.code == "addSportPoint"){
            //         this.state.addSportPoint = false;
            //     }else if(key.code == "deleteSportPoint"){
            //         this.state.deleteSportPoint = false;
            //     }else if(key.code == "getSportPoint"){
            //         this.state.getSportPoint = false;
            //     }else if(key.code == "updateSportPoint"){
            //         this.state.updateSportPoint= false;
            //     }
            //     // 营养方案管理
            //     else if(key.code == "listNutritionScheme"){
            //         this.state.listNutritionScheme = true;
            //     }else if(key.code == "addNutritionScheme"){
            //         this.state.addNutritionScheme = false;
            //     }else if(key.code == "deleteNutritionScheme"){
            //         this.state.deleteNutritionScheme = false;
            //     }else if(key.code == "getNutritionScheme"){
            //         this.state.getNutritionScheme = false;
            //     }else if(key.code == "changeNutritionSchemeOpenFlag"){
            //         this.state.changeNutritionSchemeOpenFlag = false;
            //     }else if(key.code == "updateNutritionScheme"){
            //         this.state.updateNutritionScheme = false;
            //     }
            //     // 文章 
            //     else if(key.code == "listArticle"){
            //         this.state.listArticle = true;
            //     }else if(key.code == "addArticle"){
            //         this.state.addArticle = false;
            //     }else if(key.code == "updateArticle"){
            //         this.state.updateArticle = false;
            //     }else if(key.code == "deleteArticle"){
            //         this.state.deleteArticle = false;
            //     }else if(key.code == "getArticle"){
            //         this.state.getArticle = false;
            //     }else if(key.code == "changeArticleOpenFlag"){
            //         this.state.changeArticleOpenFlag = false;
            //     }else if(key.code == "getArticleComment"){
            //         this.state.getArticleComment = false;
            //     }else if(key.code == "changeArticleCommentShow"){
            //         this.state.changeArticleCommentShow = false;
            //     }

            //     // 问题库
            //     else if(key.code == "listProblemLibrary"){
            //         this.state.listProblemLibrary = true;
            //     }else if(key.code == "addProblemLibrary"){
            //         this.state.addProblemLibrary = false;
            //     }else if(key.code == "getProblemLibrary"){
            //         this.state.getProblemLibrary = false;
            //     }else if(key.code == "deleteProblemLibrary"){
            //         this.state.deleteProblemLibrary = false;
            //     }else if(key.code == "changeProblemLibraryOpenFlag"){
            //         this.state.changeProblemLibraryOpenFlag = false;
            //     }else if(key.code == "updateProblemLibrary"){
            //         this.state.updateProblemLibrary = false;
            //     }

            //     // 提问管理
            //     else if(key.code == "listAskQuestion"){
            //         this.state.listAskQuestion = true;
            //     }else if(key.code == "getQuestionReplyList"){
            //         this.state.getQuestionReplyList = false;
            //     }else if(key.code == "addAskQuestionReply"){
            //         this.state.addAskQuestionReply = false;
            //     }


            //     // 用户管理 
            //     else if(key.code == "listUser"){
            //         this.state.listUser = true;
            //     }else if(key.code == "addUser"){
            //         this.state.addUser = false;
            //     }else if(key.code == "updateUser"){
            //         this.state.updateUser = false;
            //     }else if(key.code == "getUser"){
            //         this.state.getUser = false;
            //     }else if(key.code == "deleteUser"){
            //         this.state.deleteUser = false;
            //     }else if(key.code == "resetPassword"){
            //         this.state.resetPassword = false;
            //     }
                
            //     // 角色管理
            //     else if(key.code == 'listRole'){
            //         this.state.listRole = true;
            //     }else if(key.code == 'updateRole'){
            //         this.state.updateRole = false;
            //     }else if(key.code == 'addRole'){
            //         this.state.addRole = false;
            //     }

            //     // 更新密码
            //     else if(key.code == "updatePassword"){
            //         this.state.updatePassword = false;
            //     }
            // }
        }
    },
    actions:{
       
    }
})

export default store;