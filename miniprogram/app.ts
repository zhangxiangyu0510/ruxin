// app.ts
var api = require('./config/api')
var util = require('./utils/util');
var sensors = require('./utils/sensorsdata.min');
import { EventBusInstance } from './utils/eventBus';
import { messageObj } from './utils/globalMessage';
// 配置初始化参数
sensors.setPara({
  name: 'sensors',
  server_url: 'https://bd.cn.nuskin.com/sa?project=default',// 测试
  // server_url: 'https://bd.cn.nuskin.com/sa?project=production',// 正式
  // 全埋点控制开关
  autoTrack: {
    appLaunch: true, // 默认为 true，false 则关闭 $MPLaunch 事件采集
    appShow: true, // 默认为 true，false 则关闭 $MPShow 事件采集
    appHide: true, // 默认为 true，false 则关闭 $MPHide 事件采集
    pageShow: true, // 默认为 true，false 则关闭 $MPViewScreen 事件采集
    pageShare: true, // 默认为 true，false 则关闭 $MPShare 事件采集
    mpClick: false, // 默认为 false，true 则开启 $MPClick 事件采集
    mpFavorite: true, // 默认为 true，false 则关闭 $MPAddFavorites 事件采集
  },
  // 自定义渠道追踪参数，如 source_channel: ["custom_param"]
  // source_channel: ["custom_param"],
  show_log: false,
  batch_send: true,

});
sensors.registerApp({
  platform_type: '小程序',
  project_name: '如新NU店',
  channel_type: '小程序',
  app_name: '如新NU店顾客端'
});

App<IAppOption>({
  globalData: {
    fontFamily: 'Verlag',
    themeColor: '',
    // =======dev环境=======
    // h5Address: 'https://shop-h5-test.cn.nuskin.com/index.html#/',
    // imageUrl: 'https://myshop-dev-1259463275.cos.ap-shanghai.myqcloud.com/myshop/user',
    // customerH5: 'https://1000112.cn.nuskin.com',
    // staticFont:'https://myshop-dev-1259463275.cos.ap-shanghai.myqcloud.com',
    // payAppId:'wxad1040bcdfcb9bda',
    // SDKAppID: 1400661803,
    // shopKeeperAppId:'wxc0e6a1cbe908790b',
    // =======dev环境=======
    // =======qa环境=======
    // h5Address: 'https://shop-h5-test.cn.nuskin.com/index.html#/',
    // imageUrl: 'https://myshop-dev-1259463275.cos.ap-shanghai.myqcloud.com/myshop/user',
    // customerH5: 'https://1000112.cn.nuskin.com',
    // staticFont:'https://myshop-dev-1259463275.cos.ap-shanghai.myqcloud.com',
    // payAppId:'wxc179d89468d1a487',
    // SDKAppID: 1400661803,
    // shopKeeperAppId:'wx5a9036a629064441',
    // =======qa环境=======
    // =======stage环境=======
    h5Address: 'https://shop-h5-stage.cn.nuskin.com/index.html#/',
    imageUrl: 'https://myshop-stage-1259463275.cos.ap-shanghai.myqcloud.com/myshop/user',
    customerH5: 'https://stage.cn.nuskin.com',
    staticFont: 'https://myshop-stage-1259463275.cos.ap-shanghai.myqcloud.com',
    payAppId: 'wx3dcf11f9f91e5c27',
    SDKAppID: 1400661803,
    shopKeeperAppId: 'wx99682bbd6fd2a91e',
    // =======stage环境=======
    // =======正式环境=======
    // h5Address: 'https://shop-h5.cn.nuskin.com/index.html#/',
    // imageUrl: 'https://myshop-prod-1259463275.cos.ap-shanghai.myqcloud.com/myshop/user',
    // customerH5: 'https://china.nuskin.com',
    // staticFont: 'https://myshop-prod-1259463275.cos.ap-shanghai.myqcloud.com',
    // payAppId: 'wx27861eac4fb9698d',
    // SDKAppID: 1400686532,
    // shopKeeperAppId: 'wx6a29317fb56e0cdc',
    // =======正式环境=======

  },

  onLaunch(options) {
    EventBusInstance.on('global', (data: any) => {
      console.log('app.ts======:', data)
      messageObj.addNews(data)
    }, true);
    console.log('我是分享进来的啊', options)
    if (options.query.shopId || options.query.shareParams) {
      wx.setStorageSync('shopId', options.query.shopId)
      wx.setStorageSync('themeColor', '#' + options.query.tc);
      wx.setStorageSync('isShareCom', 1);
      this.globalData.themeColor = '#' + options.query.tc

    }

    var _this = this;
    wx.login({
      success: res => {
        console.log(res.code)
        util.request(api.getToken + '?code=' + res.code).then(function (res: any) {

          if (res && res.data) {

            sensors.registerApp({
              union_id: res.data.unionId
            });
          }
          if (options.query.shopId || options.query.shareParams) {
            // wx.setStorageSync('shopId', options.query.shopId)

            // let pames = `shopId=${userInfo.shop.id}&id=${_id || ''}&isOfficial=${_goodsInfo.isOfficial || false}&shareKey=${_shareKey}&h5share=${_params}`
            // wx.setStorageSync('shopId', options.query.shopId)
            // let _path = util.jointParams(options.path, options.query)
            // console.log('_path', _path);
            // console.log('11111', options.query.shopId,)
            // util.getThemeColor({ shopId: options.query.shopId, openId: res.data.openId }).then((res: any) => {
            //   console.log('123456789', res);
            //   wx.setStorageSync('themeColor', res.data.primaryColor || '#7340B3');
            //   console.log('此时缓存里的主题色======', wx.getStorageSync('themeColor'))
            //   _this.globalData.themeColor = res.data.primaryColor || '#7340B3';
            //   if (_path.includes('pages/index/index')) {
            //     wx.switchTab({
            //       url:'/'+ _path
            //     })
            //   } else {
            //     wx.reLaunch({
            //       url:'/'+ _path
            //     })
            //   }

            // }).catch(() => {
            //   wx.setStorageSync('themeColor', '#7340B3');
            //   _this.globalData.themeColor = '#7340B3';
            //   wx.reLaunch({
            //     url: _path
            //   })
            // })

          } else {
            util.getThemeColor({ shopId: options.query.shopId, openId: res.data.openId }).then((res: any) => {
              console.log('123456789', res);
              wx.setStorageSync('themeColor', res.data.primaryColor);
              console.log('此时缓存里的主题色======', wx.getStorageSync('themeColor'))
              _this.globalData.themeColor = res.data.primaryColor
              wx.switchTab({
                url: '/pages/index/index'
              })

            }).catch(() => {
              wx.setStorageSync('themeColor', '#7340B3');
              _this.globalData.themeColor = '#7340B3'
              wx.switchTab({
                url: '/pages/index/index'
              })
            })
          }
        });
      },
    }),
      util.checkLogin().then(() => {
        sensors.registerApp({
          is_login: 1,
        });
      }).catch(() => {
        sensors.registerApp({
          user_style: '游客',
          is_login: 0
        });
        sensors.track('LoginResult', {
          is_success: 0,
          is_quick_login: 0
        });
      });
    sensors.init();
    //加载字体
    wx.loadFontFace({
      global: true,
      family: this.globalData.fontFamily,
      source: `url("${this.globalData.staticFont}/myshop/staticFont/Verlag-Bold.ttf")`,
      success(res) {
        console.log(res.status)
      },
      fail: function (res) {
        console.log(res.status)
      },
      complete: function (res) {
        console.log(res.status)
      }
    });
    wx.getSystemInfo({
      success: (result) => {
        if (result.platform !== "devtools") {
          //   console.log = () => { }
        }
      },
    })
  },
  onShow() {
    wx.setStorageSync('isShareCom', 1);
  }

})