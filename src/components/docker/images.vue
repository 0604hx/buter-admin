<!--显示docker镜像-->

<template>
    <i-table :data="datas" :columns="columns" stripe class="plain" size="small"></i-table>
</template>

<script>
    export default {
        data () {
            return {
                datas:[],
                columns:[
                    { title: "", type: "index", width: 40 },
                    { title: "名称", key: "name", sortable: true , render:(h,p)=>h('Tag', p.row.name)},
                    { title: "ID", key: "id", width: 180, sortable: true },
                    { title: "大小", key: "remark", width: 100, render:(h,p)=>this.filesize(p.row.size)},
                    { title: "Docker版本", key: "dockerVersion", width:120},
                    { title: "创建日期", key: "created", width: 250},
                ]
            }
        },
        mounted () {
            GET("docker/images",{},d=>this.datas=d)
        }
    }
</script>