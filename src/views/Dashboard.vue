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
                <div v-for="(f,i) in info">
                    <Tag color="green">{{i}}</Tag>
                    
                    <Tag v-for="(k,v) in f">{{v +" = "+k}}</Tag>
                </div>
            </div>
            <Spin v-if="infoLoading" fix>
                <Icon type="load-c" size=18 class="loading"></Icon>
                <div>数据加载中...</div>
            </Spin>
        </Card>
    </div>
</template>

<script>
    export default {
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