<template>
    <i-form :label-width="80" class="thin">
        <Form-item label="应用名">
            <i-input ref="name" v-model="app.name" :disabled="!!app.id && app.id>0" placeholder="应用名称或者代号"></i-input>
        </Form-item>
        <Form-item label="版本号">
            <i-input v-model="app.version" placeholder="默认版本号为1.0.0"></i-input>
        </Form-item>
        <Form-item label="部署模式">
            <RadioGroup v-model="category">
                <Radio label="0">全新部署</Radio>
                <Radio label="1">迭代更新</Radio>
            </RadioGroup>
            <span class="h" v-text="tips[category]"></span>
        </Form-item>

        <Form-item label="上传文件">
            <div style="line-height:1rem">
                <Upload
                    ref="upload"
                    :max-size="1048576"
                    :before-upload="beforeUpload"
                    :on-success="onUploadSuccess"
                    :on-error="onUploadError"
                    type="drag"
                    accept=".zip"
                    :data="app"
                    action="app/upload">
                    <div style="padding-top: 20px; cursor:pointer ">
                        <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                        <div v-if="file" class="l p10" style="border-top:1px dashed #dedede;">
                            <div>文件名称：{{file.name}}</div>
                            <div>文件大小：{{filesize(file.size)}}   <b class="ml10 warning">({{file.type}})</b></div>
                            <div>最后修改：{{datetime(file.lastModified)}}</div>
                        </div>
                        <p v-else class="h">点击或将 ZIP 文件拖拽到这里上传
                            <br><br>
                            <span style="color:red; font-weight:bold;">
                                注意：仅支持 zip 文件，文件大小不超过 1 GB
                                <br>
                                上传期间请勿切换到其他页面或关闭当前页面
                            </span>
                        </p>
                    </div>
                </Upload>
                <Button long type="primary" :loading="uploading" @click.native="uploadDo">上传数据文件</Button>
            </div>
        </Form-item>
    </i-form>
</template>

<script>
    export default {
        props: ["app"],
        data () {
            return {
                uploading:false,
                file:null,
                category:1,
                tips:['上传完整的应用包，部署过程中会删除同名的容器','上传并覆盖旧文件（此模式不会创建新容器）']
            }
        },
        methods: {
            reset(){
                this.file = null
                this.$refs['upload'].clearFiles()
                this.category = 1
            },
            uploadDo (){
                console.log(this.app)
                if(!!this.uploading)    return M.warn("文件正在上传中，请耐心等待...")
                if(!!this.file){
                    this.uploading = true
                    this.$refs['upload'].post(this.file)
                }
                else
                    M.warn("请先选择文件")
            },
            onUploadSuccess (resp,file,fileList){
                this.uploading = false
                console.log(resp)
                if(resp.success === true){
                    let fileInfo = resp.data.map(v=>`<div>${v}</div>`)
                    M.notice.ok("新版本上传成功："+resp.message+". 处理以下文件："+fileInfo)

                    this.file = null
                    this.$emit("upload-done", resp)
                }else{
                    M.notice.error(resp.message+(file.size==0?"（检测到你上传的文件内容为空，系统不支持空文件上传哦）":""),"文件上传失败")
                }
            },
            onUploadError (err,resp,fileList){
                console.log(resp)
                this.uploading = false
                if(err.status===511){
                    M.notice.error("服务端拒绝本次请求，请检查您是否已登录（若已登录尝试刷新当前页面后重试）","上传失败")
                }
                else
                    M.notice.error(resp.message,"上传失败,响应码 "+err.status)
            },
            beforeUpload (f){
                this.file = f
                return false
            }
        },
        watch: {
            category (v){
                this.app.update = v==1
            }
        }
    }
</script>