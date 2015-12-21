/**
 * Created by apple on 15/9/2.
 */
class BaseModel {

    constructor() {

        this.server = {


            prefix:"http://115.28.253.106:10086",//测试环境地址
            //prefix: "http://121.41.104.156:10086",//开发环境地质

            //开发环境接口地址
            prefix_develop: "http://121.41.104.156"
        }

        this.test = {
            //测试环境下可用的测试用户的user_token
            user_token: "2Fot2m3nP7r0PCI80hRBQKXccoYNXnUQ3R6TDjlVUpKo3D"
        };
    }

    /**
     * @function 默认的ajax请求器
     * @param url 请求地址
     * @param requestData 请求数据
     * @param callback 回调函数
     */
    ajaxRequest(url, requestData, callback) {

        //判断是加载本地数据还是远端数据
        if (url.indexOf("http") > -1) {

            $.getJSON(url + '?requestData=' + JSON.stringify(requestData) + '&callback=?',
                function (data) {

                    //数据获取完毕后执行对象
                    callback(data);
                }, function (err) {
                    alert(err);
                }
            );
        } else {

            $.get(
                url,
                function (data) {
                    callback(data);
                }
            ).fail(function (err) {
                    console.log(err);
                });
        }


    }


}

export {BaseModel};