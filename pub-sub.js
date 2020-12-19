
/**
 * 定义pubsub对象模块
 */
(function (window) {
    const PubSub = {}
    //用来保存待处理的函数容器
    const callbackContainer = {}
    let id = 0
    /**
     * 
     * 数据结构
     * {
     *  msg:{
     *     uid:func,
     *      uid2:func ...
     *  }    
     * }
     */
    //订阅
    PubSub.subscribe = function (msg, callback) {
        let callbacks = callbackContainer[msg]
        if (!callbacks) { //如果这个没有订阅就创建新的
            callbacks = {}
            callbackContainer[msg] = callbacks
        }
        const token = 'uid_' + (++id); //唯一的id 
        callbacks[token] = callback

        //返回token
        return token;
    }
    //异步发布
    PubSub.publish = function (msg, data) {
        const callbacks = callbackContainer[msg];
        if (callbacks) {
            Object.values(callbacks).forEach(callback => {
                setTimeout(() => {
                    callback(msg, data)
                });
            })
        }
    }
    //同步发布
    PubSub.publishSync = function (msg, data) {
        const callbacks = callbackContainer[msg];
        if (callbacks) {
            Object.values(callbacks).forEach(callback => {
                callback(msg, data)
            })
        }
    }
    //取消订阅
    /**
     * 1flag没有指定取消所有
     * 2flag是一个token 取消对应的回调
     * 3flag是msgName 取消对应的所有
     * @param {*uid | name} flag 
     */
    PubSub.unsubscribe = function (flag) {
        if(flag===undefined){ //没有指定
            callbackContainer={}
        }else if(typeof flag==='string' && flag.indexOf('uid_')===0){ //指定的是token
            Object.values(callbackContainer).forEach(callbacks=>{
                delete callbacks[flag]
            })
        }else{ //简单来说是一个对象名直接删
            delete callbackContainer[flag]
        }
    }

    window.PubSub = PubSub
})(window)