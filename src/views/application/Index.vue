<template>
    <div>
        <i-form inline class="thin">
            <Form-item>
                <i-input type="text" v-model="form.name" placeholder="应用名称"></i-input>
            </Form-item>
            <Form-item>
                <i-button type="primary" shape="circle" icon="ios-search" @click.native="_search()"></i-button>
            </Form-item>
        </i-form>

        <i-table :data="datas" :columns="columns" stripe></i-table>
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

        <LogModal ref="logModal"></LogModal>
    </div>
</template>

<style>
    .menuBtn {
        padding: 6px 8px;
    }
</style>

<script>
    import P from '@/macro/page.tpl.vue'
    import LogModal from './logs.vue'
    import AppControl from 'C/app/control.vue'

    import A from 'S/Application'

    export default P.extend({
        components: {
            "CountPanel":require("C/commons/panel-count.vue").default,
            LogModal, AppControl
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
                    { 
                        title: "应用名", key: "name", width: 120, sortable: true , 
                        render:(h,p)=>{
                            return h('a', {
                                attrs:{title:"点击打开应用详情"},
                                on: {
                                    click: () => this.$router.push(`/detail/${p.row.name}`)
                                }
                            }, p.row.name)
                        }
                    },
                    { title: "版本", key: "version", width: 120, sortable: true },
                    { title: "备注信息", key: "remark" },
                    { title: "录入日期", key: "addDate", width: 155, sortable: true, render: (h, p) => { return h('p', D.datetime(p.row.addDate)) } },
                    { 
                        title: "状态", key: "stat", width:100, 
                        render: (h, p)=>{
                            let s = window.C.stats[p.row.stat]
                            return !s? '' : h(
                                'Tag',
                                {
                                    attrs:{
                                        title: s.summary, 
                                        color:p.row.stat==-1?"default":p.row.stat==0?"yellow":"green"
                                    },
                                }, 
                                s.text
                            )
                        } 
                    },
                    {
                        title: "操作", width: 230,
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
                                        click: () => this._add("name")
                                    }
                                })
                            ])
                        },
                        render: (h, p) => {
                            let stat = p.row.stat
                            return h('div',[
                                h(AppControl,{
                                    props:{value:p.row}
                                }),
                                // h('ButtonGroup', [
                                //     h('Button', {
                                //         attrs: { title: "发布新版本"},
                                //         props: { type: "ghost", icon: "upload"},
                                //         nativeOn: {
                                //             click: () => this.showUpload(p.index)
                                //         }
                                //     }),
                                //     h('Button', {
                                //         class:stat==0?"success":"",
                                //         attrs: { title: "启动此应用" },
                                //         props: { type: "ghost", icon: "play", disabled: stat!='0'},
                                //         nativeOn: {
                                //             click: () => this.operate(p.index,'start')
                                //         }
                                //     }),
                                //     h('Button', {
                                //         class: stat==1?"error":"",
                                //         attrs: { title: "停止此应用" },
                                //         props: { type: "ghost", icon: "stop", disabled: stat!=1},
                                //         nativeOn: {
                                //             click: () => this.operate(p.index,'stop')
                                //         }
                                //     }),
                                //     h('Button', {
                                //         class:stat>=0?"warning":"",
                                //         attrs: { title: "重新启动此应用" },
                                //         props: { type: "ghost", icon: "android-refresh", disabled: stat!=0 && stat!=1},
                                //         nativeOn: {
                                //             click: () => this.operate(p.index,'restart')
                                //         }
                                //     }),
                                // ]),
                                h(
                                    'Dropdown',
                                    {
                                        props:{placement:"bottom-end",trigger:"click"}
                                    },
                                    [
                                        h('Button',{
                                            class:'menuBtn',
                                            attrs: {title:"点击展开更多菜单"},
                                            props:{type:"ghost",icon:'arrow-down-b'}
                                        }),
                                        h('Dropdown-menu',
                                            {slot:"list"},
                                            [
                                                h('Dropdown-item',{
                                                    nativeOn: {
                                                        click: ()=>this._edit(p.index)
                                                    }
                                                },"编辑"),
                                                h('Dropdown-item',{
                                                    nativeOn: {
                                                        click: ()=>this.logs(p.index)
                                                    }
                                                },"操作日志"),
                                                h('Dropdown-item',{
                                                    class:'warning',
                                                    props:{divided:true},
                                                    nativeOn: {
                                                        click: ()=>this.operate(p.row,'delete')
                                                    }
                                                },[h('Icon', {props:{type:"cube", size:14}})," 删除容器"]),
                                                h('Dropdown-item',{
                                                    class:'warning',
                                                    nativeOn: {
                                                        click: ()=>this.clean(p.index)
                                                    }
                                                },[h('Icon', {props:{type:"ios-close-outline", size:14}})," 清空应用数据"]),
                                                h('Dropdown-item',{
                                                    class:'error',
                                                    props:{divided:true},
                                                    nativeOn: {
                                                        click: ()=>this._del(p.index)
                                                    }
                                                },[h('Icon', {props:{type:"ios-trash-outline", size:14}})," 删除此应用"]),
                                            ]
                                        )
                                    ]
                                )
                            ])
                        }
                    }
                ]
            }
        },
        methods: {
            operate (app,op){
                A.operate(app.name, op, stat=>app.stat=stat)
            },
            clean (index){
                let app = this.datas[index]
                M.confirm("清空数据","清空应用数据将会移除整个应用目录（可能包括应用相关的 日志、附件、配置文件 等），确定吗？",()=>{
                    RESULT(`app/clean/${app.id}`,{},d=>M.notice.ok(`应用 ${app.name} 数据清空成功`))
                })
            },
            logs(index){
                let app = this.datas[index]
                this.$refs['logModal'].open(app.name)
            },
            showUpload (index){
                E.$emit("app.upload", index>=0?this.datas[index]:{id:0,name:"",version:""})
            },
            /**
             * 数据加载完成后，读取应用的状态信息
             */ 
            onPageLoaded (){
                RESULT("app/stats",{names:this.datas.map(v=>v.name).join(",")},d=>{
                    let stats = d.data
                    this.datas.forEach((v,i)=>this._updateIndex(i, {stat:stats[v.name]}))
                })
            }
        },
        mounted () {
            this._api("app")
            this._load()
        }
    })
</script>