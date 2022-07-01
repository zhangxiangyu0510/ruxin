var util=require('../../utils/util');
var api=require('../../config/api')
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },
      // if (wx.getUserProfile) {
      //   this.setData({
      //     canIUseGetUserProfile: true
      //   })
      // }
  methods: {
  //获取头像
  getUserProfile() {
    // let that = this;
    let code = '';
    let isNewUser='';
    wx.login({
      success: (res) => {
        code = res.code;
        console.log('获取code===',code);
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
        util.request(api.getToken+'?code='+code).then(function (res:any) {
          console.log('接口后的=====',res);
          if(res&&res.data){
            isNewUser=res.data.newUser;
            wx.setStorageSync('token', res.data.wechatToken);
            wx.setStorageSync('openId', res.data.openId);
            wx.setStorageSync('unionId', res.data.unionId||'');
            wx.navigateTo({
              url: '/packageOne/pages/app-auth/index?isNewUser='+isNewUser
            })
          }
      });
        console.log('登录信息====',loginParams);
        wx.setStorageSync('permisssion',loginParams);

      },
      // 失败回调
      fail: () => {
        util.showErrorToast('拒绝获取信息');
      }
    });
  },
  }
})
