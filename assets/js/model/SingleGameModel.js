/**
 * Created by apple on 15/9/2.
 */

import {BaseModel} from "./BaseModel.js"

class SingleGameModel extends BaseModel {

    /**
     * @function 默认构造函数
     */
    constructor(user_token) {

        //调用父类构造函数
        super();

        if (user_token) {
            //存入構造時的user_token
            this.user_token = user_token;
        }
        else {
            this.user_token = "qnZ5awrOszYd1iFb3iLF9FfewEutl5uZZ2u12o73Poo3D";
        }


        /**類的緩存*/
    }

    /**
     * @function 获取星球列表
     * @param sync 是否強制從遠程獲取,0或者undefined表示強制獲取，1表示使用緩存
     * @url http://121.41.104.156:10086/Game/SinglePlayer/getPlanetList?requestData={%22user_token%22:%22qnZ5awrOszYd1iFb3iLF9ChNJe0AAqvlGpPJ7q74LT83D%22}
     */
    getPlanetList(sync) {

        if (!this.user_token) {
            //如果構造時未傳入user_token,則用測試數據
            this.user_token = "qnZ5awrOszYd1iFb3iLF9FfewEutl5uZZ2u12o73Poo3D";

        }


        //构建Defer对象
        var dtd = $.Deferred();

        //判斷是否已經有緩存
        if (sync) {

            //否則直接返回本地緩存
            console.log("本地數據");

            dtd.resolve(JSON.parse(window.localStorage.getItem("getPlanetList_cache")));

        } else {
            //如果需要強制獲取，則從遠端獲取

            //以回调方式调用当前请求器
            this.ajaxRequest(
                this.server.prefix + "/Game/SinglePlayer/getPlanetList",//正式地址

                //"/assets/data/Game/SinglePlayer/getPlanetList.json",//本地测试地址

                {user_token: this.user_token, isGetAll: 1},

                function (data) {
                    //將數據存入本地緩存
                    window.localStorage.setItem("getPlanetList_cache", JSON.stringify(data));

                    dtd.resolve(data);
                });

        }

        //返回Promise对象
        return dtd.promise();


    }

    /**
     * @function 獲取今日任務
     * @param sync 是否強制從遠程獲取,0或者undefined表示強制獲取，1表示使用緩存
     * @url http://121.41.104.156:10086/Game/SinglePlayer/getTaskTargetAndInteractionValue?requestData={%22user_token%22:%22qnZ5awrOszYd1iFb3iLF9KL9HXh1YZ3EoqKcMSoRc2Bs3D%22}
     */
    getTaskTargetAndInteractionValue(sync) {

        //构建Defer对象
        var dtd = $.Deferred();

        //判斷是否已經有緩存
        if (sync) {

            //否則直接返回本地緩存
            console.log("本地數據");

            dtd.resolve(JSON.parse(window.localStorage.getItem("getTaskTargetAndInteractionValue_cache")));

        } else {
            //如果需要強制獲取，則從遠端獲取

            //以回调方式调用当前请求器
            this.ajaxRequest(
                this.server.prefix + "/Game/SinglePlayer/getTaskTargetAndInteractionValue",//正式地址

                //"/assets/data/singlePlayer/getTaskTargetAndInteractionValue.json",//本地测试地址

                {user_token: this.user_token, isGetAll: 1},

                function (data) {

                    //將數據存入本地緩存
                    window.localStorage.setItem("getTaskTargetAndInteractionValue_cache", JSON.stringify(data));

                    //Mock 将taskTarget改为300
                    //data.taskTarget = 300;

                    dtd.resolve(data);
                });

        }

        //返回Promise对象
        return dtd.promise();

    }

    /**
     * @function 完成今日任务
     * @param energy 今日的能量值
     * @url 121.41.104.156:10086/Game/SinglePlayer/doTaskComplete?requestData={"user_token":"4haOQaPCwwa5Qw4x2JxpJ6Ux5gDcbmfzXQoxXhBFo1w3D","energy":"6000","planet_id":"1"}
     */
    doTaskComplete(energy,planet_id) {

        //构建Defer对象
        var dtd = $.Deferred();

        //以回调方式调用当前请求器
        this.ajaxRequest(
            this.server.prefix + "/Game/SinglePlayer/doTaskComplete",//正式地址

            {user_token: this.user_token,planet_id:planet_id},

            function (data) {

                //將數據存入本地緩存
                dtd.resolve(data);

            });

        //返回Promise对象
        return dtd.promise();

    }

    /**
     * @function 根据星球ID获取到某个星球的互动值兑换有效天比例
     * @param planet_id
     */
    getExchangeRate(planet_id) {
        //构建Defer对象
        var dtd = $.Deferred();

        //以回调方式调用当前请求器
        this.ajaxRequest(
            this.server.prefix + "/Game/SinglePlayer/getExchangeRate",//正式地址

            {
                user_token: this.user_token,
                planet_id: planet_id
            },

            function (data) {

                //將數據存入本地緩存
                dtd.resolve(data);

            });

        //返回Promise对象
        return dtd.promise();
    }

    /**
     * @function 根据星球ID兑换该星球的一个有效天
     * @param planet_id
     * @returns {*}
     */
    doValidExchange(planet_id) {
        //构建Defer对象
        var dtd = $.Deferred();

        //以回调方式调用当前请求器
        this.ajaxRequest(
            this.server.prefix + "/Game/SinglePlayer/doValidExchange",//正式地址

            {
                user_token: this.user_token,
                planet_id:planet_id,
                exchangeDays: 1
            },

            function (data) {

                //將數據存入本地緩存
                dtd.resolve(data);

            });

        //返回Promise对象
        return dtd.promise();
    }

    /**
     * @function 根据星球ID解锁某个星球
     * @param planet_id
     * @returns {*}
     */
    doPlanetUnlocked(planet_id) {
        //构建Defer对象
        var dtd = $.Deferred();

        //以回调方式调用当前请求器
        this.ajaxRequest(
            this.server.prefix + "/Game/SinglePlayer/doPlanetUnlocked",//正式地址

            {
                user_token: this.user_token,
                planet_id:planet_id
            },

            function (data) {

                //將數據存入本地緩存
                dtd.resolve(data);

            });

        //返回Promise对象
        return dtd.promise();
    }

}

export {SingleGameModel};