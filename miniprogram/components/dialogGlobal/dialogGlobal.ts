const dialogApp = getApp<IAppOption>();
var util = require('../../utils/util');
var api = require('../../config/api');
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    //拨打电话
    phone: {
      type: String,
      value: '400-004-5555',
    },
    showCallPhone: {
      type: Boolean,
      value: false,
    },
    //补全信息
    shopKeeperInfo: {
      type: Object,
      value: {}
    },
    // showProtocol: {
    //   type: Boolean,
    //   value: false
    // },
    //  protocols: {
    //   type: String,
    //   value: '以下隐私协议'
    // },
    //是否首页
    isTrue: {
      type: Boolean,
      value: false
    },
    //组件区分
    // 1.协议 2.电话 后面依次递增
    componentType: {
      type: Number,
      value: 1,
      required: true
    }

  },

  /**
   * 组件的初始数据
   */
  data: {
    themeColor: dialogApp.globalData.themeColor,
    showGetBradge: false,
    showProtocol: false,
    showNewUser: false,
    showAddInfoDialog: false,
    protocols: '',
    protocolsVersion: '',
    protocolCon: '',
    time: 5,
    disabled: true,
    isMatch: 0,
    signFlag: true,
    newUserImg: dialogApp.globalData.staticFont

  },
  pageLifetimes: {
    show() {
      // util.getThemeColor().then((themeColor:string)=>{
      this.setData({
        themeColor: wx.getStorageSync('themeColor') || dialogApp.globalData.themeColor
      })
      // })
      this.setData({
        disabled: true,
        time: 5
      })
      let _self = this;
      util.checkLogin().then(() => {
        // console.log('登录后的保存====')
        if (wx.getStorageSync('protocolInfo')) {
          if (!wx.getStorageSync('notloginProSubmit')) {
            // console.log('只走一次');
            if (_self.data.componentType == 1) {
              setTimeout(() => {
                _self.saveProtocol(1);//只走一次
              }, 1500);
            }
          } else {
            if (_self.data.componentType == 1) {
              // console.log('11110====');
              _self.getLoginProtocols();//避免一起出现
            }
          }
        }
      }).catch(() => {
        console.log('没登录该做的事情');
        if (this.data.componentType == 1) {
          _self.getNotLoginProtocols();
        }
      })

    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    closeShare() {
      this.setData({
        showNewUser: false
      })
    },
    goLogin() {
      this.setData({
        showNewUser: false
      })
      util.getUserProfile();
    },
    //禁止滚动
    preventTouchMove() {
      return;
    },
    //取消电话
    cancelPhone() {
      this.setData({
        showCallPhone: false,
      });
      this.triggerEvent('middleChangePosition', false);
      //   this.triggerEvent('dialogevent', { params: false });
    },
    //拨打电话
    callPhone() {
      wx.makePhoneCall({
        phoneNumber: this.data.phone,
      })
    },
    //登录协议
    getLoginProtocols() {
      let that = this;
      // if(wx.getStorageSync('loginProSubmit')){
      //   return;
      // }else{
      util.request(api.getProtocols).then(function (res: any) {
        if (res && res.data) {
          // console.log('登录后的协议',res.data);
          that.setData({
            protocolCon: res.data.memberTermsInfos[1]['content'],
            isMatch: res.data.memberTermsInfos[1].isMatch,
            protocols: res.data.memberTermsInfos[1],
            showNewUser: false,
            signFlag: res.data.memberTermsInfos[1].signFlag
          });
          wx.setStorageSync('protocolInfo', that.data.protocols);
          //协议是否有更新--弹出协议
          if (that.data.isMatch == 0 || that.data.signFlag == false) {
            that.setData({
              showProtocol: true,
            });
            wx.hideTabBar({});
            that.cutDown();
            that.triggerEvent('dialogevent', { params: true });
          }
        }
      });
      // }
    },
    //未登录协议
    getNotLoginProtocols() {
      let that = this;
    //   util.showOtherToast('加载中', 'loading', 40000);
      util.request(api.getNoLoginProtocols).then(function (res: any) {
        if (res && res.data) {
          wx.hideToast();
          that.setData({
            protocolCon: res.data.visitorTermsInfos[1]['content'],
            protocols: res.data.visitorTermsInfos[1],
            protocolsVersion: res.data.visitorTermsInfos[1]['version'],
          });
          wx.setStorageSync('userProtocolInfo', res.data.visitorTermsInfos[0]);
          wx.setStorageSync('newProtocolInfo', res.data.visitorTermsInfos[1]);
          //是否展示弹窗（本地存储小于接口版本弹）
          if (wx.getStorageSync('protocolInfo')) {
            console.log('this.data.protocolsVersion', that.data.protocolsVersion);
            console.log('protocolInfo', wx.getStorageSync('protocolInfo')['version']);
            if (that.data.protocolsVersion != wx.getStorageSync('protocolInfo')['version']) {
              that.setData({
                showProtocol: true,
              });
              wx.hideTabBar({});
              that.triggerEvent('dialogevent', { params: true });
            } else {
              that.setData({
                showNewUser: true,
                showProtocol: false,
              })
              that.triggerEvent('dialogevent', { params: true });
            }
          } else {
            that.setData({
              showProtocol: true,
            });
            wx.hideTabBar({});
            that.triggerEvent('dialogevent', { params: true });
          };
          that.cutDown();
        }
        // console.log('隐私=====', that.data.protocols);
      });
    },
    //倒计时
    cutDown() {
      var that = this;
      var countDown = that.data.time;
      var timer = setInterval(() => {
        countDown--;
        // console.log('开始倒计时');
        that.setData({
          disabled: true,
          time: countDown
        });
        if (countDown == 0) {
          clearInterval(timer);
          that.setData({
            disabled: false,
            time: 5
          })
        }
      }, 1000)
    },
    //关闭弹窗
    close() {
      this.setData({
        showProtocol: false
      })
    },
    agree() {
      let _that = this;
      util.checkLogin().then(() => {
        // console.log('提交给后台保存');
        _that.saveProtocol(2);
      }).catch(() => {
        // console.log('我没登录暂存本地storage');
        wx.setStorageSync('protocolInfo', this.data.protocols);
        _that.setData({
          showProtocol: false,
          showNewUser: true
        });
        _that.triggerEvent('dialogevent', { params: true });
        wx.showTabBar({});
        _that.triggerEvent('dialogevent', { params: true });
      })
    },
    //保存提交协议
    saveProtocol(num: number) {
      // console.log('进入保存协议');
      let _this = this;
      util.request(api.saveProtocols, { agreeEmp: "4", memberId: wx.getStorageSync('userInfo').nkMemberId, termsId: wx.getStorageSync('protocolInfo').id, typeId: wx.getStorageSync('protocolInfo').typeId }, 'POST').then((res: any) => {
        if (res && res.data) {
          if (num == 1) {
            //存前端的协议保存
            wx.setStorageSync('notloginProSubmit', true);
          }
          _this.setData({
            showProtocol: false,
            disabled: true
          });
          if (wx.getStorageSync('Neoanthropic')) {
            wx.showTabBar({});
          }
          //   _this.triggerEvent('dialogevent', { params: false });
          // console.log('条款保存成功');
        }
      });
    }
  }
})
