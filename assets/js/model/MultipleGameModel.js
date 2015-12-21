/**
 * Created by apple on 15/9/2.
 */
import {BaseModel} from "./BaseModel.js";

/**全局变量*/
var request_lock = false;

class MultipleGameModel extends BaseModel {

    /**
     * @function 構造函數
     * @param user_token 用戶token
     */
    constructor(user_token) {

        super();

        //設置用戶token
        if (user_token) {
            this.user_token = user_token;
        }
        else {
            this.user_token = "QZlHEPga10j4ohImyaZaXlwP2OkPhP95yaH4XV6DAco3D";
        }
    }

    /**
     * @function 獲取某個用戶當前的多人遊戲狀態
     * @param sync 0或者undefined表示不需要缓存，1表示需缓存
     */
    getMyCurrentMultiGameInfo(sync) {

        var dtd = $.Deferred();

        if (sync) {
            //如果是使用缓存数据
            dtd.resolve(JSON.parse(localStorage.getItem("getMyCurrentMultiGameInfo_Cache")));
            return dtd.promise();
        }

        //以回调方式调用当前请求器
        this.ajaxRequest(
            this.server.prefix + "/Game/MultiPlayer/getMyCurrentMultiGameInfo",//正式地址
            //"/assets/data/Game/MultiPlayer/getMyCurrentMultiGameInfo.json",//測試地址
            {
                user_token: this.user_token
            },
            function (data) {
                //console.log(data);
                if (data.code == 0) {
                    //成功获取到数据

                    //存入本地的localStorage
                    localStorage.setItem("getMyCurrentMultiGameInfo_Cache", JSON.stringify(data));

                    //调用延迟执行
                    dtd.resolve(data);
                } else {
                    dtd.reject(data);
                }
            });

        return dtd.promise();
    }

    /**
     * @function 创建某个多人任务
     * @param task_time_limit
     * @param task_goal
     * @param task_description
     * @param task_leave_words
     * @param to_who
     * @URL http://121.41.104.156:10086/Game/MultiPlayer/doMultiGameCreate?requestData={%22user_token%22:%22qnZ5awrOszYd1iFb3iLF9Ferxd7CJGGWGa2BKCt7gmqQ3D%22}
     */
    doMultiGameCreate(task_time_limit, task_goal, task_description, task_leave_words, to_who) {

        var dtd = $.Deferred();

        if (!request_lock) {

            //设置请求锁，防止多次重复请求
            request_lock = true;

            //以回调方式调用当前请求器
            this.ajaxRequest(
                this.server.prefix + "/Game/MultiPlayer/doMultiGameCreate",
                //"/assets/data/Game/MultiPlayer/doMultiGameCreate.json",//测试地址
                {
                    user_token: this.user_token,
                    task_time_limit: task_time_limit,
                    task_goal: task_goal,
                    task_description: task_description,
                    task_leave_words: task_leave_words,
                    to_who: to_who
                },
                function (data) {
                    request_lock = false;
                    //开发时容错，判断是否有task_id，没有的话添加
                    //Deprecated
                    if (!data.task_id) {
                        data.task_id = 5;
                    }
                    dtd.resolve(data);
                });

            return dtd.promise();

        } else {

            return dtd.promise();
        }


    }

    /**
     * @function 修改用戶的某個多人任務狀態
     * @param task_id 多人任務的id
     * @param operation 0:尚未接受 1:已拒绝 2:正在进行中 3:放弃 4:完成 5:失败
     * @url http://api.liveforest.com/Game/MultiPlayer/doMultiGameOperate
     */
    doMultiGameOperate(task_id, operation) {

        var dtd = $.Deferred();

        //以回调方式调用当前请求器
        this.ajaxRequest(this.server.prefix + "/Game/MultiPlayer/doMultiGameOperate",
            {
                user_token: this.user_token,
                task_id: task_id,
                operation: operation
            },

            function (data) {

                //console.log(data);

                dtd.resolve(data);
            });

        return dtd.promise();
    }

    /**
     * @function 获取我的邀请列表
     */
    getMyInvitationList() {
        var dtd = $.Deferred();

        //以回调方式调用当前请求器
        this.ajaxRequest(
            this.server.prefix + "/Game/MultiPlayer/getMyInvitationList",//正式地址
            //"/assets/data/Game/MultiPlayer/getMyInvitationList.json",//測試地址
            {
                user_token: this.user_token
            },
            function (data) {
                console.log(data);
                if (data.code == 0) {
                    dtd.resolve(data);
                } else {
                    dtd.reject(data);
                }
            });

        return dtd.promise();
    }

    /**
     * @function 获取我创建的多人游戏的列表
     * @returns {*}
     * @URL
     */
    getMultiGameCreateList() {
        var dtd = $.Deferred();

        //以回调方式调用当前请求器
        this.ajaxRequest(
            this.server.prefix + "/Game/MultiPlayer/getMultiGameCreateList",//正式地址
            //"/assets/data/Game/MultiPlayer/getMultiGameCreateList.json",//測試地址
            {
                user_token: this.user_token
            },
            function (data) {
                //console.log(data);
                if (data.code == 0) {
                    dtd.resolve(data);
                } else {
                    dtd.reject(data);
                }
            });

        return dtd.promise();
    }

    /**
     * @function 获取我参与的多人游戏的列表
     * @returns {*}
     */
    getMultiGameAttendList() {
        var dtd = $.Deferred();

        //以回调方式调用当前请求器
        this.ajaxRequest(
            this.server.prefix + "/Game/MultiPlayer/getMultiGameAttendList",//正式地址
            //"/assets/data/Game/MultiPlayer/getMultiGameAttendList.json",//測試地址
            {
                user_token: this.user_token
            },
            function (data) {
                //console.log(data);
                if (data.code == 0) {
                    dtd.resolve(data);
                } else {
                    dtd.reject(data);
                }
            });

        return dtd.promise();
    }


    /**
     * @function 获取某个多人游戏详情
     * @returns {*}
     */
    getMultiGameInfo(task_id) {
        var dtd = $.Deferred();

        //以回调方式调用当前请求器
        this.ajaxRequest(
            this.server.prefix + "/Game/MultiPlayer/getMultiGameInfo",//正式地址
            //"/assets/data/Game/MultiPlayer/getMultiGameInfo.json",//測試地址
            {
                user_token: this.user_token,
                task_id:task_id
            },
            function (data) {
                //console.log(data);
                if (data.code == 0) {
                    dtd.resolve(data);
                } else {
                    dtd.reject(data);
                }
            });

        return dtd.promise();
    }


}

export {MultipleGameModel}