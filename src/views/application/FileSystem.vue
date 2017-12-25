<!--文件系统-->
<template>
    <Row :gutter="12">
        <Col class="p5" span="4" style="overflow:hidden">
            <Card style="overflow-x: auto;">
                <Tree :data="files" :load-data="loadChild" :render="renderNode" @on-select-change="onSelect"></Tree>
            </Card>
        </Col>
        <Col span="20">
            <Row style="padding:6px 0px 6px; border-bottom:1px solid #dddee1">
                <Col span="16">
                    当前选择：{{curFile}}
                </Col>
                <Col span="8" class="r">
                    <ButtonGroup size="small">
                        <Button type="ghost" @click="refresh" title="刷新整个文件树并清空当前选择">刷新</Button>

                        <Button title="先选择需要目标文件夹" type="ghost"
                            :disabled="canUpload" @click="toUpload">
                            上传新文件
                        </Button>

                        <Button title="先选择需要编辑的文件，然后执行删除操作" type="error"
                            :disabled="!curFile" @click="del">
                            删除
                        </Button>

                        <Button title="先选择需要编辑的文件，然后保存内容" type="success"
                            :disabled="canSave" @click="save">
                            保存修改
                        </Button>
                    </ButtonGroup>
                </Col>
            </Row>
            <div>
                <codemirror v-model="content" :options="options"></codemirror>
            </div>
        </Col>

        <Modal
            class="noFooter"
            v-model="upload.show"
            :mask-closable="true"
            width="600"
            title="上传新文件"
            >
            <Alert>文件上传到：/{{curFile}} <span class="info" v-if="curFile==''">（应用根目录）</span></Alert>

            <Upload
                ref="upload"
                :max-size="1048576"
                :before-upload="beforeUpload"
                :on-success="onUploadSuccess"
                :on-error="onUploadError"
                type="drag"
                :data="uploadData"
                :action="action">
                
                <div style="padding-top: 20px; cursor:pointer ">
                    <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                    <div v-if="upload.file" class="l p10" style="border-top:1px dashed #dedede;">
                        <div>文件名称：{{upload.file.name}}</div>
                        <div>文件大小：{{filesize(upload.file.size)}}   <b class="ml10 warning">({{upload.file.type}})</b></div>
                        <div>最后修改：{{datetime(upload.file.lastModified)}}</div>
                    </div>
                    <p v-else class="h">点击或将 ZIP 文件拖拽到这里上传
                        <br><br>
                        <span style="color:red; font-weight:bold;">
                            建议文件大小不超过 100 Mb
                            <br>
                            上传期间请勿切换到其他页面或关闭当前页面
                        </span>
                    </p>
                </div>
            </Upload>
            <Button long type="primary" :loading="upload.working" @click.native="uploadDo">上传数据文件</Button>
        </Modal>
    </Row>
</template>

<script>
    import { codemirror } from 'vue-codemirror-lite'
    
    export default {
        components: {
            codemirror
        },
        data () {
            return {
                name:"",
                files:[],
                curFile:"",    //当前编辑的文件
                isFile:false,  //当前选择的是否为文件
                content:"",
                originContent:"",
                node:null,
                root:null,
                options: window.C.getCodeOptions(),

                upload:{
                    show:false,
                    file:null,
                    working:false
                }
            }
        },
        methods: {
            renderNode (h, { root, node, data }) {
                return h('span',{
                    attrs:{title:data.title},
                    style:"cursor:pointer",
                    on: {
                        click: ()=>this.onSelect(data, node, root)
                    }
                },[
                    h('Icon', {
                        props: {
                            type: data.file?'ios-paper-outline':'ios-folder-outline'
                        },
                        style: {marginRight: '8px'}
                    }),
                    h('span', data.title)
                ])
            },
            refresh(){
                //if(this.isFile) return M.warn("文件无法刷新")
                
                this.load("",d=>{
                    this.curFile = ""
                    this.isFile = false
                    this.updateContent()

                    this.files=d
                })
            },
            load (loc, cb){
                POST("/app/fs/"+this.name,{location: loc},d=>{
                    if(d.success===true)
                        cb(d.data.sort(v=>v.file).map((v,k)=>{
                            let f={title:v.name, path:v.path, file:v.file}
                            if(v.file==false){
                                f.children = []
                                f.loading = false
                            }
                            return f
                        }))
                },()=>{
                    M.warn("无法获取目录信息，可能该应用没有文件")
                    return true
                })
            },
            loadChild (item, cb){
                this.load(this.getLocation(item.path), cb)
            },
            onSelect(data, node, root) {
                let newF = this.getLocation(data.path)
                if(newF == this.curFile)    return
                this.curFile = newF
                this.isFile = data.file

                this.node = node
                this.root = root
                
                if(data.file)
                    RESULT("app/fs/content/"+this.name,{location: this.curFile},d=>this.updateContent(d.data))
                else{
                    this.updateContent()
                }
            },
            //更新文件内容
            save (){
                M.confirm("更新文件内容", `确定更新 ${this.curFile} 的内容吗？请慎重操作`,()=>{
                    RESULT("app/fs/update/"+this.name, {location: this.curFile, content:this.content}, d=>{
                        M.notice.ok(`${this.curFile} 内容保存成功`)
                        this.updateOriginContent()
                    })
                })
            },
            del (){
                M.confirm("删除 "+this.curFile, `确定删除吗？ 此操作不可逆！`,()=>{
                    RESULT("app/fs/update/"+this.name, {location: this.curFile, del:1}, d=>{
                        M.notice.ok(`${this.curFile} 删除成功`)
                        
                        this.refresh()
                    })
                })
            },
            updateContent(data=""){
                this.content = data
                this.updateOriginContent()
            },
            updateOriginContent (){
                this.originContent = JSON.parse(JSON.stringify(this.content))
            },  
            //截取应用名后面的路径
            getLocation(path){
                return path.substr(path.indexOf(this.name)+this.name.length+1)
            },
            /*
            ----------------------- START 文件上传开始 ------------------------
            */
            toUpload (){
                this.upload.file = null
                this.upload.show = true
            },
            uploadDo (){
                if(!!this.upload.working)    return M.warn("文件正在上传中，请耐心等待...")
                if(!!this.upload.file){
                    this.upload.working = true
                    this.$refs['upload'].post(this.upload.file)
                }
                else
                    M.warn("请先选择文件")
            },
            onUploadSuccess (resp,file,fileList){
                this.upload.working = false
                if(resp.success === true){
                    M.notice.ok("文件上传成功")

                    this.upload.file = null
                }else{
                    M.notice.error(resp.message+(file.size==0?"（检测到你上传的文件内容为空，系统不支持空文件上传哦）":""),"文件上传失败")
                }
            },
            onUploadError (err,resp,fileList){
                this.upload.working = false
                if(err.status===511){
                    M.notice.error("服务端拒绝本次请求，请检查您是否已登录（若已登录尝试刷新当前页面后重试）","上传失败")
                }
                else
                    M.notice.error(resp.message,"上传失败,响应码 "+err.status)
            },
            beforeUpload (f){
                this.upload.file = f
                return false
            }
            /*
            ----------------------- END 文件上传开始 ------------------------
            */
        },
        computed: {
            canUpload(){
                return !this.curFile=='' && this.isFile
            },
            canSave(){
                return !this.curFile || this.content==this.originContent
            },
            action(){
                return "app/fs/upload/"+this.name
            },
            uploadData(){
                return {
                    location: this.curFile
                }
                // return {}
            }
        },
        mounted () {
            this.name = this.$route.params['name']

            this.load("",d=>this.files=d)

            E.$emit("app.detail.tab", "fs")
        }
    }
</script>