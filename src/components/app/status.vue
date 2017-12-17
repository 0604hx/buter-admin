<template>
    <Tag v-if="status" :title="status.summary" :color="color" v-text="status.text"></Tag>
</template>

<script>
    export default {
        props: ['stat'],
        data () {
            return {
                status:null
            }
        },
        computed: {
            color(){
                return this.stat==-1?"default":this.stat==0?"yellow":"green"
            }  
        },
        watch: {
            stat (v){
                this.status = window.C.stats[this.stat]
            }
        }
    }
</script>