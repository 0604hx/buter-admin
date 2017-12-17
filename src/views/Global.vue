<template>
    <div>
        <!--上传应用新版本-->
        <Modal class="noFooter" v-model="upload.show" title="发布新版本" :mask-closable="false" :width="800" :styles="{top: '20px'}">
            <VersionUpload ref="uploadModal" :app="upload.app"></VersionUpload>
            <div slot="footer"></div>
        </Modal>
    </div>
</template>

<script>
    import VersionUpload from 'V/application/upload.vue'

    export default {
        components: {
            VersionUpload
        },
        data () {
            return {
                upload:{
                    app:{},
                    show:false
                },
            }
        },
        methods: {
            showUpload (app){
                this.$refs['uploadModal'].reset()
                this.upload.app = app
                this.upload.show = true
            }
        },
        mounted () {
            E.$on("app.upload", this.showUpload)
        }
    }
</script>