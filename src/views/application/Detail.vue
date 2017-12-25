<!--应用详情页面，支持子路由-->
<template>
    <div>
        <Card v-if="app" class="appInfoD">
            <h1 slot="title">
                <Icon type="social-windows"></Icon> 
                {{app.name}}
                <AppStatus :stat="app.stat"></AppStatus>
            </h1>
            <AppControl slot="extra" :value="app"></AppControl>
        
            <div v-html="app.remark"></div>
        </Card>
        <Alert v-if="fail" type="error" show-icon>
            无法加载应用信息
            <span slot="desc">
                可能的原因：{{!!id? "ID="+id+" 的应用不存在":"无效的应用 ID"}}
            </span>
        </Alert>

        <Tabs class="detailTab" @on-click="tabClick" :value="tab">
            <TabPane name="fs" label="文件管理" icon="ios-folder-outline"></TabPane>
            <TabPane name="monitor" label="状态监控" icon="ios-analytics"></TabPane>
        </Tabs>

        <transition>
            <router-view></router-view>
        </transition>
    </div>
</template>

<style>
    .appInfoD .ivu-card-extra {top:12px}
    .detailTab .ivu-tabs-bar {margin-bottom: 0px}
</style>

<script>
    import AppControl from 'C/app/control.vue'
    import AppStatus from 'C/app/status.vue'

    export default {
        components: {
            AppControl, AppStatus
        },
        data () {
            return {
                tab:"fs",
                name:null,
                app:null,
                stat:false,
                fail:false
            }
        },
        methods: {
            loadAndEmit (d){
                if(!!d)
                    window.APP = d
                this.app = window.APP
                E.$emit("app.loaded")
                //默认打开文件系统
                if(this.$route.name=='detail'){
                    this.$router.replace(`/detail/${this.name}/fs`)
                }
            },
            load(){
                if(!this.name)   return this.fail = true

                GET("/app/name/"+this.name,{},d=>{
                    if(!d || !d.id) return this.fail = true

                    this.loadAndEmit(d)
                    
                    RESULT("app/stats",{names:d.name},dd=>{
                        let stats = dd.data
                        this.$set(this.app, 'stat', stats[d.name])
                    })
                })
            },
            tabClick(name){
                return this.tabChange(name) && this.$router.push(`/detail/${this.name}/${name}`)
            },
            tabChange(name){
                return this.tab != name && (this.tab = name)
            }
        },
        mounted () {
            this.name = this.$route.params['name']
            console.log("APP NAME=", this.name)

            //优先考虑全局 APP 变量，如果没有则远程加载
            if(!!window.APP && window.APP.id)
                this.loadAndEmit()
            else
                this.load()

            E.$on("app.detail.tab", this.tabChange)
        },
        destroyed () {
            E.$off("app.detail.tab", this.tabChange)
        }
    }
</script>