const A={}

//执行相关操作后，应用的状态变更规则
let nextStat = {
    'start':    1,
    'stop':     0,
    'restart':  1,
    'delete':   -1
}

/**
 * 操作容器
 * op=start     启动
 * op=stop      停止
 * op=restart   重启
 * op=delete    删除容器（并不会删除应用记录）
 */ 
A.operate = (name,op,cb)=>{
    let stat = nextStat[op]

    M.confirm(op, `对容器 ${name} 执行 ${op} 操作吗？<br><br> 操作成功后，容器状态变更为 <b>${window.C.stats[stat].text}</b>`, ()=>{
        RESULT(`app/operate/${name}/${op}`,{},d=>{
            if(cb) cb(stat)
            M.notice.ok(`容器 ${name} ${op} 成功，状态变更为 <b>${window.C.stats[stat].text}</b>`)
        })
    })
}

export default A