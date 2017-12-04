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
        <table-page v-model="page"></table-page>

        <Modal v-model="addModal.show" title="编辑任务" :loading="addModal.work" @on-ok="_addDo">
            <div>
                <i-form ref="entity" :model="entity" :label-width="70" class="thin">
                    <Form-item label="应用名">
                        <i-input ref="taskName" autofocus v-model="entity.name" placeholder="应用名称或者代号"></i-input>
                    </Form-item>
                    <Form-item prop="summary" label="描述">
                        <i-input ref="taskSummary" type="text" :rows="2" v-model="entity.summary" placeholder="简要说明"></i-input>
                    </Form-item>
                </i-form>
            </div>
        </Modal>
    </div>
</template>


<script>
    import P from '@/macro/page.tpl.vue'

    export default P.extend({
        components: {
        },
        data () {
            return {
                columns: [
                    { title: "", type: "index", width: 40 },
                    { title: "应用名", key: "name", width: 120, sortable: true },
                    { title: "版本", key: "version", width: 120, sortable: true },
                    { title: "备注信息", key: "remark" },
                    { title: "录入日期", key: "addDate", width: 105, sortable: true, render: (h, p) => { return h('p', D.date(p.row.addDate)) } },
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
                                            this._add()
                                             setTimeout(()=>{
                                                this.$refs['loginName'].$el.querySelector(':scope > input').focus()
                                            }, 500)
                                        }
                                    }
                                })
                            ])
                        },
                        render: (h, p) => {
                            return h('ButtonGroup', [
                                h('Button', {
                                    attrs: { title: "编辑", disabled: this.datas[p.index].id === window.ACCOUNT.id },
                                    props: { type: "ghost", icon: "edit"},
                                    nativeOn: {
                                        click: () => {
                                            this._edit(p.index)
                                        }
                                    }
                                }),
                                h('Button', {
                                    attrs: { title: "修改密码" },
                                    props: { type: "ghost", icon: "ios-locked" },
                                    nativeOn: {
                                        click: () => {
                                            this.pwd.value = ""
                                            this.pwd.index = p.index
                                            this.pwd.show = true
                                        }
                                    }
                                }),
                                h('Button', {
                                    attrs: { title: "删除此业务员", disabled: this.datas[p.index].id === window.ACCOUNT.id },
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
        mounted () {
            this._api("app")
            this._load()
        }
    })
</script>