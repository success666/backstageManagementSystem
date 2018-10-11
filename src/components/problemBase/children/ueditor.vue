<template>
  <div>
    <!--<p>富文本编辑器</p>-->
    <script :id=id type="text/plain"></script>
  </div>
</template>

<script>
  import '../../../../static/UE/themes/default/css/ueditor.css'
  import '../../../../static/UE/ueditor.config.js'
  import '../../../../static/UE/ueditor.all'
  import '../../../../static/UE/lang/zh-cn/zh-cn'
  import '../../../../static/UE/ueditor.parse.min'
 

  export default {
    data() {
      return {
        editor: null
      }
    },
    props: {
      content: {
        type: String,
        default: ''
      },
      config: {
        type: Object
      },
      id: {
        type: String
      }
    },
    mounted() {
      const _this = this;
      // _this.editor = UE.getEditor(_this.id, _this.config); // 初始化UE
      // _this.editor.addListener("ready", function () {
      //   _this.editor.setContent(_this.content); // 确保UE加载完成后，放入内容。
      // })
      function runAsync1(){
          var p = new Promise(function(resolve, reject){
             
              _this.editor = UE.getEditor(_this.id, _this.config)// 初始化UE
              setTimeout(function(){
                  resolve('数据1');
              },1000);
          });
          return p;            
      }
      function runAsync2(){
          var p = new Promise(function(resolve, reject){
            setTimeout(function(){
                  resolve('123');
                  _this.editor.setContent(_this.content) //插入内容
              },200);
          });
          return p;            
      }
      runAsync1().then(function(data){return runAsync2();})
    },
    methods: {
      getContent() { // 获取内容方法
        return this.editor.getContent()
      }
    },
    destroyed() {
      this.editor.destroy()
    }
  }
</script>

<style scoped>

</style>
