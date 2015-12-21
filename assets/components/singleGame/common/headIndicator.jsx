var $ = require('jquery');
var moment = require('libs/moment.min.js');
var Swiper = require('libs/swiper.jquery.umd.js');
var pageResponse = require("pageResponse");
import React from "libs/react.js";
require("./headIndicator.scss");

/**
 * @function 通用頭部指示器，表示能量值和互動值
 */
class HeadIndicator extends React.Component {

    /**
     * @function
     */
    constructor(props) {
        super(props);
    }

    /**
     * @function 默認渲染函數
     */
    render() {

        return (
            <div className="headIndicator">

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

            </div>
        )

    }
}

HeadIndicator.propTypes = {energy: React.PropTypes.string};

export {HeadIndicator}