<!--文件系统-->
<template>
    <div>容器运行状态监控，功能正在开发中，敬请期待...</div>
</template>

<script>
    export default {
        data () {
            return {
                id:0
            }
        },
        methods: {
            
        },
        mounted () {
            let id = this.$route.params['id']
            this.id = !!id ? id : 0

            console.log("FS id=", this.id)
            E.$emit("app.detail.tab", "monitor")
        },
        destroyed () {
        }
    }
</script>