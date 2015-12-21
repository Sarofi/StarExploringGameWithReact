var $ = require('jquery');
import React from "nm/react";
require("./modalDialog.scss");
var pageResponse = require("pageResponse");

/**
 * @function 模態窗口,操作选项自定义
 */
class ModalDialog extends React.Component {

    /**Override*/
    constructor() {
        super();

        this.state = this.getInitialState();

        this.show = this.show.bind(this);

        this.hide = this.hide.bind(this);

    }

    getInitialState() {
        return {
            show: false//判斷是否需要顯示
        }
    }

    /**LifeCycle*/

    componentWillReceiveProps(nextProps) {
        // Not called for the initial render
        // Previous props can be accessed by this.props
        // Calling setState here does not trigger an an additional re-render

    }

    componentDidMount() {

    }

    /**Public Interface*/
    show() {
        this.setState({
            show: true
        });
    }

    hide() {
        this.setState({
            show: false
        });
    }


    /**Event*/

    /**Inner Help*/
    render() {

        var dialog = (
            <div className="dialog">
                <div className="overlay">

                </div>
                <div className="container">
                    <div className="title">
                        <span>{this.props.title}</span>
                    </div>
                    <div className="content">
                        <span>{this.props.content}</span>
                    </div>
                    {this.props.children}
                </div>
            </div>
        );

        var none = (<nonscript></nonscript>);

        var element;

        if (this.state.show) {
            element = dialog;
        } else {
            element = none;
        }

        return element

    }

}

/**
 * @function 通用提示窗口 Prompt，自带ok按钮
 */
class PromptDialog extends React.Component {
    /**Override*/
    constructor() {
        super();

        this.state = this.getInitialState();

        this.show = this.show.bind(this);

        this.hide = this.hide.bind(this);

        this.handleOkClick = this.handleOkClick.bind(this);

    }

    getInitialState() {
        return {
            show: false//判斷是否需要顯示
        }
    }

    /**LifeCycle*/

    componentWillReceiveProps(nextProps) {
        // Not called for the initial render
        // Previous props can be accessed by this.props
        // Calling setState here does not trigger an an additional re-render

    }

    componentDidMount() {

    }

    /**Event Listener*/
    handleOkClick(){

        //關閉當前窗體
        this.hide();

        //判斷是否傳入了OK按鈕的回調事件
        if(this.props.okClick){
            this.props.okClick();
        }
    }

    /**Public Interface*/
    show() {
        this.setState({
            show: true
        });
    }

    hide() {
        this.setState({
            show: false
        });
    }


    /**Event*/

    /**Inner Help*/
    render() {
        let dialog = (
            <div className="dialog" style={{display:this.state.show ? 'block':'none'}}>
                <div className="overlay">

                </div>
                <div className="container">
                    <div className="title">
                        <span>{this.props.title}</span>
                    </div>
                    <div className="content">
                        <span>{this.props.content}</span>
                    </div>
                    <div className="operation">
                        <div className="ok" onClick={this.handleOkClick}>
                            <span>好</span>
                        </div>
                    </div>

                </div>
            </div>
        );

        return dialog;

    }
}

export {ModalDialog,PromptDialog};