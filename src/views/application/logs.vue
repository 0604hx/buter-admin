<!--显示docker容器日志-->
<template>
    <Modal
        class="p0"
        v-model="show"
        :mask-closable="true"
        width="95%"
        :title="app+' 应用日志'"
        >
        <div class="mt8">
            显示行数：<InputNumber :max="100000" :min="1" v-model="tail" :step="200" @on-change="loadLogs"></InputNumber>
            <span class="h ml10">默认每次只显示 1000 行日志，最大支持 100,000 行</span>
        </div>

        <div style="border-top:1px solid #e9eaec" class="mt8">
            <codemirror :value="logs" :options="options"></codemirror>
        </div>
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
                tail:1000,
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
                POST("docker/logs/"+this.app,{tail:this.tail}, d=>this.logs=d)
            }
        }
    }
</script>