<template>
    <div>
        <i-form inline class="thin">
            <Form-item>
                <i-input type="text" v-model="form.s_LIKE_name" placeholder="应用名称"></i-input>
            </Form-item>
            <Form-item>
                <i-button type="primary" shape="circle" icon="ios-search" @click.native="_search()"></i-button>
            </Form-item>
        </i-form>

        <i-table :data="datas" :columns="columns" stripe class="plain"></i-table>
        <TablePage v-model="page"></TablePage>

        <Modal v-model="addModal.show" title="编辑任务" :loading="addModal.work" @on-ok="_addDo">
            <div>
                <i-form ref="entity" :model="entity" :label-width="70" class="thin">
                    <Form-item label="应用名">
                        <i-input ref="name" v-model="entity.name" placeholder="应用名称或者代号"></i-input>
                    </Form-item>
                    <Form-item label="版本号">
                        <i-input v-model="entity.version" placeholder="默认版本号为1.0.0"></i-input>
                    </Form-item>
                    <Form-item label="描述">
                        <i-input type="textarea" :rows="4" v-model="entity.remark" placeholder="简要说明"></i-input>
                    </Form-item>
                </i-form>
            </div>
        </Modal>


        <Modal class="noFooter" v-model="upload.show" title="发布新版本" :mask-closable="false" :width="800">
            <VersionUpload ref="uploadModal" :app="upload.app"></VersionUpload>
            <div slot="footer">
            </div>
        </Modal>
    </div>
</template>


<script>
    import P from '@/macro/page.tpl.vue'
    import VersionUpload from './upload.vue'

    export default P.extend({
        components: {
            "CountPanel":require("C/commons/panel-count.vue").default,
            VersionUpload
        },
        data () {
            return {
                upload:{
                    app:{},
                    show:false
                },
                autoFocus:"name",
                columns: [
                    { title: "", type: "index", width: 40 },
                    { title: "应用名", key: "name", width: 120, sortable: true },
                    { title: "版本", key: "version", width: 120, sortable: true },
                    { title: "备注信息", key: "remark" },
                    { title: "录入日期", key: "addDate", width: 155, sortable: true, render: (h, p) => { return h('p', D.datetime(p.row.addDate)) } },
                    {
                        title: "操作", width: 180,
                        renderHeader: (h, p) => {
                            return h('div', [
                                h('span', "操作"),
                                h('Button', {
                                    'class': {
                                        ml10: true,
                                    },
                                    attrs: { title: "新增业务员" },
                                    props: { size: "small", type: "ghost", shape: "circle", icon: "ios-plus-empty" },
                                    nativeOn: {
                                        click: () => {
                                            this._add("name")
                                        }
                                    }
                                })
                            ])
                        },
                        render: (h, p) => {
                            return h('ButtonGroup', [
                                h('Button', {
                                    attrs: { title: "编辑" },
                                    props: { type: "ghost", icon: "compose"},
                                    nativeOn: {
                                        click: () => {
                                            this._edit(p.index)
                                        }
                                    }
                                }),
                                h('Button', {
                                    attrs: { title: "发布新版本" },
                                    props: { type: "ghost", icon: "upload" },
                                    nativeOn: {
                                        click: () => {
                                            this.showUpload(p.index)
                                        }
                                    }
                                }),
                                h('Button', {
                                    attrs: { title: "删除此应用"},
                                    props: { type: "error", icon: "ios-trash" },
                                    nativeOn: {
                                        click: () => {
                                            this._del(p.index)
                                        }
                                    }
                                })
                            ])
                        }
                    }
                ]
            }
        },
        methods: {
            showUpload (index){
                this.$refs['uploadModal'].reset()
                this.upload.app = index>=0?this.datas[index]:{id:0,name:"",version:""}
                this.upload.show = true
            }
        },
        mounted () {
            this._api("app")
            this._load()
        }
    })
</script>