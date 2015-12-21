/**
 * Created by apple on 15/8/30.
 */
import React from "libs/react.js";
var Router = require('libs/ReactRouter.js');
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;
var DefaultRoute = Router.DefaultRoute;

//载入组件
import {MultipleGame_mainPage,MultipleGame_taskCreatePage,MultipleGame_myInvitationPage,MultipleGame_historyPage,MultipleGame_detailPage} from "../components/multipleGame/multipleGame.jsx";
import {SingleGame_mainPage,SingleGame_planetDetailBeforeExploringPage,SingleGame_planetBoostPage,SingleGame_planetOnPage,SingleGame_planetStartPage,SingleGame_planetUnlockPage} from "../components/singleGame/singleGame.jsx";
import {ModalDialog} from "../components/widgets/dialog/modalDialog.jsx";
import {CordovaPluginService} from "../js/service/CordovaPluginService.js";
var cordovaPluginService = new CordovaPluginService();

require("../css/normalize.css");
require("../css/main.css");
require("../css/font.css");
require("../css/animate.min.css");
require("../../libs/swiper.min.css");

//声明全局组件
var App = React.createClass({
    render () {
        return (
            <div id="container">
                <RouteHandler/>
            </div>

        )
    }
});


//声明全局路由
var routes = (
    //全局路由
    <Route path="/" handler={App}>

        {/*默认路由，游戏主页*/}
        <DefaultRoute handler={SingleGame_mainPage}/>

        {/*单人游戏*/}
        <Route name="single" handler={SingleGame_mainPage}>

        </Route>

        {/*单人游戏-星球详情*/}
        <Route name="single-planetDetail" path="/single-planetDetail/:planet_id" handler={SingleGame_planetDetailBeforeExploringPage}>

        </Route>

        {/*单人游戏-星球加速*/}
        <Route name="single-planetBoost" path="/single-planetBoost/:planet_id"  handler={SingleGame_planetBoostPage}>

        </Route>

        {/*单人游戏-正在游戏*/}
        <Route name="single-planetOn" handler={SingleGame_planetOnPage}>

        </Route>

        {/*单人游戏-开始游戏*/}
        <Route name="single-planetStartPage" path="/single-planetStartPage/:planet_id" handler={SingleGame_planetStartPage}>

        </Route>

        {/*单人游戏-星球分享与解锁*/}
        <Route name="single-planetUnlock" path="/single-planetUnlock/:planet_id" handler={SingleGame_planetUnlockPage}>

        </Route>


        {/*多人游戏*/}
        <Route name="multiple" handler={MultipleGame_mainPage}>

        </Route>
        {/*多人遊戲下﹣創建任務*/}
        <Route name="multiple-create" handler={MultipleGame_taskCreatePage}>

        </Route>
        {/*多人遊戲下﹣我的邀请*/}
        <Route name="multiple-invitation" handler={MultipleGame_myInvitationPage}>

        </Route>
        {/*多人遊戲下﹣歷史記錄*/}
        <Route name="multiple-history" handler={MultipleGame_historyPage}>

        </Route>
        {/*多人遊戲下﹣任务详情*/}
        <Route name="multiple-detail" path="/multiple-detail/:task_id" handler={MultipleGame_detailPage}>

        </Route>
    </Route>
);

//将组件渲染到页面
Router.run(routes, Router.HashLocation, (Root) => {
    React.render(<Root/>, document.body);
});

//注册Cordova的全局屏蔽事件
document.addEventListener("backbutton", ()=>{

    cordovaPluginService.systemUtils().goBack();

}, false);


