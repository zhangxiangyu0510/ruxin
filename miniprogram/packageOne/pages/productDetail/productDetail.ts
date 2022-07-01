// pages/my/my.ts
const app = getApp<IAppOption>()
var api = require('../../../config/api')
var util = require('../../../utils/util');
Page({
  onShareAppMessage() {
    // 分享
    let _detailFrom = this.data.detailFrom
    if (_detailFrom.image && !_detailFrom.image.includes('http')) {
      _detailFrom.image = 'http://' + _detailFrom.image
    }

    let _id = _detailFrom.id || _detailFrom.officialRecommendationId
    let _shopId = wx.getStorageSync('shopId')
    let _isOfficial = _detailFrom.isOfficial || false
    let operationType = _detailFrom.operationType
    let _newShareKey = this.data.newShareKey
    // setTimeout(() => {
    this.setData({
      isShare: true,
    })
    // }, 2000);
    let _themeColor = wx.getStorageSync('themeColor').substring(1)
    const promise = new Promise(resolve => {
      resolve({
        title: _detailFrom.title,
        // path: `pages/productDetail/productDetail?id=${_id}&shareKey=${_newShareKey}`,
        path: `packageOne/pages/productDetail/productDetail?id=${_id}&isOfficial=${_isOfficial}&operationType=${operationType}&shareKey=${_newShareKey}&shopId=${_shopId}&tc=${_themeColor}`,
        imageUrl: _detailFrom.image

      })
    })
    this.setData({
      showShare: false,
    })
    return {
      title: _detailFrom.title,
      path: `packageOne/pages/productDetail/productDetail?id=${_id}&isOfficial=${_isOfficial}&operationType=${operationType}&shareKey=${_newShareKey}&tc=${_themeColor}`,
      imageUrl: _detailFrom.image,
      promise
    }
  },
  // 关闭分享
  closeSharePosters() {
    this.setData({
      showShare: false
    })
  },
  // 打开分享
  openSharePosters(ev: any) {
    let that = this

    util.checkLogin().then(() => {
      // let _userInfo = wx.getStorageSync('userInfo')
      // 先放首页
      let _id = this.data.detailFrom.id || this.data.detailFrom.officialRecommendationId
      // let _shopId=_userInfo.shop.id
      if (!_id) {
        wx.showToast({
          title: '没有商品信息',
          icon: 'none',
          duration: 2000
        })
        return
      }
      let _isOfficial = this.data.detailFrom.isOfficial || false
      let operationType = this.data.detailFrom.operationType
      let _shareKey = wx.getStorageSync('shareKey')
      let _shopId = wx.getStorageSync('shopId')
      let _themeColor = wx.getStorageSync('themeColor').substring(1)
      let _data = JSON.parse(JSON.stringify(this.data.painting))
      let _userInfo = typeof wx.getStorageSync('userInfo') == 'string' ? JSON.parse(wx.getStorageSync('userInfo')) : wx.getStorageSync('userInfo')
      _data.views[11].content = that.data.detailFrom.title
      _data.views[5].content = _userInfo.nickname
      _data.views[8].content = that.data.detailFrom.retailPrice
      _data.views[9].content = that.data.detailFrom.starPrice
      _data.views[12].url = _userInfo.avatar || app.globalData.imageUrl+'/icons/accountPictures.png'
      _data.views[13].url = that.data.detailFrom.image
      that.setData({
        painting: _data,
        showShare: true,
      })

      let requstData = {
        id: _id,
        // path: `pages/index/index?id=${_id}&isOfficial=${_isOfficial}&type=${_type}`,
        path: `packageOne/pages/productDetail/productDetail?id=${_id}&Off=${_isOfficial}&type=${operationType}&shopId=${_shopId}&tc=${_themeColor}`,
        isOfficial: _isOfficial,
        operationType: operationType,
        shareKey: _shareKey
      }
      util.showOtherToast('加载中', "loading");
      util.request(api.shareCombProduct + '/' + _id, requstData, 'post').then((res: any) => {
        console.log('shareKey', res.data.shareKey)
        let _wxQrcodeData={
          type: 'image',
          url:  res.data.wxQrcode,
          top: 350,
          left: 170,
          width: 50,
          height: 50,
          isBase64: true
        }
        that.setData({
          newShareKey: res.data.shareKey,
          shareData: res.data,
          wxQrcode: res.data.wxQrcode,
          wxQrcodeData:_wxQrcodeData
        })
        wx.hideToast();
      }).catch(() => {
        util.showOtherToast('加载失败');
      })
    }).catch(() => {
      util.getUserProfile();
      return
    })

  },
  // 获取地址
  getAddress() {
    util.request(api.optimizationAreas,).then((res: any) => {
      this.data.multiArray[0] = res.data
      this.data.multiArray[1] = res.data[0].children
      // this.data.userAddressData[0] = res.data[0]
      // this.data.userAddressData[1] = res.data[0].children[0]
      this.setData({
        multiArray: this.data.multiArray,
        // userAddressData: this.data.userAddressData
      })
      // 
    }).catch(() => {
      util.showOtherToast('加载地址失败');
    })

  },

  // 滚动事件
  bindMultiPickerColumnChange(e: any) {
    // this.userAddressData
    if (e.detail.column == 0) {
      this.data.multiArray[1] = this.data.multiArray[0][e.detail.value].children
      this.setData({
        multiArray: this.data.multiArray
      })
    }
    this.data.multiIndex[e.detail.column] = e.detail.value
    this.setData({
      multiIndex: this.data.multiIndex
    })
  },
  // 确认选择事件
  bindMultiPickerChange(e: any) {
    this.data.userAddressData[0] = this.data.multiArray[0][e.detail.value[0]]
    this.data.userAddressData[1] = this.data.multiArray[1][e.detail.value[1]]
    this.setData({
      userAddressData: this.data.userAddressData,
      inStock: true

    })
    // 选完地址重新获取地区库存
    this.getStockQty()



    // userAddressData

  },

  // 选择地址
  // bindRegionChange: function (e: any): void {
  //   console.log('picker发送选择改变，携带值为', e, e.detail.value)
  //   this.setData({
  //     region: e.detail.value
  //   })
  // },
  // 加入星级顾客
  toH5Join() {
    util.checkLogin().then(() => {
      wx.navigateTo({
        url: `/pages/customerPage/index?url=${app.globalData.h5Address}starCustomer&params=${encodeURIComponent(JSON.stringify(util.getCommonArguments()))}`
      })
    }).catch(() => {
      util.getUserProfile();
    })
  },

  /**
   * 页面的初始数据
   */
  data: {
    cartCount:0,
    isLodding: true,
    inStock: true,//是否有库存
    itemNum: 1,
    multiArray: [],
    imageUrl: app.globalData.imageUrl,
    userAddressData: [{
      label: "上海",
      postCode: "200122",
      storeCode: "CNHDSH01",
      value: "SH",
      children: []
    }, {
      label: "上海",
      postCode: "200000",
      storeCode: "CNHDSH01",
      value: "SHSH",
    }],
    multiIndex: [0, 0],
    // region: ['上海市', '上海市'],
    userInfo: wx.getStorageSync('userInfo'),
    nuskinUserInfo:{},
    shopId: '',
    wxQrcode: '',
    wxQrcodeData:{},
    themeColor: app.globalData.themeColor,
    detailFrom: {},
    showShare: false,
    newShareKey: '',
    shareKey: '',
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
        type: 'image',
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
    this.setData({
      shareKey: options.shareKey || ''
    })
    // 存入分享人的shareKey
    console.log('我是分享进来的shareKey', options.shareKey)
    console.log('我是分享进来的店铺', options.shopId)
    options.shareKey ? wx.setStorageSync('shareKey', options.shareKey) : ""
    // 存入分享人的店铺
    options.shopId ? wx.setStorageSync('shopId', options.shopId) : options.shopId = wx.getStorageSync('shopId')
    this.setData({
      shopId: options.shopId
    })
    // 请求地址
    this.getAddress()
    this.getProductDetail(options)
    // 先绑定上级分享人
    util.bindShareUser()
    util.checkLogin().then(() => {
      this.getCartCount()
    })

  },
  // 加减数量
  calculateNum(e: any) {
    util.checkLogin().then(() => {
      if (e.currentTarget.dataset.value < 0 && this.data.itemNum < 2) {
        return
      }
      let flag = true
      this.data.detailFrom.shopProductItemList.forEach(item => {
        if (item.inStockNum < item.total * (this.data.itemNum + e.currentTarget.dataset.value)) {
          flag = false
          wx.showToast({
            title: '库存不足',
            icon: 'none',
            duration: 2000
          })
        }
      })
      if (flag) {
        this.setData({
          itemNum: this.data.itemNum + e.currentTarget.dataset.value
        })
      }
    }).catch(() => {
      util.getUserProfile();
    })
  },
  // 跳转商品详情
  goH5Detail(e: any) {
    // console.log('right,e======',e);
    let addAgruments = {
      catalogId: e.currentTarget.dataset.item.catalogId,
      itemId: e.currentTarget.dataset.item.itemId,
      itemType: e.currentTarget.dataset.item.itemType
    };
    let params = Object.assign({}, addAgruments, util.getCommonArguments());
    wx.navigateTo({
      url: '/pages/pageDetail/index?url=' + app.globalData.h5Address + 'productDetail&params=' + encodeURIComponent(JSON.stringify(params))
    })
  },
  // 跳转购物车页面
  toCartPage() {
    wx.switchTab({
      url: '/pages/buyCar/buyCar'
    })
  },
  // 查询商品库存
  getStockQty() {
    // util.checkLogin().then(() => {
    let that = this
    let ids = []
    this.data.detailFrom.shopProductItemList.forEach(item => {
      ids.push(item.itemInfo.itemId)
    })
    // if (ids.length) {
    let _data = {
      "provinceCode": this.data.userAddressData[0] && this.data.userAddressData[0].value,//省Code
      "cityCode": this.data.userAddressData[1] && this.data.userAddressData[1].value,//市Code
      itemIds: ids
    }
    util.request(api.productStatus, _data, 'post').then(function (res: any) {
      res.data.forEach((item, index) => {
        that.data.detailFrom.shopProductItemList[index].inStockNum = item.stockCount || 0
        // that.data.detailFrom.shopProductItemList[index].inStockNum=3
        if (!item.stockCount) {
          that.setData({
            inStock: false
          })
        }
      });

      // })
      // }

    })
  },
  // 加入购物车
  addcart() {
    let that = this
    util.checkLogin().then(() => {
      let _data = []
      let _userInfo = wx.getStorageSync('userInfo')
      let _priceType = ''
      switch (_userInfo.level) {
        case 1:
          _priceType = 'P1'
          break;
        case 2:
          _priceType = 'P3'
          break;
        case 3:
          _priceType = '23'
          break;
        default:
          _priceType = 'P1'
          break;
      }
      this.data.detailFrom.shopProductItemList.forEach(item => {
        if (!item.itemInfo) {
          return
        }
        let _newData = {
          // "activityId": "",//活动id
          // "activityName": "",//活动名称
          // "ageLocMeId": "",//智芯码Id
          "catalogId": item.itemInfo.catalogId,//类目ID
          // "cityCode": '246116',
          "cityCode": this.data.userAddressData[1] && this.data.userAddressData[1].value,//市Code
          "couponId": "-1",//优惠券id
          // "enjoyAlias": "",//尊享码别名
          "enjoyCode": "",//尊享码Code
          "isCoreItem": item.itemInfo.isCoreItem,//1是智芯商品
          // "isUseCoupon": "-1",//是否使用资格券不使用-1
          "itemId": item.itemInfo.itemId,//商品ID
          "itemName": item.itemInfo.itemName,//商品名称
          "itemNum": item.total * this.data.itemNum,//选择商品数量
          "items": "[]",//子产品的商品ID
          // "liveRoomId": "",//直播间id
          "parentPriceType": item.itemInfo.itemType,//父类价格类型
          // "priceMarkupId": "",//加价购活动id
          "priceType": _priceType,//子类价格类型
          // "priceTypeList": [],//所有价格类型
          "provinceCode": this.data.userAddressData[0] && this.data.userAddressData[0].value,//省Code
          // "provinceCode": '230011',
          "selected": true,//是否选中
          "skuId": item.itemInfo.skuId,//SKUID
          "sourceType": 2,//产品类型   1单品 2组合产品item.itemInfo.sourceType
          storeId: wx.getStorageSync('shopId'),//店铺id
          storeName: wx.getStorageSync('shopInfo').shop && wx.getStorageSync('shopInfo').shop.name,//店铺名称
          channelId: "12"//渠道id
        }
        _data.push(_newData)
      });
      util.request(api.cartMerge, _data, 'post', true).then(function (res: any) {
        if (res.data.success) {
          wx.showToast({
            title: '加入购物车成功',
            icon: 'success',
            duration: 2000
          })
          that.getCartCount()
        } else {
          wx.showToast({
            title: '加入购物车失败',
            icon: 'error',
            duration: 2000
          })

        }
        // console.log('详情', res);
        // if (res.data.shopProductItemList.length == 1) {
        //   res.data.image = res.data.shopProductItemList[0].image
        //   res.data.title = res.data.shopProductItemList[0].title
        // }
        // if (!res.data.image.includes('http')) {
        //   res.data.image = 'https:' + res.data.image
        // }
        // that.setData({
        //   detailFrom: res.data
        // })
      });
    }).catch(() => {
      util.getUserProfile();
      return
    })


  },
  // 获取购物车数量
  getCartCount(){
    let that=this
    util.request(api.cartCount, {}, 'get', true).then(function (res: any) {
      that.setData({
      cartCount:res.data.data
    })

    })

  },
  getProductDetail(options: any) {
    let that = this
    util.request(api.optimizationDetail + options.id, {
      isOfficial: options.isOfficial || options.Off,
      operationType: options.operationType || options.type
    }, 'get').then(function (res: any) {
      console.log('详情', res);
      if (res.data.shopProductItemList.length == 1) {
        res.data.image = res.data.shopProductItemList[0].image
        res.data.title = res.data.shopProductItemList[0].title
      }
      if (!res.data.image.includes('http')) {
        res.data.image = 'https:' + res.data.image
      }
      that.setData({
        detailFrom: res.data,
        isLodding: false
      })
      that.getStockQty()

      // 拿到商品详情查商品库存
      // that.getStockQty()

    });
  },
  // 获取用户地址列表默认地址
  getAddressList() {
    let _data = {
      pageNum: 1,
      pageSize: 10
    }
    util.request(api.addressList, _data, 'get', true).then(function (res: any) {


    })


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
    let that = this
    util.checkLogin().then(() => {
      this.getCartCount()
      util.request(api.getUserInfo).then(function (res: any) {
        console.log('获取个人信息信息====', res);
        if (res && res.data.user) {
          // wx.setStorageSync('userInfo', Object.assign({}, res.data.user, res.data.userProfile, res.data.nuskinUserInfo));
          that.setData({
            nuskinUserInfo: res.data.nuskinUserInfo
          })
        }
      });
    })
    if (!app.globalData.themeColor) {
      setTimeout(() => {
        this.setData({ 'themeColor': indexApp.globalData.themeColor })
      }, 2000);
    }
    this.setData({
      themeColor: app.globalData.themeColor,

    });
    util.getUrl();
    this.selectComponent("#dialogProtocol").close();
    this.setData({
      showShare: false,
    })

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    this.selectComponent("#dialogProtocol").close();
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  }
})