const originalApp = getApp<IAppOption>()
var changeSvg = require('../../utils/changeThemeColor');
import imClinet from '../../utils/imClient';
var api = require('../../config/api')
var util = require('../../utils/util');
// var encryption = require('../../utils/encryption');


Page({

  /**
   * 页面的初始数据
   */
  data: {
    myShareKey: '',
    shareObj: { code: '', imgUrl: '', name: '', price: '' },
    conversationList: [{ conversationID: '', unreadCount: 0 }],
    newShareKey: '',
    wxQrcodeData:{},
    h5IntroductionData: {},
    hasPhone: false,
    noLogin: false,
    showRegister: false,
    showShareOrder: false,
    orderId: '',
    customerPhone: '',
    bg: originalApp.globalData.imageUrl + '/icons/origin_bg.svg',
    showShare: false,
    goodsImage: '',
    goodsName: '',
    chatDialog: false,
    painting: {
      width: 248,
      height: 418,
      background: '#fff',
      clear: true,
      views: [{
        type: 'rect',
        top: 0,
        left: 0,
        width: 248,
        height: 418,
        background: '#fff'
      },
      {
        type: 'rect',
        top: 40,
        left: 24,
        width: '200',
        height: '200',
        background: '#fff',
        borderRadius: 8
      },
      {
        type: 'rect',
        top: 360,
        left: 24,
        width: '36',
        height: '16',
        background: '#ccc',
        borderRadius: 8
      },
      {
        type: 'rect',
        top: 380,
        left: 24,
        width: '36',
        height: '16',
        background: '',
        borderRadius: 8
      },
      {
        type: 'arc',
        top: 250,
        left: 24,
        width: '25',
        height: '25',
        background: '#ccc',
      },

      {
        type: 'text',
        content: '蓝色的枫叶',
        fontSize: 12,
        lineHeight: 20,
        color: '#383549',
        textAlign: 'left',
        top: 258,
        left: 55,
        width: 150,
        MaxLineNumber: 1,
        breakWord: true,
        // bolder: true
      },
      {
        type: 'text',
        content: '向你推荐',
        fontSize: 10,
        lineHeight: 14,
        color: '#8c8c8c',
        textAlign: 'left',
        top: 290,
        left: 24,
        width: 50,
        MaxLineNumber: 1,

      },
      {
        type: 'text',
        content: '零售价',
        fontSize: 10,
        lineHeight: 14,
        color: '#fff',
        textAlign: 'left',
        top: 363,
        left: 27,
        // width: 50,
        MaxLineNumber: 1,
      },
      {
        type: 'text',
        content: '￥1200',
        fontSize: 10,
        lineHeight: 14,
        color: '#8c8c8c',
        textAlign: 'left',
        top: 365,
        left: 65,
        // width: 50,
        MaxLineNumber: 1,
      },
      {
        type: 'text',
        content: '￥1100',
        fontSize: 10,
        lineHeight: 14,
        color: '',
        textAlign: 'left',
        top: 385,
        left: 65,
        // width: 50,
        MaxLineNumber: 1,
      },
      {
        type: 'text',
        content: '星级价',
        fontSize: 10,
        lineHeight: 14,
        color: '#fff',
        textAlign: 'left',
        top: 383,
        left: 27,
        // width: 50,
        MaxLineNumber: 1,
      },
      {
        type: 'text',
        content: '如新优选滢白三效修护霜暂为非直销品',
        fontSize: 12,
        lineHeight: 14,
        color: '#4A4A4A',
        textAlign: 'left',
        top: 305,
        left: 24,
        width: 190,
        MaxLineNumber: 2,
        breakWord: true,
        // bolder: true
      },
      {
        type: 'oneselfImage',
        url: '',
        top: 250,
        left: 24,
        width: 26,
        height: 26,
        borderRadius: 13,
      },
      {
        type: 'image',
        url: '',
        top: 40,
        left: 24,
        width: 200,
        height: 200,
      },


      ],
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options: any) {
    wx.hideShareMenu({
      menus: ['shareAppMessage', 'shareTimeline']
    })
    console.log('options=====', options);
    // this.setData({
    //   bg: changeSvg.svgColor(this.data.bg, originalApp.globalData.themeColor),
    // });
    this.changeColor('bg', this.data.bg, originalApp.globalData.themeColor)
    let urlData: any = '';
    if (options && options.params) {
      urlData = JSON.parse(decodeURIComponent(options.params));
    }
    console.log('urlData====', urlData);
    if (wx.getStorageSync('cookie')) {
      this.setData({
        noLogin: false,
      })
      if (urlData && urlData.type == 1) {
        this.setData({
          h5IntroductionData: urlData.productInfo
        })
        util.showOtherToast('加载中', "loading");
        this.posterShow(urlData)

      } else if (urlData && urlData.type == 3) {
        // let userInfo = JSON.parse(wx.getStorageSync('userInfo'))
        // this.setData({
        //   h5IntroductionData: urlData.productInfo
        // })
        // itemId，shareKey，itemType，catalogId
        // console.log('options',options)
        // catalogId: _h5IntroductionData.finalCatalog[0].id,
        // itemId: _h5IntroductionData.itemPrice[0].itemId,
        // itemType: _h5IntroductionData.itemType,
        let _shareKey = wx.getStorageSync('shareKey')
        // let _shopId = wx.getStorageSync('shopId')
        let _path = `pages/goodsDetail/goodsDetail?itemId=${urlData.productInfo.itemPrice[0].itemId}&shareKey=${_shareKey}&itemType=${urlData.productInfo.itemType}&catalogId=${urlData.productInfo.finalCatalog[0].id}`
        // let _path =''
        wx.navigateToMiniProgram({
          appId: 'wx8a63e3382df92d5b',
          // path: 'pages/index/index?id=123',
          path: _path,
          extraData: {
            foo: 'bar'
          },
          envVersion: 'trial',
          success(res) {
            // 打开成功
          },
          fail(err) {
            wx.navigateBack()
            // 打开成功
          }
        })
      } else if (options.type == 4) {
        this.setData({
          showRegister: true
        })
      } else if (urlData && urlData.type == 9) {
        let _shopId = wx.getStorageSync('shopId')
        let _shareKey = wx.getStorageSync('shareKey') || ''
        let _data = {
          id: _shopId,
          path: `pages/index/index?shopId=${_shopId}`,
          shareKey: _shareKey,
        }
        util.request(api.shareShop + '/' + _shopId, _data, 'post').then((res: any) => {
          this.setData({
            myShareKey: res.data.shareKey,
            showShareOrder: true,
            orderId: urlData.orderId
          })
        })
      } else if (urlData && urlData.type == 2) {
        console.log('999999====', urlData.type)
        let that = this;
        let assignObj = { imgUrl: urlData.imgUrl, name: urlData.name, price: urlData.price, code: urlData.code };
        this.setData({
          shareObj: assignObj
        });
        console.log('99999900000====', this.data.chatDialog)
        //客服--剩余对接im
        util.request(`${api.groupPeople}?shop_id=${wx.getStorageSync('shopId')}`).then(function (res: any) {
          if (res && res.data) {
            that.setData({
              chatDialog: true
            });
            console.log('00000000000====', that.data.chatDialog)
          } else {
            that.onService();
          }
        });

      }
    } else {
      if (urlData && urlData.type == 2) {
        this.onService();
      } else {
        this.setData({
          noLogin: true,
        })
      }
    }
  },
  // 获取会话列表
  getConversationList() {
    let that = this;
    util.request(api.getSendId).then(function (res: any) {
      if (res && res.data) {
        let arr: any = []
        arr.push(res.data.tmpId)
        wx.requestSubscribeMessage({
          tmplIds: arr,
          success(res) {
            console.log('---------', res);
            if (res[arr[0]] == 'accept') {//用户同意授权
              that.getSaveFlag()
            }
            wx.getSetting({
              withSubscriptions: true,
              success(res: any) {
                console.log('是否勾选', res, res.subscriptionsSetting);
                if (res.subscriptionsSetting.mainSwitch && res.subscriptionsSetting.itemSettings && res.subscriptionsSetting.itemSettings[arr[0]] == 'accept') {
                  that.getSaveFlag()
                }
              }
            })
            let promise = imClinet.tim.getConversationList();
            promise.then((imResponse: any) => {
              // 全量的会话列表，用该列表覆盖原有的会话列表
              console.log('imResponse====', imResponse);
              const conversationList = imResponse.data.conversationList.filter((item: any) => { return item.userProfile.userID == wx.getStorageSync('shopInfo').partner.uid });
              that.setData({
                conversationList,
              });
              console.log('conversationList====', conversationList)
              let conversationInfomation: any = {
                conversationID: that.data.conversationList[0].conversationID,
                unreadCount: that.data.conversationList[0].unreadCount
              };
              const url = `/TUI-CustomerService/pages/TUI-Chat/chat?conversationInfomation=${JSON.stringify(conversationInfomation)}&shareParams=${encodeURIComponent(JSON.stringify(that.data.shareObj))}`;
              wx.redirectTo({
                url,
              });

            }).catch((imError: any) => {
              console.warn('getConversationList error:', imError); // 获取会话列表失败的相关信息
            });
          }
        })
      }
    }).catch((err: any) => {
      console.warn('getSendId error:', err);
    });
  },
  getSaveFlag() {
    util.request(api.getSaveFlag).then(function (res: any) {
      console.log('------------------', res);
    });
  },
  changeColor(name: string, url: string, color = '#EBEBEB', type = 'fill') {
    util.svgColor(url, color, type).then((res: any) => {
      this.setData({ [name]: res })
    })


  },
  tapDialogButton(e: any) {
    console.log('e======', e);
    //否
    if (e.detail.index == 0) {
      wx.navigateBack({});
      this.setData({
        noLogin: false,
      })
      // todo逻辑处理
    } else {
      // h5上过来的登录
      wx.setStorageSync('h5', 'true');
      util.getUserProfile();
    }
  },
  tapDialogChatButton(e: any) {
    if (e.detail.index == 0) {
      wx.navigateBack({});
      this.setData({
        chatDialog: false,
      })
    } else {
      this.getConversationList();
    }
  },
  closeDialog() {
    this.setData({
      showRegister: false,
    })
    wx.navigateBack({});
  },
  closeChat() {
    this.setData({
      chatDialog: false,
    });
    wx.navigateBack({});
  },
  goChat() {
    this.getConversationList();
  },
  cancelShare() {
    this.setData({
      showShareOrder: false,
    });
    wx.navigateBack({});
  },

  onService() {
    var _that = this;
    util.request(api.customerService).then(function (res: any) {
      if (res && res.data) {
        _that.setData({
          customerPhone: res.data.ot,
          hasPhone: true,
        });
      }
    });
  },
  positionevent() {
    this.triggerEvent('dialogevent', { params: false });
    wx.navigateBack({});
  },
  // 关闭分享
  closeSharePosters() {
    this.setData({
      showShare: false
    })
    wx.navigateBack({});
  },
  // 分享海报显示
  posterShow(urlData: any) {
    let goodsInfo = urlData.productInfo
    wx.hideToast();
    let _h5IntroductionData = this.data.h5IntroductionData
    let requstData = {
      catalogId: urlData.catalogId,
      itemId: urlData.itemId,
      itemType: _h5IntroductionData.itemType,
      path: '',
      shareKey: wx.getStorageSync('shareKey')
    }
    let _shopInfo = wx.getStorageSync('shopInfo')
    let _userInfo = wx.getStorageSync('userInfo')
    let _params = urlData.catalogId + "," + urlData.itemId + ',' + _h5IntroductionData.itemType + ',' + wx.getStorageSync('shopId')
    // let  _shareKey=wx.getStorageSync('shareKey')
    let _shopId = wx.getStorageSync('shopId')
    let _themeColor = wx.getStorageSync('themeColor').substring(1)
    let _data = JSON.parse(JSON.stringify(this.data.painting))
    let _retailPrice = 0
    let _starPrice = 0
    goodsInfo.itemPrice.forEach(cItem => {
      switch (cItem.priceType) {
        case 'P1':
          _retailPrice = cItem.salePrice
          break;
        case 'P3':
          break;
        case '23':
          _starPrice = cItem.salePrice
          break;
        default:
          break;
      }
    });

    _data.views[11].content = goodsInfo.name || ''
    _data.views[5].content = _userInfo.nickname || ''
    _data.views[8].content = _retailPrice
    _data.views[9].content = _starPrice

    // if (_shopInfo.partnerProfile.avatar) {
    _data.views[12].url = _userInfo.avatar || originalApp.globalData.imageUrl + '/icons/accountPictures.png'
    _data.views[12].type = 'image'
    // }
    _data.views[13].url = goodsInfo.itemImages[0].fileUrl
    this.setData({
      painting: _data,
      showShare: true,
      goodsName: goodsInfo.name,
      goodsImage: goodsInfo.itemImages[0].fileUrl,
    })
    requstData.path = `/pages/pageDetail/index?shareParams=${_params}&tc=${_themeColor}`
    util.request(api.shareProduct + '/' + requstData.itemId, requstData, 'post').then((res: any) => {
      let _wxQrcodeData = {
        type: 'image',
        url: res.data.wxQrcode,
        top: 350,
        left: 170,
        width: 50,
        height: 50,
        isBase64: true
      }

      this.setData({
        newShareKey: res.data.shareKey,
        wxQrcodeData: _wxQrcodeData
      })
    })
    // }).catch(() => {
    //   console.log('我没登录了');
    //   util.getUserProfile();
    // });

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // this.posterShow()

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    wx.redirectTo({
      url: ''
    });
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },
  onShareAppMessage() {
    if (this.data.showShareOrder) {
      let shopId = wx.getStorageSync('shopId');
      let mobile = wx.getStorageSync('userInfo').mobile.replace(/(\d{3})\d{5}(\d{3})/, "$1****$2");
      let _themeColor = wx.getStorageSync('themeColor').substring(1)
      // nickname
      let params = {
        token: null,
        nuskinToken: null,
        userInfo: null,
        fromType: 'customer',
        channelId: 12,
        sessionInfo: null,
        shopkeeperId: null,
        msShopId: null
      }
      return {
        title: mobile + '为您推荐以下商品',
        path: '/pages/customerPage/index?url=' + originalApp.globalData.h5Address + 'shoppingList&flag=shareOrderList&orderId=' + this.data.orderId + '&title=' + wx.getStorageSync('userInfo').nickname + '&shopId=' + shopId + '&params=' + encodeURIComponent(JSON.stringify(params)) + '&tc=' + _themeColor + '&shareKey=' + this.data.myShareKey,
        imageUrl: 'https://nuskin-1257745828.cos.ap-shanghai.myqcloud.com/20220415/c3c835a1-2c3e-4a84-9262-02cde140f4fc.png',
      }
      //   let params={
      //     flag:'shareOrderList',
      //     orderId:this.data.orderId,
      //     title:wx.getStorageSync('userInfo').nickname,
      //     shopId:shopId
      // }
      // return {
      //     title: mobile+'为您推荐以下商品',
      //     path: '/pages/customerPage/index?url='+originalApp.globalData.h5Address+'shoppingList&params='+encodeURIComponent(JSON.stringify(params)),
      //     imageUrl: 'https://nuskin-1257745828.cos.ap-shanghai.myqcloud.com/20220415/c3c835a1-2c3e-4a84-9262-02cde140f4fc.png',
      //   }
    } else {
      let _h5IntroductionData = this.data.h5IntroductionData
      let _newShareKey = this.data.newShareKey
      let _shopId = wx.getStorageSync('shopId')
      let params = {
        catalogId: _h5IntroductionData.finalCatalog[0].id,
        itemId: _h5IntroductionData.itemPrice[0].itemId,
        itemType: _h5IntroductionData.itemType,
        token: null,
        nuskinToken: null,
        userInfo: null,
        sessionInfo: {
          openId: wx.getStorageSync("openId") || null,
          unionid: wx.getStorageSync('unionId') || null,
        },
        fromType: 'customer',
        channelId: 12
      }
      let _themeColor = wx.getStorageSync('themeColor').substring(1)
      const promise = new Promise(resolve => {
        resolve({
          title: this.data.goodsName,
          // path: `pages/productDetail/productDetail?id=${_id}&shareKey=${_newShareKey}`,
          path: '/pages/pageDetail/index?url=' + originalApp.globalData.h5Address + 'productDetail&shareKey=' + _newShareKey + '&shopId=' + _shopId + '&params=' + encodeURIComponent(JSON.stringify(params)) + '&tc=' + _themeColor,
          imageUrl: this.data.goodsImage
        })
      })
      return {
        title: this.data.goodsName,
        path: '/pages/pageDetail/index?url=' + originalApp.globalData.h5Address + 'productDetail&shareKey=' + _newShareKey + '&shopId=' + _shopId + '&params=' + encodeURIComponent(JSON.stringify(params)) + '&tc=' + _themeColor,
        imageUrl: this.data.goodsImage,
        promise
      }
    }
  },

})