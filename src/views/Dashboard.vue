<!--首页总览-->
<style></style>

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
        </Card>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                info:{}
            }
        },
        mounted () {
            GET("/info",{}, d=>this.info = d)
        }
    }
</script>