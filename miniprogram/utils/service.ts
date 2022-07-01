/**
 * 支付相关服务
 */
let utils = require('./util');
let apis = require('../config/api');
// let resolvePw=require('./crypto_js')
function payOrder(orderId:string,payNo:string,subAppId:string='wx8a63e3382df92d5b',subOpenId:string='opA6-5WOQLFkLhjSiANdoca5o3i0') {
    return new Promise(function(resolve, reject) {
        utils.request(`${apis.getPay}?channelId=12&orderId=${orderId}&payNo=${payNo}&subAppId=${subAppId}&subOpenId=${subOpenId}`, {},'get',true).then((res:any) => {
            console.log('res=====',res);
            if (res&&res.data.code == 0) {
                // resolvePw(res.data.data.data1)
                const payParam = res.data;
                // 如果没有支付想直接支付成功，下面注释。
                wx.requestPayment({
                    'timeStamp': payParam.timestamp,
                    'nonceStr': payParam.traceId,
                    'package': payParam.package,
                    'signType': payParam.signType,
                    'paySign': payParam.paySign,
                    'success': function(res) {
                        resolve(res);
                    },
                    'fail': function(res) {
                        reject(res);
                    },
                    'complete': function(res) {
                        reject(res);
                    }
                });
                // 直接支付成功，下面打开，上面注释
                // resolve(res);
                // =================================
            } else {
                reject(res);
            }
        });
    });
}
module.exports = {
    payOrder
};