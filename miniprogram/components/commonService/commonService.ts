// components/commonService/commonService.ts
const commonServiceApp = getApp<IAppOption>();
import imClinet from '../../utils/imClient';
var api = require('../../config/api')
var util = require('../../utils/util');
Component({
  /**
   * 组件的属性列表
   */

  properties: {
    showShare: {
      type: Boolean,
      value: true
    },
    understanding: {
      type: Boolean,
      value: true
    },
    showCustomer: {
      type: Boolean,
      value: true
    },
    bgColor: {
      type: String,
      value: ''
    },
    bottom: {
      type: String,
      value: '198rpx'
    },

  },

  /**
   * 组件的初始数据
   */
  data: {
    conversationList:[{conversationID:'',unreadCount:0}],
    hasPhone: false,
    customerPhone: '',
    imageUrl:commonServiceApp.globalData.imageUrl,
    buttonClicked: false,
    themeColor: commonServiceApp.globalData.themeColor,
    painting: {
      width: 248,
      height: 366,
      background: '#fff',
      clear: true,
      type:'2',
      views: [{
        type: 'rect',
        top: 0,
        left: 0,
        width: 248,
        height: 366,
        background: '#fff'
      },
      {
        type: 'image',
        url: 'https://nuskin-1257745828.cos.ap-shanghai.myqcloud.com/20220415/f4845ec7-924c-4479-8ac7-cb79d7f01a91.png',
        top: 12,
        left: 0,
        width: 250,
        height: 210,
      },

      {
        type: 'roundRect',
        top: 248,
        left: 16,
        width: 216,
        height: 80,
        background: commonServiceApp.globalData.themeColor,
        borderRadius: 8,
      },
      {
        type: 'roundRect',
        top: 249,
        left: 17,
        width: 214,
        height: 78,
        background: '#fff',
        borderRadius: 8,
        borderColor: commonServiceApp.globalData.themeColor,
      },
      {
        type: 'arc',
        top: 40,
        left: 74,
        width: '100',
        height: '100',
        background: commonServiceApp.globalData.themeColor,
      },
      {
        type: 'text',
        content: '蓝色的枫叶',
        fontSize: 16,
        lineHeight: 22,
        color: '#383549',
        textAlign: 'center',
        top: 170,
        left: 124,
        width: 160,
        bold: true,
        MaxLineNumber: 2,
        breakWord: true,

        // breakWord: true,
        // bolder: true
      },
      {
        type: 'text',
        content: '13255998901',
        fontSize: 14,
        lineHeight: 17,
        color: '#4A4A4A',
        textAlign: 'left',
        top: 202,
        left: 88,
        width: 40,
        MaxLineNumber: 1,
        // breakWord: true,
        // bolder: true
      },
      {
        type: 'text',
        content: '蓝色的枫叶',
        fontSize: 14,
        lineHeight: 20,
        color: '#383549',
        textAlign: 'left',
        top: 262,
        left: 28,
        width: 70,
        MaxLineNumber: 1,
        breakWord: true,
        bold: true,

        // bolder: true
      },
      {
        type: 'text',
        content: '识别二维码，进入店铺了解更多信息。',
        fontSize: 10,
        lineHeight: 14,
        color: '#4A4A4A',
        textAlign: 'left',
        top: 286,
        left: 28,
        width: 104,
        MaxLineNumber: 2,
        breakWord: true,
        // bolder: true
      },
      {
        type: 'text',
        content: '的如新NU店',
        fontSize: 10,
        lineHeight: 14,
        color: '#8c8c8c',
        textAlign: 'left',
        top: 264,
        left: 102,
        width: 200,
        MaxLineNumber: 1,

      },
      {
        type: 'image',
        url: 'https://nuskin-1257745828.cos.ap-shanghai.myqcloud.com/20220415/30f867db-56fe-474c-bc1b-efa643333c43.png',
        top: 204,
        left: 72,
        width: 10,
        height: 13,
      },
   
      {
        type: 'text',
        content: '',
        top: 340,
        left: 95,
        width: '67',
        height: '14',
      },
      {
        type: 'image',
        url: '',
        top: 45,
        left: 79,
        width: 90,
        height: 90,
        borderRadius: 45,
      },
      ],
    },
  },
  pageLifetimes: {
    show: function () {
      // util.getThemeColor().then((themeColor:string)=>{
      this.setData({
        themeColor: commonServiceApp.globalData.themeColor
      })
      // });
    }
  },


  /**
   * 组件的方法列表
   */
  methods: {
    openSharePosters() {
      commonServiceApp.globalData.themeColor = wx.getStorageSync('themeColor')
      this.setData({
        themeColor: wx.getStorageSync('themeColor') || commonServiceApp.globalData.themeColor,
        painting: this.data.painting
      })
      this.triggerEvent('openSharePosters', this.data.painting)

    },
    toKnow() {
        if(wx.getStorageSync('cookie')){
            util.request(`${api.konwNuskin}?shop_id=${wx.getStorageSync('shopId')}`).then(function (res: any) {
                // if (res && res.data) {
                    wx.navigateTo({
                        url: `/pages/customerPage/index?url=${commonServiceApp.globalData.customerH5}/impression/impression-m-2020/`
                      })
                // }
            });
        }else{
            wx.navigateTo({
                url: `/pages/customerPage/index?url=${commonServiceApp.globalData.customerH5}/impression/impression-m-2020/`
              })
    }
      
    },
    onService() {
      let _that = this;
        if(wx.getStorageSync('cookie')){
            util.request(`${api.groupPeople}?shop_id=${wx.getStorageSync('shopId')}`).then(function (res: any) {
                if (res && res.data) {
                    _that.getConversationList();
                }else{
                    _that.getPhoneNumber();
                }
            });
        }else{
            _that.getPhoneNumber();
        }
    },
            // 获取会话列表
            getConversationList() {
                let that=this;
                util.request(api.getSendId).then(function (res: any) {
                    if (res && res.data) {
                        that.setData({
                            buttonClicked:true
                        })
                        let arr:any = []
                        arr.push(res.data.tmpId)
                        console.log('12345====',arr);
                        wx.requestSubscribeMessage({
                            tmplIds: arr,
                            success (res) { 
                                console.log('---------',res,res[arr[0]]);
                                if (res[arr[0]]=='accept') {//用户同意授权
                                    that.getSaveFlag()
                                }
                                wx.getSetting({
                                    withSubscriptions: true,
                                    success (res:any) {
                                        console.log('是否勾选',res,res.subscriptionsSetting);
                                        if (res.subscriptionsSetting.mainSwitch&&res.subscriptionsSetting.itemSettings&&res.subscriptionsSetting.itemSettings[arr[0]]=='accept') {
                                            that.getSaveFlag()
                                        }
                                    }
                                })
                                let promise = imClinet.tim.getConversationList();
                                promise.then((imResponse:any)=> {

                                    // 全量的会话列表，用该列表覆盖原有的会话列表
                                    console.log('imResponse====',imResponse);
                                const conversationList = imResponse.data.conversationList.filter((item:any)=>{return item.userProfile.userID==wx.getStorageSync('shopInfo').partner.uid}); 
                                that.setData({
                                    conversationList,
                                    buttonClicked:false
                                });
                                console.log('conversationList====',conversationList)
                                let conversationInfomation:any = { conversationID: that.data.conversationList[0].conversationID,
                                    unreadCount: that.data.conversationList[0].unreadCount  };
                                    const url = `/TUI-CustomerService/pages/TUI-Chat/chat?conversationInfomation=${JSON.stringify(conversationInfomation)}`;
                                    wx.navigateTo({
                                        url,
                                    });
                            
                                }).catch((imError:any)=> {
                                    that.setData({
                                        buttonClicked:false
                                    })
                                console.warn('getConversationList error:', imError); // 获取会话列表失败的相关信息
                                });
                            }
                        })
                    }
                }).catch((err:any)=>{
                    console.warn('getSendId error:', err);
                });
              },
    getSaveFlag(){
        util.request(api.getSaveFlag).then(function (res: any) {
            console.log('------------------',res);
        });
    },
    getPhoneNumber(){
        let _that=this;
        util.request(api.customerService).then(function (res: any) {
            if (res && res.data) {
            _that.setData({
                customerPhone: res.data.ot,
                // customerPhone:'400-004-5678',
                hasPhone: true,
            });
            _that.triggerEvent('dialogevent', { params: true });
            }
        });
    },
    positionevent() {
      this.triggerEvent('dialogevent', { params: false });
    },
    tapDialogButton(e: any) {
      if (e.detail.index == 0) {
        this.setData({
          hasPhone: false
        })
      } else {
        wx.makePhoneCall({
          phoneNumber: this.data.customerPhone,
        })


      }

    }

  }
})
