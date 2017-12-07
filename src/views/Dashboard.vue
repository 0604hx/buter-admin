<!--首页总览-->
<style>
</style>

<template>
    <div>
        <Card>
            <p slot="title">
                <Icon type="ios-film-outline" class="mr10"></Icon>系统信息
            </p>
            <div style="font-family:consolas">
                <div v-for="(f,i) in info" :key="i">
                    <Tag color="green">{{i}}</Tag>
                    
                    <Tag v-for="(k,v) in f" :key="v">{{v +" = "+k}}</Tag>
                </div>
            </div>
            <Spin v-if="infoLoading" fix>
                <Icon type="load-c" size=18 class="loading"></Icon>
                <div>数据加载中...</div>
            </Spin>
        </Card>

        <Card class="mt10 p0">
            <p slot="title">
                <Icon type="ios-camera-outline" class="mr10"></Icon>已安装镜像
            </p>
            <DockerImages></DockerImages>
        </Card>
    </div>
</template>

<script>
    import DockerImages from "C/docker/images.vue"

    export default {
        components: {
            DockerImages  
        },
        data () {
            return {
                info:{},
                infoLoading:true
            }
        },
        mounted () {
            GET("/info",{}, d=>{
                this.info = d
                this.infoLoading = false
            },()=>{
                this.infoLoading = false
            })
        }
    }
</script>