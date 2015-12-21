'use strict'

import React from "libs/react.js";
var Swiper = require('libs/swiper.jquery.umd.js');
var $ = require('jquery');
var pageResponse = require("pageResponse");
var Textarea = require('../textarea/TextareaAutoSize.js');
var moment = require('libs/moment.min.js');

//引入CSS文件
require('./multipleGame.scss');

import {PromptDialog,ModalDialog} from "../widgets/dialog/modalDialog.jsx";

/**数据模型层文件引入*/
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

    //将用户数据存放到localStorage中
    window.localStorage.setItem("userInfo", JSON.stringify(data));

    //利用獲取到的user_token構造多人遊戲數據模型
    singleGameModel = new SingleGameModel(data.user_token);

    //構造多人模式數據模型
    multipleGameModel = new MultipleGameModel(data.user_token);

});

/**
 * @function 多人游戏通用父组件
 */
class MultipleGame_commonComponents extends React.Component {

    /**
     * @function 默认通用构造方法
     */
    constructor() {
        super();
    }


    /**
     * @function 默认通用挂载好的回调
     */
    componentDidMount() {
        //组件渲染好之后，进行页面缩放

        var page = new pageResponse({
            class: 'pageResponse',     //模块的类名，使用class来控制页面上的模块(1个或多个)
            mode: 'contain',     // auto || contain || cover
            width: '375',      //输入页面的宽度，只支持输入数值，默认宽度为320px
            height: '667'      //输入页面的高度，只支持输入数值，默认高度为504px
        });

        //为了防止有空白出现，将主界面的背景改为蓝色
        //$("div#container").css("background", "RGB(40,40,52)");
    }
}

/**
 * @function 多人游戏 主界面
 */
class MultipleGame_mainPage extends React.Component {

    /**Override*/
    /**
     * @function 默认构造器
     */
    constructor() {

        super();

        /**加载所需要的图片*/
        this.gangbi = require("../../img/钢笔.png");
        this.xingxiang = require("../../img/信箱.png");
        this.qingdan = require("../../img/清单.png");
        this.fanhui = require("../../img/返回箭头.png");

        /**初始化所有类与行内样式资源*/
        this.setStyleAndClass();
    }



    /**LifeCycle*/
    /**
     * @function 组件渲染好之后的回调
     */
    componentDidMount() {
        //组件渲染好之后，进行页面缩放
        var page = new pageResponse({
            class: 'pageResponse',     //模块的类名，使用class来控制页面上的模块(1个或多个)
            mode: 'contain',     // auto || contain || cover
            width: '375',      //输入页面的宽度，只支持输入数值，默认宽度为320px
            height: '667'      //输入页面的高度，只支持输入数值，默认高度为504px
        });

        $("div#container").css("background", "RGB(40,40,52)");
        //为了防止有空白出现，将主界面的背景改为蓝色

    }

    /**Style And Class Provider*/
    setStyleAndClass() {

    }

    /**Event Listener*/

    /**
     * @function 默认渲染函数
     */
    render() {
        //注意，这边的return不可以换行
        return <div className="MultipleGame_mainPage_container pageResponse">
            <div className="MultipleGame_mainPage_taskCreate iosClick"
                 onClick={()=>{this.context.router.transitionTo('/multiple-create');}}>
                <span className="HannotateSC">发起任务</span>
                <img src={this.gangbi} alt=""/>
            </div>
            <div className="MultipleGame_mainPage_myInvitation iosClick"
                 onClick={()=>{this.context.router.transitionTo('/multiple-invitation');}}>
                <span className="HannotateSC">我的邀请</span>
                <img src={this.xingxiang} alt=""/>
            </div>
            <div className="MultipleGame_mainPage_history iosClick"
                 onClick={()=>{this.context.router.transitionTo('/multiple-history');}}>
                <span className="HannotateSC">历史记录</span>
                <img src={this.qingdan} alt=""/>
            </div>
            <div className="MultipleGame_mainPage_back iosClick" onClick={()=>{this.context.router.transitionTo('/single');}}>
                <span className="HannotateSC">返回</span>
                <img src={this.fanhui} alt=""/>
            </div>

        </div>
    }

}

MultipleGame_mainPage.contextTypes = {
    router: React.PropTypes.func.isRequired
};

/**
 * @function 多人游戏，创建任务
 */

class MultipleGame_taskCreatePage extends React.Component {

    /**Override*/
    /**
     * @function 默认构造器
     */
    constructor() {

        super();

        /**加载所需要的图片*/
        this.fanhui = require("../../img/返回箭头.png");

        //加载初始化state
        this.state = this.getInitialState();


        /**初始化所有类与行内样式资源*/
        this.setStyleAndClass();

        /**绑定类方法*/
        this.handleTextareaFocus = this.handleTextareaFocus.bind(this);
        this.handleSendClick = this.handleSendClick.bind(this);
        this.handleOkClick = this.handleOkClick.bind(this);
    }

    getInitialState() {
        return {
            task_time_limit: undefined,
            task_goal: undefined,
            task_description: "填写给好友的奖励",
            task_leave_words: "给朋友留言吧",
            to_who: undefined
        }
    }

    /**LifeCycle*/
    /**
     * @function 组件渲染好之后的回调
     */
    componentDidMount() {
        //组件渲染好之后，进行页面缩放
        var page = new pageResponse({
            class: 'pageResponse',     //模块的类名，使用class来控制页面上的模块(1个或多个)
            mode: 'contain',     // auto || contain || cover
            width: '375',      //输入页面的宽度，只支持输入数值，默认宽度为320px
            height: '667'      //输入页面的高度，只支持输入数值，默认高度为504px
        });

        //为了防止有空白出现，将主界面的背景改为蓝色
        $("div#container").css("background", "RGB(40,40,52)");

    }

    /**Style And Class Provider*/
    setStyleAndClass() {

    }

    /**Event Listener*/

    handleTextareaFocus(event) {


        if (this.state.task_description == "填写给好友的奖励" && event.target.id == "task_description") {
            this.setState({
                task_description: "",
            });
        }

        if (this.state.task_leave_words == "给朋友留言吧" && event.target.id == "task_leave_words") {
            this.setState({
                task_leave_words: "",
            });
        }
    }

    /**
     * @function 响应点击发送按钮的事件
     * @param event
     */
    handleSendClick(event) {

        //判断用户信息是否填写完毕
        if (!this.state.task_time_limit || !this.state.task_goal || !this.state.task_description || !this.state.task_leave_words || !this.state.to_who) {

            alert("请填写完整游戏信息！");
            return;
        } else {
            //向服务器发起创建多人游戏的请求
            multipleGameModel.doMultiGameCreate(
                this.state.task_time_limit,
                this.state.task_goal,
                this.state.task_description,
                this.state.task_leave_words,
                this.state.to_who
            ).then((data)=> {

                    //console.log(data);
                    if (data.code == 0) {

                        //将返回的task_id存入当前类
                        this.task_id = data.task_id;

                        //创建成功后，弹出提示框
                        this.refs.promptDialog.show();
                    }

                });
        }
    }

    /**
     * @function 响应弹出框的OK事件
     */
    handleOkClick() {

        cordovaPluginService.socialUtils().doThirdShare(
            "http://m.live-forest.com/static/view/game/game_invite_detail.html?type=game-game_invite_detail&id=" + this.task_id,
            this.state.task_leave_words
        ).then((data)=> {
                //分享成功后，跳回到多人游戏主界面
                this.context.router.transitionTo('/multiple');
            });

    }

    /**
     * @function 默认渲染函数
     */
    render() {

        var rootClassName = {
            'MultipleGame_taskCreatePage_container': true,
            'pageResponse': true
        }

        //注意，这边的return不可以换行
        return <div className="MultipleGame_taskCreatePage_container pageResponse">

            {/*主表单*/}
            <div className="MultipleGame_taskCreatePage_form">
                {/*填写要邀请的对象*/}
                <div className="To">
                    <span>To:</span>
                    <input type="text" placeholder="亲爱的小伙伴们"
                           onChange={(event)=>{ this.setState({to_who:event.target.value}) }}/>
                </div>

                {/*填写任务要求和目标*/}
                <div className="Task">
                    <input type="number" id="task_time_limit" placeholder="3"
                           onChange={(event)=>{ this.setState({task_time_limit:event.target.value}) }}/>
                    <span className="HannotateSC">小时行走</span>
                    <input type="number" id="task_goal" placeholder="7777"
                           onChange={(event)=>{ this.setState({task_goal:event.target.value}) }}/>
                    <span className="HannotateSC">步</span>
                </div>

                <div className="description">
                    <Textarea
                        id="task_description"
                        minRows={1}
                        maxRows={3}
                        value={this.state.task_description}
                        onFocus={this.handleTextareaFocus}
                        onChange={e => this.setState({task_description: e.target.value})}
                        >
                    </Textarea>
                </div>
                <div className="leave_words">
                    <Textarea
                        id="task_leave_words"
                        minRows={1}
                        maxRows={3}
                        value={this.state.task_leave_words}
                        onFocus={this.handleTextareaFocus}
                        onChange={e => this.setState({task_leave_words: e.target.value})}
                        >
                    </Textarea>
                </div>

                <div id="send" onClick={this.handleSendClick}>
                    <span className="HannotateSC">发送</span>
                </div>
            </div>

            {/*通用返回按钮*/}
            <div className="common_back" onClick={()=>{this.context.router.transitionTo('/multiple');}}>
                <img src={this.fanhui} alt=""/>
                <span>返回</span>
            </div>

            {/*通用弹窗*/}
            <PromptDialog okClick={this.handleOkClick} ref="promptDialog" title="恭喜"
                          content="多人游戏创建成功，赶快分享给你的小伙伴们吧！"></PromptDialog>

        </div>
    }


}

MultipleGame_taskCreatePage
    .
    contextTypes = {
    router: React.PropTypes.func.isRequired
};
/**
 * @function 多人游戏，我的邀请
 */
class MultipleGame_myInvitationPage extends React
    .
    Component {

    /**構造器*/
    constructor() {

        super();

        //加载图片
        this.fanhui = require("../../img/返回箭头.png");

        this.invitation_list = [];

        this.data_invitation_list = [];

        //加载初始化的State
        this.state = this.getInititalState();

        this.handleOperationClick = this.handleOperationClick.bind(this);

    }

    /**
     * @function 获取初始State
     */
    getInititalState() {
        return {
            ignore_list: []//存放本次已经被忽略的邀请列表
        }
    }

    /**Event Listener*/
    handleOperationClick(params) {

        //console.log(params);

        //判断按钮的类型
        if (params.type == "ignore") {
            //如果点击了忽略按钮
            multipleGameModel.doMultiGameOperate(params.task_id, 1).then((data)=> {

                //console.log(data);
                //如果操作成功

                //将该条记录加入忽略列表
                this.state.ignore_list.push(params.task_id);

                //使用jQuery进行显示控制
                $("#operation_common_" + params.task_id).hide();
                $("#operation_ignore_" + params.task_id).show();

                //console.log(this.data_invitation_list);
            });
        }

        if (params.type == "accept") {

            //判断当前是否有正在进行的单人任务
            if (globalGameStateModel.isTodaySingleGameOn()) {
                //如果正在进行单人任务，则提示用户，是否需要关闭单人任务
                this.refs.promptDialog_with_single.show();

            } else {
                //如果点击了接受按钮
                multipleGameModel.doMultiGameOperate(params.task_id, 2).then((data)=> {
                    //console.log(data);

                    //设置开启本地的多人计步模式
                    globalGameStateModel.setMultipleGameOn(params.task_id, params.task_goal);

                    //跳转到正在游戏的界面
                    this.context.router.transitionTo('/single-planetOn');
                });
            }
        }

    }

    /**LifeCycle*/
    componentDidMount() {

        multipleGameModel.getMyInvitationList().then((data)=> {

            //console.log(data);

            this.data_invitation_list = data.invitationList;

            //判断用户的邀请列表是否为空
            if (data.invitationList.length > 0) {
                for (var i = 0; i < data.invitationList.length; i++) {

                    var d = data.invitationList[i];

                    this.invitation_list.push(
                        <div className="swiper-slide-invitation">
                            {/*邀请的发起者*/}
                            <div className="to">
                                {/*发起者的名称*/}
                                <span id="inviter">{d.user_nickname == "-10086" ? "小伙伴" : d.user_nickname}</span>
                                <span>邀请</span>
                                {/*被邀请者的昵称*/}
                                <span id="to">{d.task_description}</span>
                            </div>
                            <div className="task">
                                {/*时间限制*/}
                                <div id="task_time_limit">
                                    <span>{d.task_time_limit}</span>
                                </div>
                                <span>小时行走</span>

                                <div id="task_goal">{d.task_goal}</div>
                                <span>步</span>
                            </div>
                            {/*任务的奖励*/}
                            <div className="task_description">
                        <span id="task_description">
                            {d.task_description}
                        </span>
                            </div>
                            {/*发起者的留言*/}
                            <div className="task_leave_words">
                        <span id="task_leave_words">
                            {d.task_leave_words}

                        </span>
                            </div>
                            {/*操作部分-显示在正常选择状态下*/}
                            <div className="operation" id={"operation_common_" + d.task_id} style={
                            {
                                display:$.inArray(d.task_id,this.state.ignore_list) == -1 ? "block":"none"
                            }
                        }>
                                <div className="ignoreButton">

                                <span className="HannotateSC"
                                      onClick={this.handleOperationClick.bind(this,{type:"ignore",task_id:d.task_id,task_goal:d.task_goal})}>忽略</span>
                                </div>
                                <div className="accpetButton">
                                <span className="HannotateSC"
                                      onClick={this.handleOperationClick.bind(this,{type:"accept",task_id:d.task_id,task_goal:d.task_goal})}>接受</span>
                                </div>
                            </div>
                            {/*操作部分-显示在已忽略的卡片下*/}
                            <div className="operation" id={"operation_ignore_" + d.task_id} style={
                            {
                                display:$.inArray(d.task_id,this.state.ignore_list) == -1 ? "none":"block"
                            }
                        }>
                                <div className="ignoreButton-center">
                                    <span className="HannotateSC">已忽略</span>
                                </div>
                            </div>
                        </div>
                    );
                }

                this.forceUpdate();
            } else {
                //如果邀请列表为空则显示邀请列表
                this.refs.promptDialog.show();
            }


            var page = new pageResponse({
                class: 'pageResponse',     //模块的类名，使用class来控制页面上的模块(1个或多个)
                mode: 'contain',     // auto || contain || cover
                width: '375',      //输入页面的宽度，只支持输入数值，默认宽度为320px
                height: '667'      //输入页面的高度，只支持输入数值，默认高度为504px
            });

            var swiper = new Swiper('.invitation-container', {
                slideClass: 'swiper-slide-invitation',
                scrollbar: '.swiper-scrollbar',
                scrollbarHide: true,
                slidesPerView: 'auto',
                centeredSlides: true,
                spaceBetween: 30,
                grabCursor: true
            });

            //为了防止有空白出现，将主界面的背景改为蓝色
            $("div#container").css("background", "RGB(40,40,52)");


        });

    }

    /**Event Listener*/

    /**
     *
     * */
    render() {


        return <div className="MultipleGame_myInvitationPage_container pageResponse">
            <div className="invitation-container">
                <div className="swiper-wrapper">
                    {this.invitation_list}
                </div>
                <div className="swiper-scrollbar"></div>
            </div>
            {/*通用返回按钮*/}
            <div className="common_back" onClick={()=>{this.context.router.transitionTo('/multiple');}}>
                <img src={this.fanhui} alt=""/>
                <span className="HannotateSC">返回</span>
            </div>

            {/*模态窗口*/}
            <PromptDialog ref="promptDialog" title="啥都没有" content="你还没有接到任何邀请，赶快邀请你的小伙伴一起游戏吧~" okClick={()=>{
                this.context.router.transitionTo('/multiple');
            }
            }></PromptDialog>

            <PromptDialog ref="promptDialog_with_single" title="抱歉" content="你正在进行单人任务，请先暂停单人任务再接受多人任务" okClick={()=>{
                this.context.router.transitionTo('/single-planetOn');
            }
            }></PromptDialog>
        </div>
    }

}

MultipleGame_myInvitationPage.contextTypes = {
    router: React.PropTypes.func.isRequired
};

/**
 * @function 多人游戏 历史记录
 */
class MultipleGame_historyPage extends React.Component {

    /**Override*/
    /**
     * @function 默认构造器
     */
    constructor() {

        super();

        //加载图片
        this.danren = require("../../img/单 人.png");
        this.fanhui = require("../../img/返回箭头.png");
        this.chenggongyinzhang = require("../../img/成功印章.png");

        //初始化类成员
        //发起历史列表
        this.create_history_list = [];

        //接受历史列表
        this.attend_history_list = [];

        //设置当前的state
        this.state = this.getInitialState();

        //进行函数绑定
        this.initData = this.initData.bind(this);
    }

    /**LifeCycle*/
    /**
     * @function 获取初始的状态
     */
    getInitialState() {

        return {
            index: 0,//默认当前展示发起历史
        }

    }

    /**
     * @function 组件加载好之后
     */
    componentDidMount() {
        //组件渲染好之后，进行页面缩放
        var page = new pageResponse({
            class: 'pageResponse',     //模块的类名，使用class来控制页面上的模块(1个或多个)
            mode: 'contain',     // auto || contain || cover
            width: '375',      //输入页面的宽度，只支持输入数值，默认宽度为320px
            height: '667'      //输入页面的高度，只支持输入数值，默认高度为504px
        });

        //为了防止有空白出现，将主界面的背景改为蓝色
        $("div#container").css("background", "RGB(40,40,52)");


        //調用下setState方法，通知數據更新
        this.forceUpdate();

        //进行滚动栏设置
        $("#list").niceScroll({
            cursoropacitymax: 0//修改滚动条的颜色
        });

        //初始化所有的数据
        this.initData();

    }

    /**Event*/
    handleOptionClick(index) {
        this.setState({index: index});
    }

    /**Inner Help*/
    initData() {

        //获取数据

        //构造我发起的历史记录
        multipleGameModel.getMultiGameCreateList().then((data)=> {

            //界面渲染號之後，進行數據構造
            for (var i = 0; i < data.multiGameList.length; i++) {

                //console.log(data);
                //console.log(data.multiGameList[i].task_id);

                var task_id = data.multiGameList[i].task_id;

                this.create_history_list.push(
                    <div className="item"
                         onClick={()=>{
                            this.context.router.transitionTo("/multiple-detail/" + task_id)}
                         }>
                        <div className="left">
                            {/*用戶頭像*/}
                            <img src={"" + data.multiGameList[i].user_logo_img_path} alt=""/>
                        </div>
                        <div className="right">
                            <div className="task">
                                <span className="current">{data.multiGameList[i].task_time_limit}</span>
                                <span className="HannotateSC">小时，走</span>
                                <span className="current">{data.multiGameList[i].task_goal}</span>
                                <span className="HannotateSC">步</span>
                            </div>
                            <div className="duration">
                                <span>
                                    {moment.unix(data.multiGameList[i].task_create_time / 1000).format("YYYY/MM/D")}
                                </span>
                            </div>
                            <div className="stamp">
                                <img src={this.chenggongyinzhang} alt=""/>
                            </div>
                        </div>
                    </div>
                );
            }

            this.forceUpdate();


        });

        //构造我参与的历史记录
        multipleGameModel.getMultiGameAttendList().then((data)=> {

            for (var i = 0; i < data.multiGameList.length; i++) {
                //console.log(data.multiGameList[i]);
                this.attend_history_list.push(
                    <div className="item"
                         onClick={()=>{ this.context.router.transitionTo("/multiple-detail/" + data.multiGameList[i].task_id) }}>
                        <div className="left">
                            {/*用戶頭像*/}
                            <img src={this.chenggongyinzhang} onClick={()=>{}} alt=""/>
                        </div>
                        <div className="right">
                            <div className="task">
                                <span>{data.multiGameList[i].task_time_limit}</span>
                                <span className="HannotateSC">天，走</span>
                                <span>{data.multiGameList[i].task_goal}</span>
                                <span className="HannotateSC">步</span>
                            </div>
                            <div className="duration">
                            <span>
                                {moment.unix(data.multiGameList[i].task_create_time / 1000).format("YYYY/MM/D")}
                            </span>
                            <span>
                                -
                            </span>
                                <span>{
                                    data.multiGameList[i].task_end_time ?
                                        moment.unix(data.multiGameList[i].task_end_time / 1000).format("YYYY/MM/D") :
                                        moment().format("YYYY/MM/D")
                                }
                                </span>
                            </div>
                        </div>
                        <div className="stamp" style={
                            {
                                display:data.multiGameList[i].task_schedule == 4 ? "block":"none"
                            }
                        }>
                            <img src={this.chenggongyinzhang} alt=""/>
                        </div>
                    </div>
                );
            }

        });


    }

    /**
     * @function 返回构造的历史记录界面
     */
    render() {

        if (this.state.index == 0) {
            //如果下标为0 展示发起的历史记录
            this.list = this.create_history_list;
        }
        else {
            //如果下标为1，展示接受的历史记录
            this.list = this.attend_history_list;
        }

        return (
            <div className="MultipleGame_historyPage_container pageResponse">
                <div className="history_container">
                    <span className="title HannotateSC">查看历史</span>

                    <div className="option">
                        <span id="create" className={this.state.index == 0 ? "current" : ""}><button
                            className="HannotateSC" onClick={this.handleOptionClick.bind(this, 0)}>发起历史
                        </button></span>
                        <span>|</span>
                        <span id="accept" className={this.state.index == 1 ? "current" : ""}><button
                            className="HannotateSC" onClick={this.handleOptionClick.bind(this, 1)}>接受历史
                        </button></span>
                    </div>
                    <div className="list" id="list">
                        {this.list}
                    </div>
                </div>


                {/*通用返回按钮*/}
                <div className="common_back" onClick={()=> {
                            this.context.router.transitionTo('/multiple');
                        }}>
                    <img src={this.fanhui} alt=""/>
                    <span className="HannotateSC">返回</span>
                </div>
            </div>
        );

    }
}

MultipleGame_historyPage.contextTypes = {
    router: React.PropTypes.func.isRequired
};

/**
 * @function 多人游戏 任务详情
 */
class MultipleGame_detailPage extends React.Component {

    /**Override*/
    /**
     * @function 默认构造器
     */
    constructor() {

        super();

        //加载图片
        this.fanhui = require("../../img/返回箭头.png");

        //初始化数据列表
        this.successPersonList = [];//已完成的用户列表
        this.failedPersonList = [];//未完成的用户列表

        //设置当前的state
        this.state = this.getInitialState();

        //进行函数绑定
        this.initData = this.initData.bind(this);
    }

    /**LifeCycle*/
    /**
     * @function 获取初始的状态
     */
    getInitialState() {

        return {

        }

    }

    /**
     * @function 组件加载好之后
     */
    componentDidMount() {
        //组件渲染好之后，进行页面缩放
        var page = new pageResponse({
            class: 'pageResponse',     //模块的类名，使用class来控制页面上的模块(1个或多个)
            mode: 'contain',     // auto || contain || cover
            width: '375',      //输入页面的宽度，只支持输入数值，默认宽度为320px
            height: '667'      //输入页面的高度，只支持输入数值，默认高度为504px
        });

        //为了防止有空白出现，将主界面的背景改为蓝色
        $("div#container").css("background", "RGB(40,40,52)");


        //調用下setState方法，通知數據更新
        this.forceUpdate();

        //进行滚动栏设置
        $(".sucai").niceScroll({
            cursoropacitymax: 0//修改滚动条的颜色
        });

        //初始化所有的数据
        this.initData();

    }

    /**Inner Help*/
    initData() {

        //获取数据
        var task_id = this.props.params.task_id;

        //console.log(task_id);
        multipleGameModel.getMultiGameInfo(task_id).then(
            (data)=>{
                //成功获取数据
                console.log(data);

                var successPersonList = data.multiGameInfo.successPersonList;

                for(var s of successPersonList){

                    this.successPersonList.push(
                        <div className="item">
                            <span className="avatar">
                                <img src={"" + s.user_logo_img_path} alt=""/>
                            </span>
                            <span className="name">
                                {s.user_nickname}
                            </span>
                        </div>
                    );

                }

                var failedPersonList = data.multiGameInfo.failedPersonList;

                for(var s of failedPersonList){

                    this.failedPersonList.push(
                        <div className="item">
                            <span className="avatar">
                                <img src={"" + s.user_logo_img_path} alt=""/>
                            </span>
                            <span className="name">
                                {s.user_nickname}
                            </span>
                        </div>
                    );

                }

                this.forceUpdate();


        },(data)=>{
            console.log("getMultiGameInfo Error");
            });

    }

    /**
     * @function 返回构造的多人游戏详情界面
     */
    render() {

        return (
            <div className="MultipleGame_detailPage_container pageResponse">
                <div className="detail_container sucai">
                    {/*HannotateSC*/}
                    {/*任务的发起者以及描述*/}
                    <div className="title">
                        <span id="task_creator">你</span>
                        <span>邀请了</span>
                        <span id="to_who">小伙伴们</span>
                        <span id="task_time_limit">3</span>
                        <span>小时</span>
                        <span>行走</span>
                        <span id="task_goal">7000</span>
                        <span>步</span>
                    </div>
                    {/*任务的奖励 task_description*/}
                    <div className="description">
                        <span className="HannotateSC">奖励：</span>
                        <span id="task_description">请客吃饭</span>
                    </div>
                    {/*任务的留言 task_leave_words*/}
                    <div className="leave_words">
                        <span id="task_leave_words">完成了我就请你吃饭哦，随便挑地方！真的奥，绝对不骗你</span>
                    </div>
                    {/*已完成的列表*/}
                    <div className="successPersonList">
                        <span className="label HannotateSC">已完成</span>
                        {this.successPersonList}
                    </div>
                    {/*未完成的列表*/}
                    <div className="failedPersonList">
                        <span className="label HannotateSC">未完成</span>
                        {this.failedPersonList}
                    </div>
                </div>


                {/*通用返回按钮*/}
                <div className="common_back" onClick={()=> {
                            this.context.router.transitionTo('/multiple');
                        }}>
                    <img src={this.fanhui} alt=""/>
                    <span className="HannotateSC">返回</span>
                </div>
            </div>
        );

    }
}

MultipleGame_detailPage.contextTypes = {
    router: React.PropTypes.func.isRequired
};

export {MultipleGame_mainPage, MultipleGame_taskCreatePage,MultipleGame_myInvitationPage,MultipleGame_historyPage,MultipleGame_detailPage}