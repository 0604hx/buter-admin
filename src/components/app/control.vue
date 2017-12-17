<!--应用操作面板-->
<template>
    <ButtonGroup>
        <Button title="发布新版本" type="ghost" icon="upload" @click="upload()"></Button>
        <Button title="启动此应用" :class="{success:value.stat==0}" :disabled="value.stat!='0'" type="ghost" icon="play" @click="operate('start')"></Button>
        <Button title="停止此应用" :class="{error:value.stat==1}" :disabled="value.stat!=1" type="ghost" icon="stop" @click="operate('stop')"></Button>
        <Button title="重新启动此应用" :class="{warning:value.stat>=0}" :disabled="value.stat!=0 && value.stat!=1" type="ghost" icon="android-refresh" @click="operate('restart')"></Button>
    </ButtonGroup>
</template>

<script>
    import A from 'S/Application'

    export default {
        name:"AppControl",
        props: ['value'],
        methods: {
            /**
             * 操作容器
             * op=start     启动
             * op=stop      停止
             * op=restart   重启
             * op=delete    删除容器（并不会删除应用记录）
             */ 
            operate(op){
                A.operate(this.value.name, op, stat=>this.value.stat=stat)
            },
            upload (){
                E.$emit("app.upload", this.value)
            },
        },
        mounted () {
        }
    }
</script>