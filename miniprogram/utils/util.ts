var api = require('../config/api');
import imClient from "./imClient";
function formatTime(date: Date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return (
    [year, month, day].map(formatNumber).join('/') +
    ' ' +
    [hour, minute, second].map(formatNumber).join(':')
  )
}
function formatNumber(n: number) {
  const s = n.toString()
  return s[1] ? s : '0' + s
}
//去登录
function loginNow() {
  let userInfo = wx.getStorageSync('userInfo');
  if (userInfo == '') {
    wx.navigateTo({
      url: '/pages/app-auth/index',
    });
    return false;
  } else {
    return true;
  }
}
//api
function request(url: any, data: any = {}, method: any = "GET", isShopping: any = false) {
  return new Promise(function (resolve, reject) {
    // showOtherToast('加载中',"loading");
    let Auth_Token = wx.getStorageSync('cookie')
    let _header = {}
    if (isShopping) {
      _header = {
        'Content-Type': 'application/json',
        'auth': wx.getStorageSync('nuskinToken'),
        'mobile': wx.getStorageSync('userInfo').mobile
      }
    } else {
      _header = {
        'Content-Type': 'application/json',
        'X-Auth-Token': Auth_Token,
      }
    }
    wx.request({
      url: url,
      data: data,
      method: method,
      header: _header,
      success: function (res: any) {
        if (res.statusCode == 200) {
          resolve(res);
        } else if (res.statusCode == 401) {
          console.log('x-transaction-id===', res && res.header ? res.header['x-transaction-id'] : '');
          //重新登录
          showErrorToast('登录态失效请重新登录');
          imClient.disconnect();
          wx.getStorageSync("token") && wx.removeStorageSync("token");
          wx.getStorageSync("openId") && wx.removeStorageSync("openId");
          wx.getStorageSync("userInfo") && wx.removeStorageSync("userInfo");
          wx.getStorageSync("shopInfo") && wx.removeStorageSync("shopInfo");
          wx.getStorageSync("cookie") && wx.removeStorageSync("cookie");
          //   wx.getStorageSync("permisssion") && wx.removeStorageSync("permisssion");
          wx.getStorageSync("access_token") && wx.removeStorageSync("access_token");
          wx.getStorageSync("nuskinToken") && wx.removeStorageSync("nuskinToken");
          wx.getStorageSync("Neoanthropic") && wx.removeStorageSync("Neoanthropic");
          wx.getStorageSync("userSign") && wx.removeStorageSync("userSign");
          wx.getStorageSync("currentUserInfo") && wx.removeStorageSync("currentUserInfo");
          //   getThemeColor().then((res) => {
          //     wx.setStorageSync('themeColor', res);
          //   })
        } else if (res.statusCode == 400 || res.statusCode == 403) {
          console.log('x-transaction-id===', res && res.header ? res.header['x-transaction-id'] : '');
          if (res.data.errorCode != '100015' && res.data.errorCode != '100019' && res.data.errorCode != '100023' && res.data.errorCode != '100024' && res.data.errorCode != '100025' && res.data.errorCode != '100026' && res.data.errorCode != '100034' && res.data.errorCode != '100018' && res.data.errorCode != '400008' && res.data.errorCode != '100035') {
            showErrorToast(res.data.errMessage);
          } else if (res.data.errorCode == '100015' || res.data.errorCode == '100019' || res.data.errorCode == '100023' || res.data.errorCode == '100024' || res.data.errorCode == '100025' || res.data.errorCode == '100026' || res.data.errorCode == '100034' || res.data.errorCode == '100018' || res.data.errorCode == '400008' || res.data.errorCode == '100035') {
            reject(res);
          } else {
            reject(res.errMsg);
          }
        }
      },
      fail: function (err) {
        reject(err)
      }
    })
  });
}
//是否登录
function checkLogin() {
  return new Promise(function (resolve, reject) {
    if (wx.getStorageSync('cookie')) {
      console.log('999999')
      resolve(true);
      //   checkSession().then(() => {
      //     resolve(true);
      //   }).catch(() => {
      //     reject(false);
      //   });
    } else {
      console.log('10100101')
      reject(false);
    }
  });
}
//过期
function checkSession() {
  return new Promise(function (resolve, reject) {
    wx.checkSession({
      success: function () {
        resolve(true);
      },
      fail: function () {
        reject(false);
      }
    })
  });
}
function formatDate(inputTime: any) {
  var date = new Date(inputTime);
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  m = m < 10 ? ('0' + m) : m;
  var d = date.getDate();
  d = d < 10 ? ('0' + d) : d;
  var h = date.getHours();
  h = h < 10 ? ('0' + h) : h;
  var minute = date.getMinutes();
  var second = date.getSeconds();
  minute = minute < 10 ? ('0' + minute) : minute;
  second = second < 10 ? ('0' + second) : second;
  return y + '-' + m + '-' + d;

}
//用户信息
function getUserInfo() {
  return new Promise(function (resolve, reject) {
    wx.getUserInfo({
      withCredentials: true,
      success: function (res) {
        resolve(res);
      },
      fail: function (err) {
        reject(err);
      }
    })
  });
}
//登录
function login() {
  return new Promise(function (resolve: any, reject: any) {
    wx.login({
      success: function (res) {
        if (res.code) {
          //登录远程服务器
          resolve(res);
        } else {
          reject(res);
        }
      },
      fail: function (err) {
        reject(err);
      }
    });
  });
}
function showErrorToast(msg: string) {
  wx.showToast({
    title: msg,
    icon: 'none',
  });
  return false;
}
function showOtherToast(msg: string, icons: any = "none", duration: number = 1500) {
  wx.showToast({
    title: msg,
    icon: icons,
    duration: duration,
  });
  return false;
}
function GetAge(identityCard: string): number {
  let len: number = (identityCard + "").length;
  let strBirthday = "";
  if (len == 18) {
    //处理18位的身份证号码从号码中得到生日和性别代码
    strBirthday =
      identityCard.substr(6, 4) +
      "/" +
      identityCard.substr(10, 2) +
      "/" +
      identityCard.substr(12, 2);
  }
  if (len == 15) {
    let birthdayValue = "";
    birthdayValue = identityCard.charAt(6) + identityCard.charAt(7);
    if (parseInt(birthdayValue) < 10) {
      strBirthday =
        "20" +
        identityCard.substr(6, 2) +
        "/" +
        identityCard.substr(8, 2) +
        "/" +
        identityCard.substr(10, 2);
    } else {
      strBirthday =
        "19" +
        identityCard.substr(6, 2) +
        "/" +
        identityCard.substr(8, 2) +
        "/" +
        identityCard.substr(10, 2);
    }
  }
  //时间字符串里，必须是“/”
  let birthDate = new Date(strBirthday);
  let nowDateTime = new Date();
  let age = nowDateTime.getFullYear() - birthDate.getFullYear();
  //再考虑月、天的因素;.getMonth()获取的是从0开始的，这里进行比较，不需要加1
  if (
    nowDateTime.getMonth() < birthDate.getMonth() ||
    (nowDateTime.getMonth() == birthDate.getMonth() &&
      nowDateTime.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
}

function timeTmp(s: number) {
  const time = 24 * 60 * 60 * 1000
  let n = new Date().valueOf()//当前时间戳
  let tmpDate = (n - s) / time
  if (tmpDate < 36.5) {
    return 0.1
  } else {
    return (tmpDate / 365).toFixed(1)
  }
}
function getCurrentAge(startTime: Date, endTime = new Date()): number {
  if (!startTime) return 0
  // 获取年份
  let startYear = startTime.getFullYear();
  let endYear = endTime.getFullYear();
  // 获取月份
  let startMonth = startTime.getMonth() + 1;
  let endMonth = endTime.getMonth() + 1;
  // 获取天
  let startDay = startTime.getDate();
  let endDay = endTime.getDate();
  // 年份相差
  let tmpYear = endYear - startYear;
  let tmp = 0
  if (endMonth === startMonth) {
    if (endDay <= startDay) {
      tmp = -1
    } else {
      tmp = 1
    }
  } else if (endMonth > startMonth) {
    tmp = 1
  } else if (endMonth < startMonth) {
    tmp = -1
  }
  return tmpYear + tmp
}
function getUrl() {
  var pages = getCurrentPages();
  var currentPage = pages[pages.length - 1];
  var url = currentPage.route;
  wx.setStorageSync('Router', `/${url}`)
  var options = currentPage.options;
  var urlWithArgs = url + '?'
  for (var key in options) {
    var value = options[key]
    urlWithArgs += key + '=' + value + '&'
  }
  urlWithArgs = urlWithArgs.substring(0, urlWithArgs.length - 1)
  wx.setStorageSync('Url', `/${urlWithArgs}`)
}
function backAddress(argu: number) {
  let router = wx.getStorageSync('Router') || '/pages/index/index';
  let url = wx.getStorageSync('Url') || '/pages/index/index';
  if (router == '/pages/index/index' || router == '/pages/classify/classify' || router == '/pages/buyCar/buyCar' || router == '/pages/ucenter/index/index') {
    wx.switchTab({
      url: router,
    })
  } else {
    if (argu != 0) {
      if (wx.getStorageSync("h5")) {
        let pages = getCurrentPages();
        console.log('pages====', pages);
        // let prevPage = pages[pages.length - (argu + 1)];
        // if (prevPage.route == 'pages/pageDetail/index') {
        //   prevPage.setData({ webViewSrc: '' })
        // }
        wx.navigateBack({
          delta: argu,
        })
        wx.getStorageSync("h5") && wx.removeStorageSync("h5");
      } else {
        wx.navigateBack({
          delta: argu
        })
      }

    } else {
      wx.redirectTo({
        url: url,
      })
    }
  }
}
function getUserProfile() {
  // let that = this;
  let code = '';
  let isNewUser = '';
  wx.login({
    success: (res) => {
      code = res.code;
      //   console.log('获取code===', code);
    },
  });
  // 获取用户信息
  wx.getUserProfile({
    lang: 'zh_CN',
    desc: '用户登录',
    success: (res: any) => {
      let loginParams = {
        code: code,
        encryptedData: res.encryptedData,
        iv: res.iv,
        rawData: res.rawData,
        signature: res.signature
      };
      request(api.getToken + '?code=' + code).then(function (res: any) {
        // console.log('接口后的=====', res);
        if (res && res.data) {
          isNewUser = res.data.newUser;
          wx.setStorageSync('token', res.data.wechatToken);
          wx.setStorageSync('openId', res.data.openId);
          wx.setStorageSync('unionId', res.data.unionId || '');
          wx.navigateTo({
            url: '/packageOne/pages/app-auth/index?isNewUser=' + isNewUser
          })
        }
      });
      // console.log('登录信息====', loginParams);
      wx.setStorageSync('permisssion', loginParams);

    },
    // 失败回调
    fail: () => {
      showErrorToast('授权失败，请重新尝试');
    }
  });
}
//公共参数
function getCommonArguments() {
  let params: any = {
    token: wx.getStorageSync("nuskinToken") || null,
    nuskinToken: wx.getStorageSync('access_token') || null,
    userInfo: wx.getStorageSync('userInfo') || null,
    shareKeyOther: wx.getStorageSync('shareKey') || null,
    fromType: 'customer',
    channelId: 12,
    sessionInfo: {
      openId: null,
      unionId: null,
    },
    shopkeeperId: null,
    msShopId: wx.getStorageSync('shopId'),
    shopName: null
  }
  if (wx.getStorageSync('userInfo')) {
    params.userInfo.avatar = null;
  }
  if (wx.getStorageSync('cookie')) {
    params.sessionInfo.openId = wx.getStorageSync("openId");
    params.sessionInfo.unionId = wx.getStorageSync('unionId');
    params.shopkeeperId = wx.getStorageSync('shopInfo') ? wx.getStorageSync('shopInfo').partner.nkMemberId : null;
    params.msShopId = wx.getStorageSync('shopInfo') ? wx.getStorageSync('shopInfo').shop.id : null;
    params.shopName = wx.getStorageSync('shopInfo') ? wx.getStorageSync('shopInfo').shop.name : null;
  } else {
    params.sessionInfo = null;
    params.shopkeeperId = null;
    params.msShopId = null;
    params.shopName = null
  }
  return params


}
function getThemeColor(argument: any) {
  wx.setStorageSync('indexBg', '')
  console.log(argument, '2222222')
  return new Promise((resolve, reject) => {
    checkLogin().then(() => {
      console.log('KKKKKKK')

      var apiS: string = api.getLoginTheme;
      if (argument.shopId) {
        apiS = apiS + '?shopId=' + argument.shopId
      } else {
        apiS = api.getNoLoginTheme + '?openId=' + argument.openId

      }
      request(apiS).then((res: any) => {
        console.log('Skinskin')
        if (res) {
          wx.setStorageSync('indexBg', res.data.primaryBackgroundImage)
          wx.setStorageSync('canvasBg', res.data.posterImage);
          resolve(res);

        } else {
          resolve('#7340B3');
        }
      })
    }).catch(() => {
      console.log('nologin')
      let currentApi = '';
      if (argument) {
        if (argument.shopId) {
          currentApi = api.getNoLoginTheme + '?shopId=' + argument.shopId + '&openId=' + argument.openId

        } else {
          currentApi = api.getNoLoginTheme + '?openId=' + argument.openId


        }
      } else {
        currentApi = api.getNoLoginTheme
      }
      console.log(currentApi)
      request(currentApi).then((res: any) => {
        console.log('qqqqqqq', res);
        wx.setStorageSync('indexBg', res.data.primaryBackgroundImage)
        wx.setStorageSync('canvasBg', res.data.posterImage);
        if (res) {
          resolve(res)
        }
      })
    })

  })

}
// 拼接url
function jointParams(url: String, query: any) {
  if (!url) return ''; if (query) { let queryArr = []; for (const key in query) { if (query.hasOwnProperty(key)) { queryArr.push(`${key}=${query[key]}`) } } if (url.indexOf('?') !== -1) { url = `${url}&${queryArr.join('&')}` } else { url = `${url}?${queryArr.join('&')}` } } return url;
}
// 获取店铺信息
function getShopInfo(shopId: any) {
  request(api.getShopInfo, { shop_id: shopId }, 'get').then(function (res: any) {
    if (res && res.data.shop) {
      res.data.shop.id && wx.setStorageSync('shopInfo', res.data)
    }
  });
}
// var util = require('./util');
function svgColor(url: string, color = '#EBEBEB', type = 'fill'): any {
  return new Promise((resolve, reject) => {
    url = decodeURIComponent(url)
    if (url && url.includes(`<svg style="${type}:`)) {
      let colrValue: string = url.split(`<svg style="${type}:`)[1].slice(0, 7);


      resolve(encodeURIComponent(url.replace(colrValue, color)))
    } else {
      if (url && url.indexOf('http') >= 0) {
        request(url, 'get', {}, { 'Content-Type': 'binary' }).then((res: any) => {
          url = decodeURIComponent(res.data)

          var svgFile = res.data;
          resolve(encodeURIComponent(svgFile.replace('<svg', '<svg style="' + type + ':' + color + '"')))

        }).catch((err: any) => {
        })
      } else {
        let svgFile: any = wx.getFileSystemManager().readFileSync(url, 'binary');
        resolve(encodeURIComponent(svgFile.replace('<svg', '<svg style="' + type + ':' + color + '"')))
      }
    }
  })
}
// 绑定分享链路
function bindShareUser() {
  if (wx.getStorageSync('isShareCom') && wx.getStorageSync('cookie')) {
    let _shopId = wx.getStorageSync('shopId')
    let _shareKey = wx.getStorageSync('shareKey') || ''
    let _data = {
      id: _shopId,
      path: `pages/index/index?shopId=${_shopId}`,
      shareKey: _shareKey,
    }
    request(api.shareShop + '/' + _shopId, _data, 'post').then((res: any) => {
      console.log('我绑定了分享人')
      wx.removeStorageSync("isShareCom");
    })
  }

}

module.exports = {
  formatTime,
  formatNumber,
  loginNow,
  request,
  checkLogin,
  checkSession,
  getUserInfo,
  login,
  formatDate,
  showErrorToast,
  GetAge,
  // getTmpYear,
  getCurrentAge,
  getUserProfile,
  getUrl,
  backAddress,
  timeTmp,
  showOtherToast,
  getCommonArguments,
  getThemeColor,
  jointParams,
  getShopInfo,
  svgColor,
  bindShareUser
}
