/**
 * Created by apple on 15/9/6.
 */
import {BaseModel} from "./BaseModel.js"

var moment = require('libs/moment.min.js');

import {CordovaPluginService} from "../../js/service/CordovaPluginService.js";

//初始化Cordova插件
var cordovaPluginService = new CordovaPluginService();

//获取今日日期
var today = moment().format("YYYY-MM-D");
//var today = "111";//测试数据
class GlobalGameStateModel extends BaseModel {

    /**
     * @function 默认构造函数
     */
    constructor() {

        super();
    }

    /**游戏状态设置*/
    /**
     * @function 设置游戏状态
     * @param game_type 游戏类型，为"single" 或者 "multiple"
     * @param game_token 游戏令牌，如果是单人游戏则为今日日期，否则为task_id
     * @param game_goal 游戏目标
     */
    setGameState(game_type, game_token, game_goal) {

        window.localStorage.setItem("game_state", JSON.stringify({
            game_type: game_type,
            game_token: game_token,
            game_goal: game_goal
        }));

    }

    /**
     * @function 返回当前的游戏状态
     */
    getGameState() {
        if (window.localStorage.getItem("game_state")) {
            return JSON.parse(window.localStorage.getItem("game_state"));
        } else {
            return {
                game_type: undefined,
                game_token: undefined
            }
        }
    }

    /*单人游戏状态**/

    /**
     * @function 判断今日任务是否已经开始
     */
    isTodaySingleGameStart() {

        if (window.localStorage.getItem("todaySingleGameStart") && window.localStorage.getItem("todaySingleGameStart") === today) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * @function 设置今天单人游戏已经开始
     */
    setTodaySingleGameStart(todayTarget) {

        var dtd = $.Deferred();

        //调用Cordova插件，启动底层的计步器
        cordovaPluginService.singleGame().
            startTodaySingleGameRecord(todayTarget).
            then(
            (data)=> {
                //设置今日游戏已经开始
                window.localStorage.setItem("todaySingleGameStart", today);
                dtd.resolve(data);
            }
        );

        return dtd.promise();


    }

    /**
     * @function 判断当前正在进行的是否是单人模式，有可能是已经开始过单人模式，但是中途暂停了
     */
    isTodaySingleGameOn() {
        if (this.isTodaySingleGameStart() && this.getGameState().game_type == "single") {
            return true;
        } else {
            return false;
        }
    }

    /**
     * @function 设置当前正在进行单人游戏
     * @param todayTarget 今日目标
     */
    setTodaySingleGameOn(todayTarget) {

        var dtd = $.Deferred();

        //如果没有传入todayTarget,则从本地先获取目标
        if (!todayTarget) {
            todayTarget = JSON.parse(window.localStorage.getItem("getTaskTargetAndInteractionValue_cache")).taskTarget;
        }

        //设置今日已经开始单人游戏
        this.setTodaySingleGameStart(todayTarget);

        //设置开启底层的计步器
        cordovaPluginService.singleGame().startTodaySingleGameRecord(todayTarget).then((data)=> {

            //设置正在进行单人游戏
            this.setGameState("single", today, todayTarget);

            //调用data
            dtd.resolve(data);

        });

        return dtd.promise();
    }

    /**
     * @function 设置关闭今日的单人游戏计步
     */
    setTodaySingleGameOff() {

        var dtd = $.Deferred();

        var todayTarget = this.getGameState().game_goal;

        cordovaPluginService.singleGame().stopTodaySingleGameRecord(todayTarget).then((data)=> {

            //移除之前的正在游戏状态
            window.localStorage.removeItem("game_state");

            dtd.resolve();
        });

        return dtd.promise();

    }

    /**
     * @function 判断今日任务是否已经完成，即是否已经向服务器提交过请求
     */
    isTodaySingleGameFinished() {

        if (window.localStorage.getItem("todaySingleGameFinished") && window.localStorage.getItem("todaySingleGameFinished") == today) {
            //如果今日单人游戏完成时间等于今天，则返回true
            return true;
        }
        else {
            return false;
        }
    }

    /**
     * @function 设置完成今日任务
     */
    setTodaySingleGameFinished() {
        window.localStorage.setItem("todaySingleGameFinished", today);
    }


    /*多人游戏状态**/
    //多人游戏不存在暂停这个状态

    /**
     * @function 判断是否正在进行多人游戏，否的话返回null,是的话返回task_id
     */
    isMultipleGameOn() {

        if (this.getGameState().game_type == "multiple") {
            return this.getGameState().game_token;
        } else {
            return null;
        }

    }

    /**
     * @function 设置正在进行的多人游戏
     * @param task_id 多人遊戲編號
     * @param task_goal 多人遊戲的目標
     */
    setMultipleGameOn(task_id, task_goal) {

        if(!task_goal){
            //开发时容错
            task_goal = 5000;
        }

        var dtd = $.Deferred();

        //為了以防萬一，開始調用啟動多人遊戲的計步
        cordovaPluginService.multipleGame().startMultipleGameRecord(task_id, task_goal).then((data)=> {
            //设置当前的游戏状态
            this.setGameState("multiple", task_id, task_goal);

            dtd.resolve();
        });

        return dtd.promise();

    }

    /**
     * @function 关闭某个多人任务
     * @param task_id 任务的ID
     */
    setMultipleGameOff(task_id) {

        var dtd = $.Deferred();

        //关闭底层的计步器
        cordovaPluginService.multipleGame().stopMultipleGameRecord(task_id).then((data)=> {

            //删除当前游戏状态
            window.localStorage.removeItem("game_state");

            //返回该处理结果
            dtd.resolve();

        });

        return dtd.promise();

    }

}

export {GlobalGameStateModel}