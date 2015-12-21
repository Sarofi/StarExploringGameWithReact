'use strict'

var $ = require('jquery');
var moment = require('libs/moment.min.js');
var Swiper = require('libs/swiper.jquery.umd.js');
var pageResponse = require("pageResponse");
var Textarea = require('../textarea/TextareaAutoSize.js');
import React from "libs/react.js";

require("./singleGame.scss");

/**载入通用组件*/
import {ModalDialog} from "../widgets/dialog/modalDialog.jsx";

//全局數據模型類
import {SingleGameModel} from "../../js/model/SingleGameModel.js";
var singleGameModel = null;

import {MultipleGameModel} from "../../js/model/MultipleGameModel.js"
var multipleGameModel = null;

import {GlobalGameStateModel} from "../../js/model/GlobalGameStateModel.js";
var globalGameStateModel = new GlobalGameStateModel();

/**全局插件模型*/
import {CordovaPluginService} from "../../js/service/CordovaPluginService.js";

//初始化Cordova插件
var cordovaPluginService = new CordovaPluginService();

//尝试调用本地Cordova插件
cordovaPluginService.getUserInfo().then((data)=> {

    //利用獲取到的user_token構造多人遊戲數據模型
    singleGameModel = new SingleGameModel(data.user_token)

    //構造多人模式數據模型
    multipleGameModel = new MultipleGameModel(data.user_token);

});

/**全局LocalStorage缓存*/

/**
 * @function 单人游戏主界面
 */
class SingleGame_mainPage extends React.Component {

    /**Override*/
    /**
     * @function 默认构造器
     */
    constructor() {

        super();
        /**加载所需要的图片*/
        this.danren_light = "light";//显示在可用状态下
        this.duoren_light = "light";//显示在可用状态下

        this.danren_dark = "dark";//显示在不可用状态下
        this.duoren_dark = "dark";//显示在不可用状态下

        this.state = this.getInitialState();

        this.handleScreenClick = this.handleScreenClick.bind(this);
        this.setStateAfterAjax = this.setStateAfterAjax.bind(this);
        this.initData = this.initData.bind(this);

    }

    /**
     * @function 獲取默認的State
     */
    getInitialState() {

        return {
            planet_list: [],//存放当前星球列表
            current_planet_id: null,//存放当前正在探索的星球ID
            energy: 0,//存放当前用户的能量值
            interaction_value: 0,//存放当前用户的互动值
            isPlaying: true//存放当前用户是否正在游戏
        }

    }

    /**
     * @function 设置State
     * @param key
     * @param value
     */
    setStateAfterAjax(key, value) {

        if (key == "planet_list") {
            this.setState(
                {
                    planet_list: value
                }
            );
        }

        if (key == "current_planet_id") {
            this.setState(
                {
                    current_planet_id: value
                }
            );
        }


    }


    /**LifeCycle*/
    /**
     * @function 组件渲染好之后的回调
     */
    componentDidMount() {

        //组件渲染好之后，进行页面缩放
        var page = new pageResponse({
            class: 'pageRespone',     //模块的类名，使用class来控制页面上的模块(1个或多个)
            mode: 'contain',     // auto || contain || cover
            width: '375',      //输入页面的宽度，只支持输入数值，默认宽度为320px
            height: '667'      //输入页面的高度，只支持输入数值，默认高度为504px
        });


        //进行Swipe渲染
        var swiper = new Swiper('.swiper-container-planet', {
            pagination: '.swiper-pagination',
            paginationClickable: true,
            direction: 'vertical',
            controlInverse: true,
            initialSlide: 2,
            onInit: function (swiper) {
            }
        });

        //为了防止有空白出现，将主界面的背景改为蓝色
        $("div#container").css("background", "RGB(40,40,52)");

        if (!singleGameModel) {
            setTimeout(()=> {
                this.initData();
            }, 2000);
        } else {
            this.initData();
        }


    }

    /**Event*/

    /**
     * @function 处理屏幕点击事件
     * @param e 事件
     */
    handleScreenClick(e) {
        var x = e.nativeEvent.x;
        var y = e.nativeEvent.y;

        //alert(x);
        //alert(y);
        //alert(document.documentElement.clientWidth);
        //alert(document.documentElement.clientHeight);


        if (x > document.documentElement.clientWidth * 0.5 && y > document.documentElement.clientHeight * 0.7) {

            //如果用戶點擊了多人模式

            //判断多人模式是否可点
            if (globalGameStateModel.isTodaySingleGameOn()) {
                alert("正在单人游戏中！");
                return;
            }

            //獲取後臺接口，判斷是否有正在進行的多人任務
            multipleGameModel.getMyCurrentMultiGameInfo().then((data)=> {

                console.log(data);
                //alert(JSON.stringify(data));

                if (data.multiGameInfo && data.multiGameInfo.task_id) {
                    //如果存在當前正在的多人遊戲任務，則跳轉到正在遊戲界面

                    //設置當前的遊戲狀態為多人遊戲進行中
                    globalGameStateModel.setMultipleGameOn(data.multiGameInfo.task_id, data.multiGameInfo.task_goal);

                    //界面跳轉
                    this.context.router.transitionTo('/single-planetOn');

                } else {

                    //如果不存在當前正在進行的多人遊戲，則跳轉到多人遊戲主界面
                    this.context.router.transitionTo('/multiple');
                }


            }, (err)=> {
                //alert(JSON.stringify(err));
                console.log(err);
            });


        }
        else if (x < document.documentElement.clientWidth * 0.5 && y > document.documentElement.clientHeight * 0.7) {

            //用户点击了单人模式
            //判斷用戶是否正在進行多人模式
            if (globalGameStateModel.isMultipleGameOn()) {
                alert("正在多人游戏中！");
                return;
            }

            //判斷今日單人任務是否已經完成，如果已經完成則直接回覆任務已經完成
            if (globalGameStateModel.isTodaySingleGameFinished()) {
                alert("今日单人任务已经完成！");
                return;
            }

            //判断当前是否已经开始计数
            if (globalGameStateModel.isTodaySingleGameOn()) {
                //如果正在单人模式，则跳转到正在游戏的场景
                this.context.router.transitionTo('/single-planetOn');
            } else {
                //否则跳转到开始游戏的场景
                this.context.router.transitionTo('/single-planetStartPage/' + this.state.current_planet_id);
            }
        }
    }

    /**Inner Help*/
    initData() {
        //获取星球数据

        //为了防止初始加载Cordova时候的延迟，这里采用循环调用方式
        singleGameModel.getPlanetList().then(
            (data)=> {

                //遍历获取当期正在进行的星球的ID
                for (i in data.planetList) {

                    //首先修正每个星球阴影的高度

                    //console.log(data.planetList[i]);
                    //找到第一个尚未探索完成的
                    if (data.planetList[i].exploration_progress == 2) {

                        //如果是已经完成的则跳过
                        data.planetList[i].dark_height = "0px";

                        continue;

                    } else if (data.planetList[i].exploration_progress == 1) {

                        //如果是正在進行的
                        //容错，防止默认的valid_days值为-1
                        if (data.planetList[i].valid_days == -1) {
                            data.planetList[i].valid_days = 0;
                        }

                        //设置当前星球的探索进度
                        data.planetList[i].dark_height = (100 - 100 * (data.planetList[i].valid_days / data.planetList[i].planet_need_days)) + "px";

                        this.setStateAfterAjax("current_planet_id", data.planetList[i].planet_id);

                        //將當前正在探索的星球的ID存入到localStorage中
                        localStorage.setItem("singleGame_CurrentPlanetId", data.planetList[i].planet_id);

                        break;

                    } else {
                        //否则记录为当前需要正在的
                        //alert(data.planetList[i].planet_id);


                    }
                }

                //将当期的星球列表存放到State中
                this.setStateAfterAjax("planet_list", data.planetList);


            },
            (data)=> {
                //如果数据获取出错
                console.log(data);
            }
        );

        //获取今日的积分与任务
        singleGameModel.getTaskTargetAndInteractionValue().then((data)=> {

            //console.log(data);
            //設置當前能量值
            this.setState({
                interaction_value: data.interaction_value,
            });
        });

        //獲取今日單人的能量值
        cordovaPluginService.singleGame().getTodaySingleGameRecord().then((data)=> {

            //alert(data.singleSteps);

            this.setState({
                energy: data.singleSteps == -1 ? 0 : data.singleSteps,
                singleSteps: data.singleSteps
            });
        });

        //強制頁面刷新
        this.forceUpdate();

        //判断当前用户所处的游戏状态
        if (globalGameStateModel.isTodaySingleGameOn()) {

            //如果正在单人游戏中
            this.danren = this.danren_light;
            this.duoren = this.duoren_dark;

            //如果今日的单人游戏已经启动，则再开启一遍本地的计数器
            globalGameStateModel.setTodaySingleGameOn(globalGameStateModel.getGameState().game_goal);

        } else if (globalGameStateModel.isMultipleGameOn()) {

            //如果正在多人游戏中
            this.danren = this.danren_dark;
            this.duoren = this.duoren_light;

            //根据获取到的task_id来开启多人游戏计步
            globalGameStateModel.setMultipleGameOn(globalGameStateModel.getGameState().game_token, globalGameStateModel.getGameState().game_goal);

        } else {

            //如果即不是多人游戏，也不是单人游戏
            this.danren = this.danren_light;
            this.duoren = this.duoren_light;

        }

        //判断今日单人任务是否已经完成
        if (!globalGameStateModel.isTodaySingleGameFinished()) {
            //如果单人任务尚未完成，则开启定时器获取
            //開啟計時器，定期獲取當前能量值
            window.setInterval(()=> {
                if (globalGameStateModel.isTodaySingleGameStart()) {
                    //如果今日单人模式已经开始，则自动开始获取计步值
                    cordovaPluginService.singleGame().getTodaySingleGameRecord().then((data)=> {
                        this.setState({
                            energy: data.singleSteps == -1 ? 0 : data.singleSteps,//能量值计数
                            singleSteps: data.singleSteps//当前真实的步数
                        });
                    });

                    //强制更新当前显示
                    this.forceUpdate();

                }


            }, 3000);
        } else {
            //如果单人任务已经完成，则直接获取一次
            if (globalGameStateModel.isTodaySingleGameStart()) {
                //如果今日单人模式已经开始，则自动开始获取计步值
                cordovaPluginService.singleGame().getTodaySingleGameRecord().then((data)=> {
                    this.setState({
                        energy: data.singleSteps == -1 ? 0 : data.singleSteps,//能量值计数
                        singleSteps: data.singleSteps//当前真实的步数
                    });
                });

                //强制更新当前显示
                this.forceUpdate();

            }
        }


    }

    /**
     * @function 默認渲染函數
     */
    render() {

        var single_classes = "animated tada " + this.danren;
        var multiple_classes = "animated tada " + this.duoren;

        return (<div className="SingleGame_mainPage pageRespone">

                <div className="fixed">
                    <div className="head">
                        <div className="energy">
                            <span>能量值</span>
                            <span id="energy">{this.state.energy}</span>
                        </div>
                        <div className="hudong">
                            <span>互动值</span>
                            <span id="hudong">{this.state.interaction_value}</span>
                        </div>
                    </div>
                    <div className="foot">
                        <div className="single">
                            <div className={single_classes}>

                            </div>

                            <span>单人模式</span>
                        </div>
                        <div className="multiple">
                            <div className={multiple_classes}>

                            </div>
                            <span>多人模式</span>
                        </div>
                    </div>
                </div>


                <div className="Planet">
                    <div className="swiper-container-planet">
                        <div className="swiper-wrapper" onClick={this.handleScreenClick}>

                            {/*第三屏,由於是上劃，所以放在最上面*/}
                            <div className="swiper-slide slide-3">
                                <div className="top"
                                     onClick={()=>{this.context.router.transitionTo('/single-planetDetail/9')}}>
                                    <div className="light">
                                        <div className="dark"
                                             style={{height:this.state.planet_list && this.state.planet_list[8] ? this.state.planet_list[8].dark_height : '100px'}}>
                                        </div>
                                    </div>
                                </div>
                                <div className="middle"
                                     onClick={()=>{this.context.router.transitionTo('/single-planetDetail/8')}}>
                                    <div className="light">
                                        <div className="dark"
                                             style={{height: this.state.planet_list && this.state.planet_list[7] ? this.state.planet_list[7].dark_height : '100px'}}
                                            >
                                        </div>
                                    </div>
                                </div>
                                <div className="bottom"
                                     onClick={()=>{this.context.router.transitionTo('/single-planetDetail/7')}}>
                                    <div className="light">
                                        <div className="dark"
                                             style={{height:this.state.planet_list && this.state.planet_list[6] ? this.state.planet_list[6].dark_height : '100px'}}
                                            >
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/*第二屏,由於是上劃，所以放在中间*/}
                            <div className="swiper-slide slide-2">
                                <div className="top"
                                     onClick={()=>{this.context.router.transitionTo('/single-planetDetail/6')}}>
                                    <div className="light">
                                        <div className="dark"
                                             style={{height:this.state.planet_list && this.state.planet_list[5] ? this.state.planet_list[5].dark_height : '100px'}}
                                            >
                                        </div>
                                    </div>
                                </div>
                                <div className="middle"
                                     onClick={()=>{this.context.router.transitionTo('/single-planetDetail/5')}}>
                                    <div className="light">
                                        <div className="dark"
                                             style={{height:this.state.planet_list && this.state.planet_list[4] ? this.state.planet_list[4].dark_height : '100px'}}
                                            >
                                        </div>
                                    </div>
                                </div>
                                <div className="bottom"
                                     onClick={()=>{this.context.router.transitionTo('/single-planetDetail/4')}}>
                                    <div className="light">
                                        <div className="dark"
                                             style={{height:this.state.planet_list && this.state.planet_list[3] ? this.state.planet_list[3].dark_height : '100px'}}
                                            >
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/*第一屏,由於是上劃，所以放在最下面*/}
                            <div className="swiper-slide slide-1">
                                <div className="top"
                                     onClick={()=>{this.context.router.transitionTo('/single-planetDetail/3')}}>
                                    <div className="light">
                                        <div className="dark"
                                             style={{height:this.state.planet_list && this.state.planet_list[2] ? this.state.planet_list[2].dark_height : '100px'}}
                                            >
                                        </div>
                                    </div>
                                </div>
                                <div className="middle"
                                     onClick={()=>{this.context.router.transitionTo('/single-planetDetail/2')}}>
                                    <div className="light">
                                        <div className="dark"
                                             style={{height:this.state.planet_list && this.state.planet_list[1] ? this.state.planet_list[1].dark_height : '100px'}}
                                            >
                                        </div>
                                    </div>
                                </div>
                                <div className="bottom"
                                     onClick={()=>{this.context.router.transitionTo('/single-planetDetail/1')}}>
                                    <div className="light">
                                        <div className="dark"
                                             style={{height:this.state.planet_list && this.state.planet_list[0] ? this.state.planet_list[0].dark_height : '100px'}}
                                            >
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div class="swiper-pagination"></div>
                    </div>
                </div>
            </div>
        )
    }
}

SingleGame_mainPage.contextTypes = {
    router: React.PropTypes.func.isRequired
};

/**
 * @function 星球详情-星球开始探索前
 */
class SingleGame_planetDetailBeforeExploringPage extends React.Component {

    /**Override*/
    /**
     * @function 默认构造器
     */
    constructor() {

        super();

        /**加载所需要的图片*/
        this.fanhui = require("../../img/返回箭头.png");

        /**初始化所有类与行内样式资源*/
        this.setStyleAndClass();

        this.state = this.getInitialState();


        /**绑定函数*/
        this.initData = this.initData.bind(this);

        this.onPlanetUnlockedClickHandler = this.onPlanetUnlockedClickHandler.bind(this);
    }

    getInitialState() {
        //获取今日的积分与任务
        singleGameModel.getTaskTargetAndInteractionValue().then((data)=> {
            console.log(data.interaction_value);
            console.log(data.taskTarget);
            //設置當前能量值
            this.setState({
                interaction_value: data.interaction_value,
                taskTarget: data.taskTarget,
            });

        });

        //獲取今日單人的能量值
        cordovaPluginService.singleGame().getTodaySingleGameRecord().then((data)=> {
            this.setState({
                energy: data.singleSteps == -1 ? 0 : data.singleSteps,//当前页面显示的能量值
                singleSteps: data.singleSteps//来自Native的实际的步数
            });
        });

        window.setInterval(()=> {

            cordovaPluginService.singleGame().getTodaySingleGameRecord().then((data)=> {
                this.setState({
                    energy: data.singleSteps == -1 ? 0 : data.singleSteps,//能量值计数
                    singleSteps: data.singleSteps//当前真实的部署
                });
            });

            this.forceUpdate();

        }, 1000);

        return {
            energy: 0,
            taskTarget: 5000,
            interaction_value: 0,
            planet_progress_description: '进度检测中。。。'
        }
    }

    /**LifeCycle*/
    /**
     * @function 组件渲染好之后的回调
     */
    componentDidMount() {

        //组件渲染好之后，进行页面缩放
        var page = new pageResponse({
            class: 'pageRespone',     //模块的类名，使用class来控制页面上的模块(1个或多个)
            mode: 'contain',     // auto || contain || cover
            width: '375',      //输入页面的宽度，只支持输入数值，默认宽度为320px
            height: '667'      //输入页面的高度，只支持输入数值，默认高度为504px
        })

        //为了防止有空白出现，将主界面的背景改为蓝色
        $("div#container").css("background", "RGB(40,40,52)");

        this.initData();
    }

    /**Style And Class Provider*/
    setStyleAndClass() {

    }

    /**Event Listener*/
    /**
     * @function 响应分享然后点击时间的回调
     */
    onPlanetUnlockedClickHandler() {

        var planet_id = this.props.params.planet_id;//获取当前星球的编号

        var self = this;//以闭包方式绑定当前this指针

        cordovaPluginService.getUserInfo().then((data)=> {

            if(!data.user_id){
                //Test
                data.user_id = 143309024663040478;
            }

            cordovaPluginService.socialUtils().doThirdShare(
                "http://m.live-forest.com/static/view/game/single/planet_unlock.html?type=game-single_planet_unlock&id=" + data.user_id + "_" + planet_id,
                "我在LiveForest中解锁了一颗星球"
            ).then(
                (data)=> {
                    //用户分享回调完成，请求后台解锁星球
                    singleGameModel.doPlanetUnlocked(planet_id).then((data)=> {
                        alert("恭喜您，解锁成功！");
                    });
                }
            );
        });


    }

    /**Inner Help*/
    initData() {
        //獲取今日單人的能量值
        cordovaPluginService.singleGame().getTodaySingleGameRecord().then((data)=> {
            this.setState({
                energy: data.singleSteps == -1 ? 0 : data.singleSteps,
                singleSteps: data.singleSteps
            });
        });

        var planet_id = this.props.params.planet_id;

        //获取星球详情
        singleGameModel.getPlanetList(0).then(
            (data)=> {

                //console.log(data);

                //console.log(data);
                this.setState({
                    planet_detail: data.planetList[planet_id - 1]
                });

                //根据星球详情判断当前星球的进度
                if (data.planetList[planet_id - 1].exploration_progress == 0) {
                    //尚未开始探险
                    this.setState({
                        planet_progress_description: "还在那遥远的地方"
                    });

                } else if (data.planetList[planet_id - 1].exploration_progress == 1 || data.planetList[planet_id - 1].has_shared == 0) {
                    //正在探险中
                    this.setState({
                        planet_progress_description: "正在探险中(" + (data.planetList[planet_id - 1].valid_days == -1 ? 0 : data.planetList[planet_id - 1].valid_days) + "/" + data.planetList[planet_id - 1].planet_need_days + ")"
                    });
                } else if (data.planetList[planet_id - 1].exploration_progress == 2 && data.planetList[planet_id - 1].has_shared == 1) {
                    //探险已经完成
                    this.setState({
                        planet_progress_description: "星球已经解锁"
                    });
                }

                //最后设置滚动条
                $(".sucai").niceScroll({
                    cursoropacitymax: 0//修改滚动条的颜色
                });
            }
        );

    }


    /**
     * @function 默认渲染函数
     */
    render() {

        //获取当前的props

        //注意，这边的return不可以换行
        return <div className="SingleGame_planetDetailPageBeforeExploring_container pageRespone">

            <div className="energy">
                <div>
                    <font><b>能量值</b></font>
                </div>
                <div>
                    <font>{this.state.energy}</font>
                </div>
            </div>

            <div className="hudong">
                <div>
                    <font><b>互动值</b></font>
                </div>
                <div>
                    <font>{this.state.interaction_value}</font>
                </div>
            </div>

            <div className="dialog">

                {/*星球名称*/}
                <div className="planetName">
                    <font><b>{this.state.planet_detail && this.state.planet_detail.planet_name ? this.state.planet_detail.planet_name : "神秘星球"}</b></font>
                </div>

                {/*星球探索进度*/}
                <div className="progress">
                    <font><b>{this.state.planet_progress_description}</b></font>
                </div>

                {/*星球描述*/}
                <div className="description sucai">
                    <font><b>{this.state.planet_detail && this.state.planet_detail.planet_description ? this.state.planet_detail.planet_description : "这是一颗神秘的星球，等着你去发现它的秘密"}</b></font>
                </div>

                {/*三种操作状态的判断*/}
                <div className="operation" style={
                        {
                            display:this.state.planet_detail //如果存在星球詳情
                             && this.state.planet_detail.exploration_progress == 1 //如果星球的狀態是正在探索中
                             ? "block" : "none"
                        }
                    }>
                    <div className="boost"
                         onClick={()=>{this.context.router.transitionTo('/single-planetBoost/' + this.props.params.planet_id);}}>
                        <span>加速</span>
                    </div>
                    <div className="start" onClick={()=>{

                            //判斷當前單人遊戲是否已經開始
                            if(globalGameStateModel.isTodaySingleGameOn()){
                                //否則直接跳轉
                                this.context.router.transitionTo('/single-planetOn');
                            }else{
                                //如果尚未開始，則設置開始然後跳轉
                                globalGameStateModel.setTodaySingleGameOn().then(()=>{
                                    this.context.router.transitionTo('/single-planetOn');
                                });
                            }

                        }}>
                        <span className="iosClick">开始</span>
                    </div>
                </div>
                <div className="operation" style={
                        {
                            display:this.state.planet_detail //如果存在星球詳情
                             && this.state.planet_detail.exploration_progress == 2  //如果星球的狀態是已經完成
                             && this.state.planet_detail.has_shared == 0 //并且还没有分享过
                             ? "block" : "none"
                        }
                    }>
                    <div className="share iosClick"
                         onClick={this.onPlanetUnlockedClickHandler}>
                        <span>分享解锁</span>
                    </div>
                </div>
                <div className="operation" style={
                        {
                            display:this.state.planet_detail //如果存在星球詳情
                             && this.state.planet_detail.exploration_progress == 2  //如果星球的狀態是已經完成
                             && this.state.planet_detail.has_shared == 1 //并且已经分享过
                             ? "block" : "none"
                        }
                    }>
                    <div className="treasureHunter iosClick"
                         onClick={()=>{alert("正在开垦中，请稍候！")}}>
                        <span>星球寻宝</span>
                    </div>
                </div>
            </div>

            {/*通用返回按钮*/}
            <div className="common_back iosClick" onClick={()=>{this.context.router.transitionTo('/single');}}>
                <img src={this.fanhui} alt="返回"/>
                <span>返回</span>
            </div>

        </div>

    }

}

SingleGame_planetDetailBeforeExploringPage.contextTypes = {
    router: React.PropTypes.func.isRequired
};

/**
 * @function 单人积分加速确认
 */
class SingleGame_planetBoostPage extends React.Component {

    /**Override*/
    /**
     * @function 默认构造器
     */
    constructor() {

        super();

        /**加载所需要的图片*/
        this.fanhui = require("../../img/返回箭头.png");

        /**设置当前的State*/
        this.state = this.getInitialState();

        this.handleOkClick = this.handleOkClick.bind(this);

    }

    getInitialState() {
        return {
            planet_exchange_rate: 5000
        }
    }

    /**LifeCycle*/
    /**
     * @function 组件渲染好之后的回调
     */
    componentDidMount() {

        //获取当前兑换一个有效天所需要的互动值
        singleGameModel.getExchangeRate(this.props.params.planet_id).then((data)=> {
            this.setState({
                planet_exchange_rate: data.planet_exchange_rate
            });
        });

        //组件渲染好之后，进行页面缩放
        var page = new pageResponse({
            class: 'pageRespone',     //模块的类名，使用class来控制页面上的模块(1个或多个)
            mode: 'contain',     // auto || contain || cover
            width: '375',      //输入页面的宽度，只支持输入数值，默认宽度为320px
            height: '667'      //输入页面的高度，只支持输入数值，默认高度为504px
        })

        //为了防止有空白出现，将主界面的背景改为蓝色
        $("div#container").css("background", "RGB(40,40,52)");
    }

    /**Event Handler*/
    /**
     * @function 处理OK按钮的点击事件
     */
    handleOkClick() {
        singleGameModel.doValidExchange(this.props.params.planet_id).then((data)=> {
            if (data.code == 0) {
                alert("兑换成功！");
            } else {
                alert("兑换失败，您的互动值不足或者已经通关该星球！");
            }
        });
    }

    /**Inner Help*/

    /**
     * @function 默认的渲染函数
     */
    render() {
        return (<div className="SingleGame_planetBoostPage_container pageRespone">

            <div className="dialog">

                <div className="description">
                    <div>
                        <span>消耗</span>
                        <span id="jifen">{this.state.planet_exchange_rate}</span>
                        <span>积分</span>
                    </div>
                    <div>
                        <span>加速</span>
                        <span id="tianshu">1</span>
                        <span>天</span>
                    </div>
                </div>


                <div className="operation">
                    <div className="ok iosClick" onClick={this.handleOkClick}>
                        <span>好</span>
                    </div>
                </div>
            </div>

            <div className="common_back iosClick" onClick={()=>{this.context.router.transitionTo('/single');}}>
                <img src={this.fanhui} alt=""/>
                <span>返回</span>
            </div>
        </div>)
    }

}

SingleGame_planetBoostPage.contextTypes = {
    router: React.PropTypes.func.isRequired
};

/**
 * @function 单人开始游戏
 */
class SingleGame_planetStartPage extends React.Component {

    constructor() {


        super();

        /**加载所需要的资源*/
        this.baise = require("../../img/白色板.png");
        this.beijing = require("../../img/星空.png");
        this.xingqiu = require("../../img/按钮L.png");
        this.fanhui = require("../../img/返回箭头.png");

        /**绑定函数*/
        this.onStartClickHandler = this.onStartClickHandler.bind(this);

    }

    /**LifeCycle*/
    /**
     * @function 组件渲染好之后的回调
     */
    componentDidMount() {
        //组件渲染好之后，进行页面缩放
        var page = new pageResponse({
            class: 'pageRespone',     //模块的类名，使用class来控制页面上的模块(1个或多个)
            mode: 'contain',     // auto || contain || cover
            width: '375',      //输入页面的宽度，只支持输入数值，默认宽度为320px
            height: '667'      //输入页面的高度，只支持输入数值，默认高度为504px
        })

        //为了防止有空白出现，将主界面的背景改为蓝色
        $("div#container").css("background", "RGB(40,40,52)");
    }

    /**Event Handler*/
    /**
     * @function 响应开始游戏的点击
     */
    onStartClickHandler() {
        //判断是否有正在进行的多人游戏，如果存在则先放弃那个多人游戏
        if (globalGameStateModel.isMultipleGameOn() != null) {
            //如果当前存在正在进行多人任务，则先关闭该任务
            globalGameStateModel.setMultipleGameOff(globalGameStateModel.isMultipleGameOn());
        }

        //alert(JSON.parse(window.localStorage.getItem("getTaskTargetAndInteractionValue_cache")).taskTarget);

        //尝试开始单人游戏
        globalGameStateModel.setTodaySingleGameOn(JSON.parse(window.localStorage.getItem("getTaskTargetAndInteractionValue_cache")).taskTarget).then((data)=> {

            //跳转到正在游戏界面
            this.context.router.transitionTo('/single-planetOn');

        });
    }

    /**
     * @function 默认渲染函数
     * @returns {XML}
     */
    render() {


        //獲取當前的星球參數
        //alert(this.props.params.planet_id);

        return (<div className="SingleGame_planetStartPage_container pageRespone">
            <div className="dialog">
                <span className="span1">这是一个神秘的星球</span>
                <span className="span2">等待你来</span>
                <span className="span3">发现它的秘密......</span>
            </div>
            <div className="button iosClick" onClick={this.onStartClickHandler}>
                <span className="span1">我知道了</span><br/>
                <span className="span2">开始游戏!</span>
            </div>
            <div className="common_back iosClick" onClick={()=>{this.context.router.transitionTo('/single');}}>
                <img src={this.fanhui} alt=""/>
                <span>返回</span>
            </div>
        </div>)


    }

}

SingleGame_planetStartPage.contextTypes = {
    router: React.PropTypes.func.isRequired
};

/**
 * @function 单人正在游戏
 */
class SingleGame_planetOnPage extends React.Component {

    constructor() {

        super();

        this.state = this.getInitialState();

        /**绑定内部函数*/
        this.showMessage = this.showMessage.bind(this);

        this.handleGiveup = this.handleGiveup.bind(this);

        /**加载所需要的资源*/
        this.qi = require("../../img/旗.png");
        this.progress = require("../../img/进度条.png");
        this.xingqiu = require("../../img/planets/light/星球1.png");
        this.fanhui = require("../../img/返回箭头.png");
        this.x = require("../../img/X.png");
    }

    getInitialState() {
        return {
            dialog_title: '标题',//设置弹窗的标题
            dialog_content: '内容',//设置弹窗的内容
            dialog_option: "",//设置弹窗的操作,
            current_target:0,//當期目標
            current_steps:0//當前步數
        }

    }

    /**LifeCycle*/
    /**
     * @function 组件渲染好之后的回调
     */
    componentDidMount() {

        //组件渲染好之后，进行页面缩放
        var page = new pageResponse({
            class: 'pageRespone',     //模块的类名，使用class来控制页面上的模块(1个或多个)
            mode: 'contain',     // auto || contain || cover
            width: '375',      //输入页面的宽度，只支持输入数值，默认宽度为320px
            height: '667'      //输入页面的高度，只支持输入数值，默认高度为504px
        });

        //为了防止有空白出现，将主界面的背景改为蓝色
        $("div#container").css("background", "RGB(40,40,52)");

        //判断当前是出于单人模式还是多人模式
        if (globalGameStateModel.isTodaySingleGameOn()) {
            //如果当前是单人模式

            //获取当前的步数与目标值
            var taskTarget = parseInt(JSON.parse(window.localStorage.getItem("getTaskTargetAndInteractionValue_cache")).taskTarget);

            //將當期步數設置為全局的目標
            this.setState({
                current_target:taskTarget
            });

            //获取当前计步值
            //開啟計時器，定期獲取當前能量值
            var int = window.setInterval(()=> {

                cordovaPluginService.singleGame().getTodaySingleGameRecord().then((data)=> {

                    //data.singleSteps = 10000;//测试代码，强制设置singleSteps的值为超过taskTarget

                    //判断当前计数是否已经到达了今日的目标
                    if (data.singleSteps > taskTarget) {

                        //window.localStorage.setItem(moment().format("YYYY-MM-D"),true);//测试代码,强制设置今日已经完成目标

                        if (globalGameStateModel.isTodaySingleGameFinished()) {

                            //如果已经汇报过完成今日任务,彈窗提示用戶
                            this.showMessage("抱歉", "飞船已经耗尽能源，请明日再来~");

                        } else {
                            //调用后台完成今日任务的接口
                            singleGameModel.doTaskComplete(data.singleSteps, localStorage.getItem("singleGame_CurrentPlanetId")
                            ).then((data)=> {

                                    if (data.code == 0) {

                                        if (data.subCode && data.subCode == 3) {

                                            //如果用户已经通过当前星球
                                            this.showMessage("抱歉", "该星球已经解锁，请飞往下一个星球~");

                                        } else if (data.subCode && data.subCode == 6) {

                                            //如果用户完成今日任务后，已经可以解锁该星球
                                            this.showMessage("恭喜完成", "你已经探索完整个星球，可以把它分享给小伙伴来进行解锁！");

                                            globalGameStateModel.setTodaySingleGameFinished();

                                        } else {

                                            this.showMessage("恭喜完成", "你已经完成今日的单人游戏任务，太棒啦！");

                                            //如果用户完成今日任务
                                            globalGameStateModel.setTodaySingleGameFinished();
                                        }
                                    }

                                });
                        }

                        //计算当前星球的移动比率
                        var ratio = 75;

                        this.setState({
                            planet_left: ratio
                        });

                        //強制更新當前頁面
                        this.forceUpdate();


                        //如果已经完成了今日的任务，则取消定时器
                        clearInterval(int);

                        return;
                    }

                    //计算当前星球的移动比率
                    var ratio = 9 + 66 * (data.singleSteps / taskTarget);

                    this.setState({
                        planet_left: ratio,
                        current_steps:data.singleSteps
                    });

                    //強制更新當前頁面
                    this.forceUpdate();
                });


            }, 2000);

        } else if (globalGameStateModel.isMultipleGameOn()) {

            //获取到当前的任务信息
            multipleGameModel.getMyCurrentMultiGameInfo(1).then((data)=> {

                //从缓存中获取当前的数据
                var taskTarget = data.multiGameInfo.task_goal;//获取任务目标

                var taskId = data.multiGameInfo.task_id;

                this.taskId = taskId;

                //启动定时器，定期获取当前计步值
                var int = window.setInterval(()=> {
                    cordovaPluginService.multipleGame().getMultipleGameRecord(taskId).then((data)=> {

                        //判斷當前計步值是否達到了目標
                        if (data > taskTarget) {

                            //如果已經查過了目標，则提交后台完成任务，并且关闭底层计步器
                            multipleGameModel.doMultiGameOperate(taskId, 4).then((data)=> {

                                console.log(data);

                                //关闭底层计步器
                                cordovaPluginService.multipleGame().stopMultipleGameRecord(taskId).then((data)=> {

                                    //展示信息
                                    this.showMessage("恭喜", "恭喜您成功完成了该挑战！");

                                    //设置当前多人游戏模式结束
                                    globalGameStateModel.setMultipleGameOff(taskId);

                                    //关闭计时器
                                    clearInterval(int);

                                    //5秒之后，跳回到多人游戏主界面
                                    //跳回到主頁
                                    setTimeout(()=> {
                                        this.context.router.transitionTo('/multiple');
                                    }, 5000);
                                });
                            });
                        } else {
                            //如果尚未達到目標，則僅開始計算比例
                            //计算当前星球的移动比率
                            var ratio = 9 + 66 * (data / taskTarget);

                            this.setState({
                                planet_left: ratio
                            });

                            //强制更新当前界面
                            this.forceUpdate();
                        }

                    });
                }, 2000);
            });

        } else {
            //如果单人模式与多人模式都还没有开始，则跳回到主页面
            this.context.router.transitionTo('/single');
        }


    }

    /**Event*/
    /**
     * @function 处理点击放弃按钮的事件
     */
    handleGiveup() {

        if (globalGameStateModel.isTodaySingleGameOn()) {

            //如果当前正在单人游戏
            //设置当前放弃单人游戏
            globalGameStateModel.setTodaySingleGameOff().then(
                (data)=> {
                    //跳回到主界面
                    this.context.router.transitionTo('/single');
                }
            );
        } else if (globalGameStateModel.isMultipleGameOn()) {
            //如果当前正在多人游戏

            //首先调用后台接口，放弃该任务
            multipleGameModel.doMultiGameOperate(this.taskId, 3).then((data)=> {

                //調用本地接口，關閉計步器
                globalGameStateModel.setMultipleGameOff(this.taskId).then((data)=> {

                    //调回到主界面
                    this.context.router.transitionTo('/multiple');
                });
            });


        }


    }

    /**Inner Help*/
    /**
     * @function
     * @param title
     * @param content
     */
    showMessage(title, content, call) {

        //构造操作选项
        this.setState({
            dialog_title: title,
            dialog_content: content,
            dialog_option: "ok"
        });
        //显示窗体
        this.refs.modal.show();

    }

    /**
     * @function 渲染函数
     * @returns {XML}
     */
    render() {

        //判断弹窗应该构造什么操作
        let dialog_option;

        if (this.state.dialog_option == "ok") {

            dialog_option = (<div className="dialog-option-ok iosClick" onClick={()=>{this.refs.modal.hide()}}>
                <span>好</span>
            </div>);

        } else if (this.state.dialog_option == "giveUp") {
            //如果用户点击了放弃按钮，则弹出选择框

            dialog_option = (<div className="dialog-option-giveUp">
                <div className="cancel iosClick" onClick={()=>{this.refs.modal.hide()}}><span>取消</span></div>
                <div className="giveUp iosClick" onClick={this.handleGiveup}><span>放弃</span></div>
            </div>);

        }

        return (
            <div className="SingleGame_planetOnPage_container pageRespone">

                <div className="label specialFont">
                    <span>
                        {this.state.current_steps}
                    </span>
                    <span>
                        步
                    </span>
                </div>

                <div className="progress">
                    <div id="qi" alt=""/>
                    <img src={this.progress} id="progress" alt=""/>
                    <img src={this.xingqiu} id="xingqiu" alt="" style={{
                        left:this.state && this.state.planet_left ? this.state.planet_left + "%" : "9%"
                    }}/>
                    <div id="target">
                        <span>{this.state.current_target}</span>
                    </div>
                </div>

                <div className="operation">
                    <div className="back iosClick">
                        <img src={this.fanhui} alt="返回" onClick={()=>{this.context.router.transitionTo('/single');}}/>
                        <span>返回</span>
                    </div>
                    <div className="giveUp iosClick">
                        <img src={this.x} alt="放弃" onClick={()=>{
                                this.setState({
                                    dialog_title: "确认要放弃吗？",
                                    dialog_content: "单人模式下放弃会暂停能量值计算，并不会清空今日已获能量值",
                                    dialog_option: "giveUp"
                                });
                                //显示窗体
                                this.refs.modal.show();
                        }}/>
                        <span>放弃</span>
                    </div>
                </div>
                {/*弹窗*/}
                <ModalDialog ref="modal" title={this.state.dialog_title} content={this.state.dialog_content}>
                    {dialog_option}
                </ModalDialog>
            </div>
        )
    }


}

SingleGame_planetOnPage.contextTypes = {
    router: React.PropTypes.func.isRequired
};

/**
 * @function 单人解鎖界面 解锁 解锁
 */
class SingleGame_planetUnlockPage extends React.Component {
    constructor() {

        super();


        /**加载所需要的资源*/
        this.qi = require("../../img/旗.png");
        this.progress = require("../../img/进度条.png");
        this.xingqiu = require("../../img/planets/light/星球1.png");
        this.fanhui = require("../../img/返回箭头.png");
        this.x = require("../../img/X.png");
    }

    render() {
        return (<div className="SingleGame_planetUnlockPage_container pageRespone">
            <div className="dialog">
                <span className="span1">恭喜你！</span>
                <span className="span2">你已解锁土星</span>
                <span className="span3">分享给好友</span>
                <span className="span4">让小伙伴帮你</span>
                <span className="span5">守护星球</span>
                <span className="span6">分享</span>

            </div>
            <div className="common_back iosClick" onClick={()=>{this.context.router.transitionTo('/single');}}>
                <img src={this.fanhui} alt="返回" onClick={()=>{this.context.router.transitionTo('/single');}}/>
                <span>返回</span>
            </div>
        </div>)
    }

    componentDidMount() {
        //组件渲染好之后，进行页面缩放

        var page = new pageResponse({
            class: 'pageRespone',     //模块的类名，使用class来控制页面上的模块(1个或多个)
            mode: 'contain',     // auto || contain || cover
            width: '375',      //输入页面的宽度，只支持输入数值，默认宽度为320px
            height: '667'      //输入页面的高度，只支持输入数值，默认高度为504px
        })

        //为了防止有空白出现，将主界面的背景改为蓝色
        $("div#container").css("background", "RGB(40,40,52)");
    }

}

SingleGame_planetUnlockPage.contextTypes = {
    router: React.PropTypes.func.isRequired
};


export {
    SingleGame_mainPage,//游戏主界面
    SingleGame_planetDetailBeforeExploringPage,//星球详情界面
    SingleGame_planetBoostPage,//星球加速
    SingleGame_planetStartPage,//星球开始游戏
    SingleGame_planetOnPage,//正在遊戲
    SingleGame_planetUnlockPage//單人解鎖遊戲
}