<template>
    <div>
        <i-form inline class="thin">
            <Form-item>
                <i-input type="text" v-model="form.name" placeholder="文件名"></i-input>
            </Form-item>
            <Form-item>
                <i-button type="primary" shape="circle" icon="ios-search" @click.native="_search()"></i-button>
            </Form-item>
        </i-form>

        <i-table :data="datas" :columns="columns" stripe class="plain"></i-table>
        <TablePage v-model="page"></TablePage>
    </div>
</template>

<script>
    import P from '@/macro/page.tpl.vue'
    import CountPanel from "C/commons/panel-count.vue"

    export default P.extend({
        components: {
            CountPanel
        },
        data () {
            return {
                columns: [
                    { title: "", type: "index", width: 60 },
                    { title: "文件名", key: "name" },
                    { title: "大小", key: "size", width: 100, sortable: true, render:(h,p)=>this.filesize(p.row.size) },
                    { title: "文件格式", key: "suffix",width: 90},
                    { title: "上传者", key: "creator", width: 100 },
                    { title: "备注", key: "remark" },
                    { title: "录入日期", key: "addDate", width: 155, sortable: true, render: (h, p) => { return h('p', D.datetime(p.row.addDate)) }},
                    {
                        title: "操作", width: 100,
                        render: (h, p) => {
                            return h('div',[
                                h('Button', {
                                    attrs: { title: "删除此资源" },
                                    props: { type: "ghost", icon: "ios-trash" },
                                    nativeOn: {
                                        click: () => this._del(p.index)
                                    }
                                }, "删除")
                            ])
                        }
                    }
                ]
            }
        },
        mounted () {
            this._api("resource")
            this._load()
        }
    })
</script>