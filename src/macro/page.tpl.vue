<!--分页查询模板-->
<script>
    import Vue from 'vue';
    import TablePage from './table.page.vue'

    export default Vue.extend({
        components:{
            TablePage
        },
        data(){
            return{
                datas:[],
                form:{},
                entity:{},            //录入的实体
                addModal:{show:false,work:true},  //编辑对象的对话框
                page:{
                    current:1,
                    pageSize:20,
                    pageSizes:[20,50,100,200],
                    max:1,
                    total:1,
                    params:{},
                    info:""
                },
                selectIds:[],
                columns:[{title:"请自定义columns！"}],
                autoFocus:null  //当打开编辑对话框时，默认获取到焦点的 input 控件
            }
        },
        methods:{
            /**
             * 生成请求路径
             */
            _url (path){
                return (this.api.root || '')+path
            },
            /**
             * 初始化API路径
             * @param path    如果传递的是string，则自动构建
             * @private
             */
            _api (path){
                const suffix=window.apiSuffix||"";
                if(typeof(path)==='string'){
                    const a = {
                        root:path,
                        get:path+"/#id#",     //获取指定id的对象数据，#id#会被替换成真实的id
                        list:path+"/list"+suffix,
                        del:path+"/delete"+suffix,
                        add:path+"/add"+suffix,
                        addDo:path+"/add"+suffix,
                        edit:path+"/edit"+suffix,
                        editDo:path+"/edit"+suffix
                    }
                    this.api = a
                }else
                    this.api = path
            },
            _pageSize (ps){
                this.page.pageSize = ps;
            },
            /**
             * 设置默认的请求参数
             */
            _addParams (k,v){
                typeof(k)==='object'?Object.assign(this.page.params,k):this.page.params[k]=v
            },
            _checkApi (){
                if(!this.api) throw new Error("请先设置$scope的api属性，此属性用于数据交互");
            },
            /**
             * 请求数据前对参数的处理
             */
            _formBeforeLoad (){
                return this.form
            },
            /**
             * 加载数据
             * @param p   页数
             * @param ps  查询参数
             * @private
             */
            _load (p,ps){
                this._checkApi()
                const startT =(new Date()).getTime()          //记录开始时间戳
                this.page.current = p || this.page.current    //计算当前页
                const M=this
                POST(
                    this.api.list,
                    Object.assign({page:M.page.current, pageSize:M.page.pageSize},M.page.params,this._formBeforeLoad(),ps||{}),
                    (d)=>{
                        M.page.total = d.total
                        //计算耗时
                        const endT=(new Date()).getTime();
                        M.page.info="加载"+d.data.length+"条数据，耗时"+(endT-startT)/1000+"秒(数据总量"+M.page.total+")";

                        M.datas=d.data
                        //如果存在onPageLoaed方法，则调用
                        if(typeof(M.onPageLoaded)==='function')
                            M.onPageLoaded()
                    }
                )
            },
            _search (){
                this._load(1)
            },
            _selectPage (p){
                this.page.current = p
                this._load()
            },
            _selectPageSize (ps){
                this.page.pageSize = ps
                this._load()
            },
            /**
             * 目前只针对 iview 组件 input 进行处理
             */ 
            _autoFocusAfterModal(){
                if(!!this.autoFocus){
                    setTimeout(()=>this.$refs[this.autoFocus].$el.querySelector('input').focus(), 500)
                }
            },
            /**
             * 打开编辑对话框，如果存在 onAdd 方法则先调用，可以对entity进行初始化
             * @private
             */
            _add (){
                if(this.onAdd)  this.onAdd()
                else    this.entity={}
                this.addModal.show = true
                
                this._autoFocusAfterModal()
            },
            /**
             * 编辑数据实体
             */
            _edit(i) {
                const t = this.datas[i]
                GET(this.api.get.replace("#id#", t.id),{}, d=>{
                    this.entity = d
                    if(this.onEdit) this.onEdit()
                    this.addModal.show = true

                    this._autoFocusAfterModal()
                })
            },
            /**
             * 点击对话框中的确定按钮时触发，如果存在 onAddDo 方法则先调用，onAddDo若返回非true则不进行后续的操作
             *
             * 对象保存成功后，先隐藏对话框，然后调用onAddDone方法（如果存在的话）
             * @returns {boolean}
             * @private
             */
            _addDo (){
                const _check = !this.onAddDo || this.onAddDo()===true
                //不能通过检测时
                if(!_check) {
                    //由于iview 蛋疼的机制，详看源码：iview\src\components\modal\modal.vue， 想要在验证失败时保留对话框，要用延时操作。。。
                    //edit on 2017年3月15日17:48:05
                    setTimeout(()=>{this.addModal.work = true},500)
                    return this.addModal.work = false
                }

                RESULT(this.api.add,H.fixBean(this.entity),(d)=>{
                    this.addModal.show = false
                if(this.onAddDone)  this.onAddDone()
                else  this._load()
            },(e)=>{
                    setTimeout(()=>{this.addModal.work = true},500)
                    return this.addModal.work = false
                })
            },
            /**
             * 根据序号来删除
             * @param index
             * @private
             */
            _del (index,onDel,msg){
                const t=this.datas[index]
                if(!t)    return M.error("删除对象不存在！")
                if(this.onDel && this.onDel(t)===false)
                    return
                M.confirm("删除确认",msg||"你确定要删除这条数据吗？",()=>{
                    RESULT(this.api.del,{ids:[t.id]},(d)=>{
                        if(onDel) onDel(t)
                        else    M.ok(`数据对象(id=${t.id})删除成功`)
                        this.datas.splice(index,1)
                    })
                })
            },
            /**
            多选的支持
            如何使用？
                在 i-table 组件中，增加以下的事件绑定： @on-selection-change="_onSelect" 即可

            如何得到 选择的id？
                直接从 this.selectIds 中获取
            */
            _onSelect (vs){
                this.selectIds = vs.map(v=>{
                    return v.id
                })
                this.selectUuids = vs.map(v=>{
                  return v.uuid
                })
            },
            _updateIndex (i,fields={}){
                if(this.datas.$set)
                    this.datas.$set(i, Object.assign(this.datas[i],fields))
                else if(this.$set)
                    this.$set(this.datas, i, Object.assign(this.datas[i],fields))
                else
                    Object.assign(this.datas[i],fields)
            },
            toDate (d){
                return window.D.date(d)
            },
            toDatetime (d){
                return window.D.datetime(d)
            },
            html (v){
                return window.H.html(v)
            }
        },
        computed :{
            /**
             * 是否空数据
             */
            noData (){
                return H.isEmpty(this.datas)
            }
        },
        created(){
        },
        watch :{
            //监听每页大小的变化
            'page.pageSize' (){
                this._load()
            },
            //监听分页的变化
            'page.current' (){
                this._load()
            }
        }
    })
</script>
