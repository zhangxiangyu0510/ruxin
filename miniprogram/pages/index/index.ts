
import imClient from "../../utils/imClient";
// import { EventBusInstance } from '../../utils/eventBus'
// 获取应用实例
const indexApp = getApp<IAppOption>();
// var changeSvg = require('../../utils/changeThemeColor');
var api = require('../../config/api')
var util = require('../../utils/util');
Page({
  data: {
    payDialog: false,
    NeoanthropicDialogShow: false,
    userLevel: 3,
    wxQrcode: '',
    wxQrcodeData:{},
    bg: '',
    isLoading: true,
    goodsListData: [],//列表数据
    shopkeeperRecommend: [],//店主推荐
    classifyTotal: null,
    pageNum: 1,
    pageSize: 10,
    classifyName: '',
    showDialog: false,
    themeColor: indexApp.globalData.themeColor,
    imageUrl: indexApp.globalData.imageUrl,
    fansbBgIcon: indexApp.globalData.imageUrl + '/icons/fans_bg.svg',
    youxuanIcon: indexApp.globalData.imageUrl + '/icons/youxuan.svg',
    shopkeeperRecommendIcon: indexApp.globalData.imageUrl + '/icons/shopkeeperRecommend.svg',
    indexTopSwiper: true,
    noticeScroll: true,
    banners: [],
    importCustomers: [],
    userInfo: {},
    shopInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName'),// 如需尝试获取用户信息可改为false
    fontFamily: indexApp.globalData.fontFamily,
    swiperIndex: '',
    swiperData: [],
    tabs: [{ title: '王牌ageLOC' }, { title: '身体护理' }, { title: '护肤' },],
    activeId: '0',
    classifyChangeIndex: -1,
    isAttention: false,
    seachInputValue: '',
    showShare: false,
    UpgradeDialogShow: false,
    bannerTime: 3000,
    my_header_avater: indexApp.globalData.imageUrl + '/icons/user_avatar.svg',
    shopId: '',
    age: true,
    codeInfo: [],
    showBg: true,
    levelImg: '',
    followSubmit:true,
  },
  dialogevent(e: any) {
    console.log('e.detail.params=======', e.detail.params);
    this.setData({
      showDialog: e.detail.params,
    })

  },
  // 如新优选数据
  getGoodsSwiperData(id: any) {
    let that = this
    // let _userInfo = wx.getStorageSync('userInfo')
    // debugger
    util.request(api.optimizationAll, { shopId: id }, 'get').then(function (res: any) {
      let _swiperData = res.data.sort(that.compare('sequence'))
      let newswiperData = _swiperData.filter(item => {
        if (item.shopProductItemList.length == 1) {
          item.title = item.shopProductItemList[0].title
          item.image = item.image || item.shopProductItemList[0].image
        }
        return item.shopProductItemList.length > 0
      });
      that.setData({
        swiperData: newswiperData,
      })
    });
  },
  changeGoodsItem(ev) {
    let _id = ev.currentTarget.dataset.item.id || ev.currentTarget.dataset.item.officialRecommendationId
    let _isOfficial = ev.currentTarget.dataset.item.isOfficial
    let _operationType = ev.currentTarget.dataset.item.operationType

    // if(_isOfficial){
    //   return
    // }
    wx.navigateTo({
      url: `/packageOne/pages/productDetail/productDetail?id=${_id}&isOfficial=${_isOfficial}&operationType=${_operationType}`
    })

  },
  // 排序方法
  compare(name: any) {
    return function (a: any, b: any) {
      var value1 = a[name];
      var value2 = b[name];
      return value1 - value2;
    }
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs',
    })
  },
  test() {
    wx.navigateTo({
      url: '/packageOne/pages/evaluate/evaluate'
    })
  },
  jumpShopOwneSet() {
    wx.navigateTo({
      url: '/packageOne/pages/shopOwneSet/shopOwneSet',
    })
  },
  focusH5() {
    wx.navigateTo({
      url: `/pages/customerPage/index?url=${indexApp.globalData.h5Address}searchPage&flag=searchPage&currentTime=${Date.parse(new Date().toString())}&params=${encodeURIComponent(JSON.stringify(util.getCommonArguments()))}`
    })
  },
  changeclassifyItem(e: any) {
    util.showOtherToast('加载中', "loading");
    let that = this
    let _index = e.currentTarget.dataset.index
    this.setData({
      classifyName: this.data.tabs[_index].title,
      pageNum: 1,
      goodsListData: [],
      isLoading: true
    })

    this.data.tabs[_index].title
    let _data = {
      classify_name: this.data.tabs[_index].title,
      page_num: 1,
      page_size: 10,
    }
    util.request(api.recommendationSearch, _data).then((res: any) => {
      if (res.data.itemVos.list.length) {
        // this.data.shopkeeperRecommend=this.data.shopkeeperRecommend.sort(this.compare('sequence'))
        wx.hideToast()
        res.data.itemVos.list.forEach((item, index) => {
          item.itemPrice ? "" : item.itemPrice = []
          item.itemPrice.forEach(cItem => {
            let _type = cItem.priceType || cItem.saleType
            switch (_type) {
              case 'P1':
                item.retailPrice = cItem.salePrice
                break;
              case 'P3':
                break;
              case '23':
                item.starPrice = cItem.salePrice
                break;
              default:
                break;
            }
          });

        });
        let _unshiftList = []
        this.data.shopkeeperRecommend.forEach(item => {
          res.data.itemVos.list.forEach((cItem, index) => {
            if (item.itemId == cItem.itemId) {
              res.data.itemVos.list.splice(index, 1);
              _unshiftList.push(item);
            }
          });

        })
        let _data = [..._unshiftList, ...res.data.itemVos.list]
        wx.hideToast();
        that.setData({
          isLoading: false,
          goodsListData: _data,
          classifyTotal: res.data.itemVos.total
        })

      }
    }).catch(() => {
      that.setData({
        isLoading: false,
      })
    });
    this.setData({
      classifyChangeIndex: _index,
    })
  },
  changeclassifyOne() {
    this.getRecommendation()
    this.setData({
      classifyChangeIndex: -1,
    })
  },

  attention() {
    var _this = this
    util.checkLogin().then(() => {
      console.log('我登录了', wx.getStorageSync('shopId'));
      // _this.getUserFollow();
     
      if(_this.data.followSubmit){
        _this.setData({
            followSubmit:false,
        })
        _this.toFollow();
        setTimeout(()=>{
            _this.setData({
                followSubmit:true,
            })
        },2000)
    }
    }).catch(() => {
      console.log('我没登录了');
      util.getUserProfile();
      // this.getGoodsSwiperData()

    });
  },
  toFollow() {
    //   if(this.data.followSubmit){
        // this.setData({
        //     followSubmit:false,
        // })
        util.request(api.follow, { shopId: wx.getStorageSync('shopId') }, 'post').then((res: any) => {
        console.log(res);
        if (res) {
            this.setData({
            isAttention: !this.data.isAttention,
            })
            this.refreshUserInfo();
            getApp().sensors.track('AttentionShop', {
            });
        }

        }).catch((err: any) => {
        console.log(err);
        });
        // setTimeout(()=>{
        //     this.setData({
        //         followSubmit:true,
        //     })
        // })
// }
  },
  swiperChange(e: any) {
    const that = this;
    that.setData({
      swiperIndex: e.detail.current,
    })
  },
  navigationTo(e: any) {
    console.log(e)
    wx.navigateTo({
      url: e.currentTarget.dataset.item.path,
    })
  },
  // isHasShopRegister() {
  //   util.request(api.getStoreRegistration).then((res: any) => {
  //     if (res.data) {
  //       wx.reLaunch({
  //         url: "/pages/register/register?url=https://china.nuskin.com/shop/register"
  //       })
  //     }
  //   }).catch((err: any) => {
  //     console.log(err);
  //   })
  // },
  getUserInfo() {
    let that = this
    util.request(api.getUserInfo).then((res: any) => {
      console.log('9999', res)
      this.setData({
        userLevel: res.data.nuskinUserInfo.level
      })
      if (res.data.nuskinUserInfo.type == 1) {
        this.setData({
          userLevel: 1
        })
      }
      res.data.userProfile.avatar = res.data.userProfile.avatar ? res.data.userProfile.avatar : JSON.parse(wx.getStorageSync("permisssion").rawData).avatarUrl
      res.data.userProfile.nickname = res.data.userProfile.nickname ? res.data.userProfile.nickname : JSON.parse(wx.getStorageSync("permisssion").rawData).nickName
      let data = Object.assign({}, res.data.user, res.data.userProfile, res.data.nuskinUserInfo);
      //注册店铺
      // this.isHasShopRegister()
      wx.setStorageSync('userInfo', data);
      that.setData({
        userInfo: data,
        hasUserInfo: true,
      });
    }).catch(() => {
      that.setData({
        hasUserInfo: false,
      });
    })
  },
  // 获取用户关注店铺
  getUserFollow() {
    let _that = this
    util.request(api.userFollow).then((res: any) => {
      let nowId = wx.getStorageSync('shopId')
      console.log('###', nowId, res.data.id)
      if (res.data) {
        _that.setData({ isAttention: true })

      } else {
        _that.setData({ isAttention: false })

      }
      if (!res.data.id || nowId == res.data.id) {
        return
      }
      wx.setStorageSync('shopId', res.data.id)
      _that.getGoodsSwiperData(res.data.id)
      _that.getShopInfo(res.data.id)
      console.log('测试专属字段--shopid=======', res.data.id);
      _that.setData({
        classifyChangeIndex: -1,
        goodsListData: []
      })
      _that.getRecommendation()
      _that.refreshUserInfo();
    }).catch(() => {

    })

  },
  shopInfo(e: any) {
    this.setCodeInfo(e.detail.partner)
    e.detail.shopAge = e.detail.shop && e.detail.shop.startTime ? util.timeTmp(e.detail.shop.startTime) : 0,
      e.detail.shop.id && wx.setStorageSync('shopInfo', e.detail)
    this.setData({
      shopInfo: e.detail
    });
  },
  // 获取店铺信息
  getShopInfo(shopId: any) {
    let _that = this
    util.request(api.getShopInfo, { shop_id: shopId }, 'get').then(function (res: any) {
      if (res && res.data.shop) {
        res.data.fansNum = res.data.shop.fansCount
        res.data.shopAge = res.data.shop && res.data.shop.startTime ? util.timeTmp(res.data.shop.startTime) : 0,
          res.data.shop.id && wx.setStorageSync('shopInfo', res.data)
        _that.setCodeInfo(res.data.partner)
        _that.setData({
          shopInfo: res.data,
          levelImg: res.data.levelImage
        });
        wx.setStorageSync("levelImg", res.data.levelImage)
        getApp().sensors.registerApp({
          shop_name: res.data.shop.name,
          shop_id: res.data.shop.id,
          shopowner_accountId: res.data.partner.nkMemberId,
          app_name: '如新NU店顾客端',
          account_id: wx.getStorageSync('userInfo').accountId,
          user_style: '',

        });
      }
    });

  },

  //获取店铺设置状态
  getShopConfig(shopId: string) {
    util.request(api.getShopConfig, { shop_id: shopId }, 'get').then((res: any) => {
      console.log(res, "------------------");
      this.setData({
        age: res.data.age
      })
    })
  },
  setCodeInfo(partner: any) {
    let codeInfo: any[] = []
    let typeData = ['mobile', 'wechatNo', 'xiaoHongShuNo', 'tiktokNo', 'microblogNo']
    typeData.forEach((item: any) => {
      if (partner[item]) {
        if (item === 'mobile') {
        //   codeInfo.push({ value: partner[item], iconPath: indexApp.globalData.imageUrl + '/icons/mobile.svg' })
        } else if (item === 'wechatNo') {
          codeInfo.push({ value: partner[item], iconPath: indexApp.globalData.imageUrl + '/icons/weixin1.svg' })
        } else if (item === 'xiaoHongShuNo') {
          codeInfo.push({ value: partner[item], iconPath: indexApp.globalData.imageUrl + '/icons/redbook.svg' })
        } else if (item === 'tiktokNo') {
          codeInfo.push({ value: partner[item], iconPath: indexApp.globalData.imageUrl + '/icons/TikTok.svg' })
        } else if (item === 'microblogNo') {
          codeInfo.push({ value: partner[item], iconPath: indexApp.globalData.imageUrl + '/icons/micro-blog.svg' })
        }
      }
    })
    this.setData({
      codeInfo: codeInfo.slice(0, 3)
    })
  },
  onPageScroll: function (e) {
    console.log(e.scrollTop);
    if (e.scrollTop > 80) {
      this.setData({ showBg: false })

    } else {
      this.setData({ showBg: true })

    }



  },
  onLoad(options) {
    wx.hideShareMenu({
      menus: ['shareAppMessage', 'shareTimeline']
    })
    util.getThemeColor({ shopId: options.shopId }).then((res: any) => {
      this.setData({ bg: wx.getStorageSync('indexBg') });
    })
    let shopId = options && options.shopId
    // shopId ? shopId = Number(shopId) : shopId = ''
    console.log('我是分享进来的店铺', shopId)
    let shareKey = options && options.shareKey || ''
    console.log('我是分享进来的shareKey', shareKey)
    shareKey ? wx.setStorageSync('shareKey', shareKey) : ''
    shopId ? wx.setStorageSync('shopId', shopId) : shopId = wx.getStorageSync('shopId')

    if (shopId) {
      setTimeout(() => {
        this.setData({
          themeColor: wx.getStorageSync('themeColor'),
        })
      }, 1000);
      this.getGoodsSwiperData(shopId)
      this.getShopInfo(shopId)
    } else {
      this.setData({
        shopId: shopId
      })
    }

    this.getBanner();
    // 获取店主推荐
    this.getRecommendation()
    // 绑定上级分享人
    util.bindShareUser()
    // util.getThemeColor({shopId,openId:wx.getStorageSync('openId')}).then((res1: any) => {
    //   console.log(res1)
    //   wx.setStorageSync('themeColor', res1.data.primaryColor);
    //   indexApp.globalData.themeColor = res1.data.primaryColor;
    //   this.setData({themeColor:res1.data.primaryColor})


    // })
  },
  onHide: function () {
    this.setData({
      indexTopSwiper: false,
      noticeScroll: false,
    });
    this.selectComponent("#dialogProtocol").close();
  },
  updateTime() {
    util.request(api.updateVisitTime, {}).then((res: any) => {
      //   console.log(res,'22222')

    })

  },
  onReady() {
  },
  payAndFollow() {
    if (wx.getStorageSync('orderId')) {
      util.request(api.payAndFollow, { shopId: wx.getStorageSync('shopInfo').shop.id, orderId: wx.getStorageSync('orderId') }, 'post').then((res: any) => {
        console.log('关注店铺吗=====', res);
        if (res && res.data) {
          this.setData({
            payDialog: true,
          })
        }
      })
    }
  },
  onShow: function () {
    if (wx.getStorageSync("cookie") && !imClient.connected) {
      const imInfo = { userID: wx.getStorageSync("currentUserInfo").uid, userSig: wx.getStorageSync("userSign") }
      imClient.connect(imInfo)
    }
    if (wx.getStorageSync('shopId')) {
      this.getGoodsSwiperData(wx.getStorageSync('shopId'))
      this.getShopConfig(wx.getStorageSync('shopId'))
      this.getShopInfo(wx.getStorageSync('shopId'))
    }

    console.log('!!!!', indexApp.globalData.themeColor)
    this.setData({ 'themeColor': indexApp.globalData.themeColor })
    this.setData({ bg: wx.getStorageSync('indexBg') });

    // setTimeout(() => {
    //   let _shopId = wx.getStorageSync('shopId')
    //   if (_shopId && this.data.swiperData.length != 0) {
    //     this.getGoodsSwiperData(_shopId)
    //   }
    //   if (_shopId && this.data.goodsListData.length != 0) {
    //     this.getRecommendation()
    //   }
    // }, 3000);

    util.getUrl();

    this.setData({
      themeColor: indexApp.globalData.themeColor,
      // my_header_avater: changeSvg.svgColor(indexApp.globalData.imageUrl+'/icons/user_avatar.svg', indexApp.globalData.themeColor, 'stroke'),
      // shopkeeperRecommendIcon: changeSvg.svgColor(indexApp.globalData.imageUrl+'/icons/shopkeeperRecommend.svg', indexApp.globalData.themeColor),
      // fansbBgIcon: changeSvg.svgColor(indexApp.globalData.imageUrl+'/icons/fans_bg.svg', indexApp.globalData.themeColor),
      // youxuanIcon: changeSvg.svgColor(indexApp.globalData.imageUrl+'/icons/youxuan.svg', indexApp.globalData.themeColor),
    });
    this.changeColor('my_header_avater', indexApp.globalData.imageUrl + '/icons/user_avatar.svg', indexApp.globalData.themeColor, 'stroke')
    this.changeColor('shopkeeperRecommendIcon', indexApp.globalData.imageUrl + '/icons/shopkeeperRecommend.svg', indexApp.globalData.themeColor)
    this.changeColor('fansbBgIcon', indexApp.globalData.imageUrl + '/icons/fans_bg.svg', indexApp.globalData.themeColor)
    this.changeColor('youxuanIcon', indexApp.globalData.imageUrl + '/icons/youxuan.svg', indexApp.globalData.themeColor)

    console.log(this.data.themeColor, '######')
    if (this.selectComponent("#dialogProtocol")) {
      this.selectComponent("#dialogProtocol").close();
    }
    // let that = this;
    // console.log('5555555=====', this.selectComponent("#dialogProtocol"))
    // this.selectComponent("#dialogProtocol").close();
    let that = this
    that.setData({
      showShare: false,
      classifyChangeIndex: -1,
    })
    this.getRecommendation()
    util.checkLogin().then(() => {
      // 获取关注店铺
      that.getUserFollow()
      that.getUserInfo();
      that.updateTime()
      if (wx.getStorageSync('paySuccess')) {
        this.setData({
          payDialog: true,
        })
      }
      // this.isFollow();
      //   this.payAndFollow();
      this.refreshUserInfo();
      that.setData({
        hasUserInfo: true,
        userInfo: wx.getStorageSync('userInfo'),
        showDialog: true,
        // shopInfo: wx.getStorageSync('shopInfo')
      });
    }).catch(() => {
      this.setData({
        hasUserInfo: false,
      });
    })
    this.setData({
      indexTopSwiper: true,
      noticeScroll: true
    })
    let info = wx.getSystemInfoSync();
    let sysHeight = info.windowHeight - 100;
    this.setData({
      sysHeight: sysHeight,
      autoplay: true
    });
    wx.removeStorageSync('categoryId');



  },
  changeColor(name: string, url: string, color = '#EBEBEB', type = 'fill') {
    util.svgColor(url, color, type).then((res: any) => {
      this.setData({ [name]: res })
    })


  },
  refreshUserInfo() {
    var _this = this
    util.request(api.getUserInfo).then(function (res: any) {
      console.log('获取个人信息信息====', res);
      if (res && res.data.user) {
        wx.setStorageSync('userInfo', Object.assign({}, res.data.user, res.data.userProfile, res.data.nuskinUserInfo));
        // util.showOtherToast('登录成功', 'success');
        console.log(res, '#########');
        if (res && res.data.userShopInfo && res.data.userShopInfo.shop) {
          console.log(res, '00000');
          res.data.userShopInfo.shop.id && wx.setStorageSync('shopInfo', res.data.userShopInfo);
          res.data.userShopInfo.shopAge = res.data.userShopInfo.shop.startTime ? util.timeTmp(res.data.userShopInfo.shop.startTime) : 0
          if (res.data.userShopInfo.shop.id) {
            _this.setCodeInfo(res.data.userShopInfo.partner)
            _this.setData({ shopInfo: res.data.userShopInfo })
          }

          console.log(_this.data.shopInfo)

        }
        if (!res.data.userShopInfo.fansNum) {
          console.log('5555555======');
          _this.getShopInfo(wx.getStorageSync('shopId'));

        }
        // setTimeout(() => {
        //   util.backAddress();
        // }, 1500)
      }
    });

  },
  //是否有弹窗
  isHaveProtocol() {
    var query = wx.createSelectorQuery();
    //选择id
    query.select('.common_dialog_bg').boundingClientRect(function (rect) {
      console.log('是否有弹窗信息', rect);
    }).exec();
  },

  // 关闭分享
  closeSharePosters() {
    this.setData({
      showShare: false
    })
  },
  strCode(str: any) {  //获取字符串的字节数
    var count = 0;  //初始化字节数递加变量并获取字符串参数的字符个数
    if (str) {  //如果存在字符串，则执行
      let len = str.length;
      for (var i = 0; i < len; i++) {  //遍历字符串，枚举每个字符
        if (str.charCodeAt(i) > 255) {  //字符编码大于255，说明是双字节字符(即是中文)
          count += 2;  //则累加2个
        } else {
          count++;  //否则递加一次
        }
      }
      console.log(count);
      return count;  //返回字节数
    } else {
      console.log(0);
      return 0;  //如果参数为空，则返回0个
    }
  },
  // 打开分享
  openSharePosters(ev: any) {

    util.checkLogin().then(() => {
      // let _userInfo = wx.getStorageSync('userInfo')
      let _shopInfo = wx.getStorageSync('shopInfo')
      let _shopId = wx.getStorageSync('shopId')
      let _shareKey = wx.getStorageSync('shareKey') || ''
      let _themeColor = wx.getStorageSync('themeColor').substring(1)
      let _data = JSON.parse(JSON.stringify(ev.detail))
      let _nickname = _shopInfo.partnerProfile.nickname
      let nameWidthArr = _nickname.split('')
      let _namewidth = 0
      nameWidthArr.forEach(item => {
        let number = item.replace(/[^\x00-\xff]/g, "**")
        if (number == "**") {
          _namewidth = _namewidth + 15
        } else if (!isNaN(number)) {
          _namewidth = _namewidth + 9.9
        } else {
          _namewidth = _namewidth + 10
        }
      });
      if (_namewidth >= 88) {
        _data.views[9].left = _data.views[7].left + 85
      } else {
        _data.views[9].left = _data.views[7].left + _namewidth
      }
      if (_namewidth >= 170) {
        _data.views[6].top = _data.views[6].top + 16
        _data.views[10].top = _data.views[10].top + 16
      }
      _data.views[5].content = _nickname
      _data.views[6].content = _shopInfo.partner.mobile
      _data.views[7].content = _nickname
      // _data.views[11].url = res.data.wxQrcode || this.data.wxQrcode
      // _data.views[11].isBase64 = true
      _data.views[12].url = _shopInfo.partnerProfile.avatar || indexApp.globalData.imageUrl+'/icons/accountPictures.png'
      let noAvatar = {
        type: 'roundRect',
        top: 45,
        left: 79,
        width: 90,
        height: 90,
        background: '#fff',
        borderRadius: 45
      }
      _data.views.splice(5, 0, noAvatar);
      this.setData({
        showShare: true,
        painting: _data
      })
      let requstData = {
        id: _shopId,
        path: `pages/loadingPage/loadingPage?shopId=${_shopId}&tc=${_themeColor}`,
        shareKey: _shareKey,
      }
      util.showOtherToast('加载中', "loading");
      util.request(api.shareShop + '/' + _shopId, requstData, 'post').then((res: any) => {
        console.log('shareKey', res.data.shareKey)
        console.log('shareInfo', res.data.shareInfo)
        wx.setStorageSync('newShareKey', res.data.shareKey)
        let _wxQrcodeData = {
          type: 'image',
          url: res.data.wxQrcode,
          top: 260,
          left: 170,
          width: 50,
          height: 50,
          isBase64: true
        }
        this.setData({
          shareData: res.data,
          wxQrcode: res.data.wxQrcode,
          wxQrcodeData:_wxQrcodeData
        })
       
      })
    }).catch(() => {
      console.log('我没登录了');
      util.getUserProfile();
    });



  },

  upgradeOpenShare(ev: any) {
    this.setData({
      painting: ev.detail
    })
    this.setData({
      UpgradeDialogShow: false
    })
    this.setData({
      showShare: true
    })
  },
  getBanner: function () {
    console.log('@@@@@@');
    let that = this;
    util.request(api.bannerList, {}).then((res: any) => {
      console.log('$$$', res);
      if (res) {
        res.data.forEach((item: any) => {
          var re = new RegExp("^(http|https)://", "i");
          console.log(item, '@@@@@0', re.test(item.bannerItemVo.imageUrl))


          item.bannerItemVo.imageUrl = re.test(item.bannerItemVo.imageUrl) ? item.bannerItemVo.imageUrl : 'https://' + item.bannerItemVo.imageUrl

        });
        res.data.sort((a, b) => { return a.bannerItemVo.sequence - b.bannerItemVo.sequence })
        console.log(res.data)
        that.setData({ banners: res.data })
        that.setData({ bannerTime: res.data[0].intervals ? res.data[0].intervals * 1000 : 3000 })

      }
    }).catch((err: any) => {
      console.log(err);
    })
  },
  toLink(e:any) {
    console.log(e);
    var _this = this;
    if (e.currentTarget.dataset.banner.type == 1) {
      wx.navigateTo({
        url: e.currentTarget.dataset.banner.url,
      })
    } else if (e.currentTarget.dataset.banner.type == 2) {
      console.log(e.currentTarget.dataset.banner.appId)
      var appid = e.currentTarget.dataset.banner.appId.replace('"', "").replace('"', "").replace("'", "").replace("'", "");
      wx.navigateToMiniProgram({
        appId: appid,
        path: e.currentTarget.dataset.banner.url,
        envVersion: 'trial',// 打开正式版
        extraData: {
            nuskinAuth:wx.getStorageSync('access_token'),
            flag:'customer',
            shareKey:wx.getStorageSync('shareKey')
        },
        success(res) {
          // 打开成功
        },
        fail: function (err) {
          console.log(err);
        }
      })
    } else {
        console.log('lanjie====',e.currentTarget.dataset.banner);
        let currentParams=decodeURIComponent(e.currentTarget.dataset.banner.url);
        let getUrl=currentParams.includes('?')?currentParams.split('?')[0]:currentParams;
        let getParams=currentParams.includes('?')?currentParams.split('?')[1]:'';
        console.log('nadaode===',getParams);
      wx.navigateTo({
        url: `/pages/bannerDetail/bannerDetail?url=${getUrl}&${getParams}`,
      })
    }
  },
  // 店主推荐
  getRecommendation() {
    util.showOtherToast('加载中', "loading");
    let that = this
    let _id = wx.getStorageSync('shopId') || ''
    if (!_id) {
      this.setData({
        goodsListData: [],
        isLoading: false
      })
      return
    }
    this.setData({
      goodsListData: [],
      isLoading: true
    })

    util.request(api.recommendation, { shop_id: _id }).then((res: any) => {
      console.log(res);

      if (res && res.data.length > 0) {
        res.data.forEach(item => {
          // item.product.itemPrice ? "" : item.product.itemPrice=[]
          item.itemInfo.itemPrice.forEach(cItem => {
            let _type = cItem.priceType || cItem.saleType
            switch (_type) {
              case 'P1':
                item.itemInfo.retailPrice = cItem.salePrice
                break;
              case 'P3':
                break;
              case '23':
                item.itemInfo.starPrice = cItem.salePrice
                break;
              default:
                break;
            }

          });

        });
        res.data = res.data.sort(that.compare('sequence'))
        let _newData = []
        res.data.forEach(item => {
          _newData.push(item.itemInfo)
        });
        wx.hideToast()
        that.setData({
          goodsListData: _newData,
          isLoading: false,
          shopkeeperRecommend: _newData
        })
      }
    }).catch((err: any) => {
      this.setData({
        isLoading: false
      })
      console.log(err);
    })
    this.setData({
      isLoading: false
    })


  },


  onShareAppMessage() {
    // 分享
    let _that = this
    let _userInfo = wx.getStorageSync('userInfo')

    let _newShareKey = wx.getStorageSync('newShareKey')
    let shopId = wx.getStorageSync('shopId') || ''
    let _themeColor = wx.getStorageSync('themeColor').substring(1)
    // setTimeout(() => {
    this.setData({
      isShare: true,
    })
    // }, 2000);
    const promise = new Promise(resolve => {
      resolve({
        title: _that.data.shopInfo.partnerProfile.nickname + '的如新NU店',
        path: `pages/loadingPage/loadingPage?shopId=${shopId}&shareKey=${_newShareKey}&tc=${_themeColor}`,
        imageUrl: 'https://nuskin-1257745828.cos.ap-shanghai.myqcloud.com/20220415/c3c835a1-2c3e-4a84-9262-02cde140f4fc.png'
      })
    })
    this.setData({
      showShare: false,
    })
    return {
      title: _that.data.shopInfo.partnerProfile.nickname + '的如新NU店',
      path: `pages/loadingPage/loadingPage?shopId=${shopId}&shareKey=${_newShareKey}&tc=${_themeColor}`,
      imageUrl: 'https://nuskin-1257745828.cos.ap-shanghai.myqcloud.com/20220415/c3c835a1-2c3e-4a84-9262-02cde140f4fc.png',
      promise
    }
  },
  // 店主推荐滚动到底部
  // scrolltolower

  onReachBottom() {
    console.log(123);

    let that = this
    if (this.data.classifyChangeIndex != -1) {
      util.showOtherToast('加载中', "loading");
      if (this.data.goodsListData.length >= this.data.classifyTotal) {
        wx.showToast({
          title: '已加载完当前分类',
          icon: 'none',
          duration: 2000
        })
        return
      }
      this.setData({
        pageNum: this.data.pageNum + 1
      })
      let _data = {
        classify_name: this.data.classifyName,
        page_num: this.data.pageNum,
        page_size: this.data.pageSize,
      }
      util.request(api.recommendationSearch, _data).then((res: any) => {
        if (res.data.itemVos.list.length) {
          res.data.itemVos.list.forEach(item => {
            item.itemPrice ? "" : item.itemPrice = []
            item.itemPrice.forEach(cItem => {
              switch (cItem.saleType) {
                case 'P1':
                  item.retailPrice = cItem.salePrice
                  break;
                case 'P3':
                  break;
                case '23':
                  item.starPrice = cItem.salePrice
                  break;
                default:
                  break;
              }
            });

          });
          wx.hideToast()
          let _goodsListData = [...that.data.goodsListData, ...res.data.itemVos.list]
          let _unshiftList = []
          this.data.shopkeeperRecommend.forEach(cItem => {
            _goodsListData.forEach((item, index) => {
              if (cItem.itemId == item.itemId) {
                _goodsListData.splice(index, 1);
                _unshiftList.push(cItem);
              }
            })
          })
          // _unshiftList=_unshiftList.sort(that.compare('sequence'))
          // debugger
          _goodsListData = [..._unshiftList, ..._goodsListData]
          that.setData({ goodsListData: _goodsListData })
        }
      })
    }
  }

})
