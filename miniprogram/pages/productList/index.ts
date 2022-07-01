// pages/customerPage/index.ts
var api = require('../../config/api')
var util = require('../../utils/util');
const goodListApp=getApp<IAppOption>();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    webViewSrc: '',
    newUrl:'',
    agreementsObj:{},
    pageType:'',
    keyword:'',
    options:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options:any) {
    console.log('options11111=====',options);
        if(options.params){
            console.log('params====',JSON.parse(decodeURIComponent(options.params)));
            let currentParams=JSON.parse(decodeURIComponent(options.params));
            let assignObj=Object.assign(util.getCommonArguments(),currentParams)
            options.url =`${goodListApp.globalData.h5Address}goodList?params=${encodeURIComponent(JSON.stringify(assignObj))}`;
            this.setData({
                options:encodeURIComponent(JSON.stringify(assignObj))
            })
        }
      this.setData({
        webViewSrc:options.url,
    });
  },
  bindLoadHandler: function (e:any) {
    console.log('e========',e);
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
    util.getUrl(); 
    util.checkLogin().then(() => {
        let assignObj:any= '';
        let currentUrl:any ='';
        let splitUrl:any='';
        let showParams = JSON.parse(decodeURIComponent(this.data.options));
        console.log('1234567999999',showParams);
        if(this.data.pageType ==="machineCode"||this.data.pageType ==="evaluate"){
            util.request(api.getUserInfo).then((res: any) =>{
                res.data.userProfile.avatar = null
                let userInfo = Object.assign(res.data.nuskinUserInfo,res.data.userProfile)
                wx.setStorageSync("userInfo",userInfo)
                let currentTime = wx.getStorageSync("currentTime")
                assignObj = Object.assign(showParams,{currentTime,keyword:this.data.keyword,userInfo:userInfo})
                assignObj.userInfo = userInfo
                console.log('machineCode========', assignObj);
                assignObj = Object.assign(showParams,util.getCommonArguments());
                currentUrl = `${goodListApp.globalData.h5Address}goodList?params=${encodeURIComponent(JSON.stringify(assignObj))}`;
                this.setData({
                    webViewSrc: currentUrl
                });
            })
            return
           
        }
        if (showParams['nuskinToken'] ===null&&showParams['to']=='goodList') {
          console.log('showParams=====', showParams);
          assignObj = Object.assign(showParams,util.getCommonArguments());
          currentUrl = `${goodListApp.globalData.h5Address}goodList&params=${encodeURIComponent(JSON.stringify(assignObj))}`;
        //   this.setData({
        //     webViewSrc: ''
        //   });
        //   setTimeout(() => {
        //     this.setData({
        //         webViewSrc: currentUrl
        //     })
        //   }, 100);
        // wx.redirectTo({
        //     url:'/pages/productList/index?url='+currentUrl
        // })
        this.setData({
            webViewSrc: ''
          });
          setTimeout(() => {
            wx.redirectTo({
                url:'/pages/productList/index?url='+currentUrl
            })
          }, 100);
        }
      })


  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    let pages= getCurrentPages();
    console.log('pages====',pages);
    let prevPage = pages[ pages.length - 2];
    if(prevPage.route == 'pages/customerPage/index') {
    //  prevPage.setData({webViewSrc:''});
    //  wx.redirectTo({
    //      url:'/pages/customerPage/index'
    //  })
    
   }

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

})