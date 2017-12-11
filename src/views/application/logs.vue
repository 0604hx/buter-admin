<!--显示docker容器日志-->
<template>
    <Modal
        class="p0"
        v-model="show"
        :mask-closable="true"
        width="95%"
        :title="app+' 应用日志'"
        >
        <codemirror :value="logs" :options="options"></codemirror>
    </Modal>
</template>

<script>
    import { codemirror } from 'vue-codemirror-lite'

    export default {
        components: {
            codemirror
        },
        data () {
            return {
                app:"",
                show:false,
                logs:"",
                options:{
                    readOnly:true,
                    tabSize: 2,
                    lineNumbers: true,
                    lineWrapping: true
                }
            }
        },
        methods: {
            open(n){
                this.show = true
                this.logs = ""
                if(!!n) this.app = n
                else    return M.warn("请先选择应用")
                this.loadLogs()
            },
            loadLogs(){
                GET("docker/logs/"+this.app,{}, d=>this.logs=d)
            }
        }
    }
</script>