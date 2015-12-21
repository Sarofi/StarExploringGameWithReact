/**
 * Created by apple on 15/9/2.
 */

var $ = require('jquery');

/**
 * @function 插件构造
 */
class CordovaPluginService{

    /**静态方法*/
    /**
     * @function 判断是否为Cordova环境
     */
    static isCordova(){

        if(typeof cordova === 'undefined'){
            //如果cordova尚未定义，则返回false
            return false;
        }
        else{
            //否则返回true
            return true;
        }
    }

    /**
     * @function 获取用户信息的插件
     */
    getUserInfo(){
        //构造一个新的Defered对象
        var dtd = $.Deferred();

        //判断是否为Cordova环境
        if(CordovaPluginService.isCordova()){

            //只需要在这里监听下deviceReady
            document.addEventListener('deviceready', function () {

                console.log('Device is Ready!');

                cordova.exec(
                    function (data) {
                        dtd.resolve(data);
                    },
                    function (err) {
                        dtd.reject(err)
                    },
                    "UserInfoPlugin",
                    "getUserInfo",
                    []
                );

            }, false);

        }else{
            //如果非Cordova，则直接返回，方便测试
            dtd.resolve({
                user_token:"2Fot2m3nP7r0PCI80hRBQKXccoYNXnUQ3R6TDjlVUpKo3D"
            });
        }

        return dtd.promise();
    }


    /**
     * @function 單人遊戲插件
     * @returns {{}}
     */
    singleGame(){
        return {
            /**
             * @function 開啟今日計步
             */
            startTodaySingleGameRecord(todayTarget){

                //alert(todayTarget);

                //构造一个新的Defered对象
                var dtd = $.Deferred();

                //判断是否为Cordova环境
                if(CordovaPluginService.isCordova()){

                    //只需要在这里监听下deviceReady
                    document.addEventListener('deviceready', function () {

                        console.log('Device is Ready!');

                        cordova.exec(
                            function (data) {
                                dtd.resolve(data);
                            },
                            function (err) {
                                dtd.reject(err)
                            },
                            "GamePlugin",
                            "startTodaySingleGameRecord",
                            [todayTarget.toString()]
                        );

                    }, false);

                }else{
                    //如果非Cordova，则直接返回，方便测试
                    dtd.resolve(0);
                }
                return dtd.promise();
            },

            /**
             * @function 关闭今日的单人模式计步
             * @param todayTarget 今日目标
             */
            stopTodaySingleGameRecord(todatTarget){
                //构造一个新的Defered对象
                var dtd = $.Deferred();

                //判断是否为Cordova环境
                if(CordovaPluginService.isCordova()){

                    //只需要在这里监听下deviceReady
                    document.addEventListener('deviceready', function () {

                        console.log('Device is Ready!');

                        cordova.exec(
                            function (data) {
                                dtd.resolve(data);
                            },
                            function (err) {
                                dtd.reject(err)
                            },
                            "GamePlugin",
                            "stopTodaySingleGameRecord",
                            [todatTarget.toString()]
                        );
                    }, false);

                }else{
                    //如果非Cordova，则直接返回，方便测试
                    dtd.resolve(0);
                }
                return dtd.promise();
            },

            /**
             * @function 获取当前单人计步状态与计步值
             */
            getTodaySingleGameRecord(){
                //构造一个新的Defered对象
                var dtd = $.Deferred();

                //判断是否为Cordova环境
                if(CordovaPluginService.isCordova()){

                    //只需要在这里监听下deviceReady
                    document.addEventListener('deviceready', function () {

                        console.log('Device is Ready!');

                        cordova.exec(
                            function (data) {
                                dtd.resolve(data);
                            },
                            function (err) {
                                dtd.reject(err)
                            },
                            "GamePlugin",
                            "getTodaySingleGameRecord",
                            []
                        );

                    }, false);

                }else{
                    //如果非Cordova，则直接返回，方便测试
                    dtd.resolve({
                        singleSteps:1000,//今日的计步数
                        singlePlay:false//当前是否正在单人计步
                    });
                }
                return dtd.promise();
            }
        }
    }

    /**
     * @function 多人计步插件
     */
    multipleGame(){
        return {

            /**
             * @function 开启多人计步
             */
            startMultipleGameRecord(task_id,task_goal){

                //构造一个新的Defered对象
                var dtd = $.Deferred();

                if(CordovaPluginService.isCordova()){

                    //只需要在这里监听下deviceReady
                    document.addEventListener('deviceready', function () {

                        console.log('Device is Ready!');

                        cordova.exec(
                            function (data) {
                                dtd.resolve(data);
                            },
                            function (err) {
                                dtd.reject(err)
                            },
                            "GamePlugin",
                            "startMultipleGameRecord",
                            [task_id.toString(),task_goal.toString()]
                        );

                    }, false);

                }else{
                    dtd.resolve(true);
                }

                return dtd.promise();
            },

            /**
             * @function 获取某个多人游戏的计步值
             * @param task_id 多人游戏编号
             * @return 当前步数 -1 表示该任务尚未开始
             */
            getMultipleGameRecord(task_id){

                //构造一个新的Defered对象
                var dtd = $.Deferred();

                if(CordovaPluginService.isCordova()){

                    //只需要在这里监听下deviceReady
                    document.addEventListener('deviceready', function () {

                        console.log('Device is Ready!');

                        cordova.exec(
                            function (data) {
                                dtd.resolve(data);
                            },
                            function (err) {
                                dtd.reject(err)
                            },
                            "GamePlugin",
                            "getMultipleGameRecord",
                            [task_id.toString()]
                        );

                    }, false);

                }else{
                    dtd.resolve(1000);
                }

                return dtd.promise();

            },

            /**
             * @function 关闭某个多人模式计步器
             * @param task_id 多人模式编号
             */
            stopMultipleGameRecord(task_id){
                //构造一个新的Defered对象
                var dtd = $.Deferred();

                if(CordovaPluginService.isCordova()){

                    //只需要在这里监听下deviceReady
                    document.addEventListener('deviceready', function () {

                        console.log('Device is Ready!');

                        cordova.exec(
                            function (data) {
                                dtd.resolve(data);
                            },
                            function (err) {
                                dtd.reject(err)
                            },
                            "GamePlugin",
                            "stopMultipleGameRecord",
                            [task_id.toString()]
                        );

                    }, false);

                }else{
                    dtd.resolve(1000);
                }

                return dtd.promise();
            }
        }



    }

    /**
     * @function 社交分享插件
     */
    socialUtils(){

        return {
            /**
             * @function 进行第三方分享
             */
            doThirdShare(url,title){

                //构造一个新的Defered对象
                var dtd = $.Deferred();

                if(CordovaPluginService.isCordova()){

                    //只需要在这里监听下deviceReady
                    document.addEventListener('deviceready', function () {

                        console.log('Device is Ready!');

                        cordova.exec(
                            function (data) {
                                dtd.resolve(data);
                            },
                            function (err) {
                                dtd.reject(err)
                            },
                            "GamePlugin",
                            "doThirdShare",
                            [url,title]
                        );

                    }, false);

                }else{
                    dtd.resolve(true);
                }

                return dtd.promise();

            }
        }

    }

    /**
     * @function 系统组件
     */
    systemUtils(){

        return {
            goBack(){
                cordova.exec(
                    function (data) {
                        dtd.resolve(data);
                    },
                    function (err) {
                        dtd.reject(err)
                    },
                    "GamePlugin",
                    "goBack",
                    []
                );
            }
        }

    }

}

export {CordovaPluginService};