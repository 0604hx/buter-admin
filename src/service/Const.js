/**
 * 系统常量
 */
export default {
    version: "1.0.0",

    stats:{
        '-1':{
            text:"未创建",
            summary:"此应用还上传版本，上传版本后自动创建容器"
        },
        '0':{
          text:"已停止",
          summary:"此应用容器还未运行"  
        },
        '1':{
            text:"运行中",
            summary:"此应用容器正在运行中"  
        }
    },

    /**
     * 定制 codemirror 选项
     */
    getCodeOptions: (ps)=>{
        return Object.assign({
            readOnly:false,
            tabSize: 2,
            lineNumbers: true,
            lineWrapping: true
        }, ps)
    }
}