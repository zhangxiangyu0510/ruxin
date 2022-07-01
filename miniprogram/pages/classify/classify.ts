// pages/ucenter/productClassification/productClassification.ts
const classifyApp = getApp<IAppOption>();
const changeSvg = require('../../utils/changeThemeColor');
var api = require('../../config/api')
var util = require('../../utils/util');
Page({
  /**
 * 页面的初始数据
 */
  data: {
    tabsIndex: 0,
    themeColor: classifyApp.globalData.themeColor,
    // addIcon: changeSvg.svgColor('/images/icons/shoppingTrolley.svg', classifyApp.globalData.themeColor),
    tabs: [],
    imageUrl:classifyApp.globalData.imageUrl,
    catalogId: 0,
    catalog_id: 0,
    activeId: '0',
    leftIndex: 0,
    leftClassification: [],
    rightProductList: [],
    maxHeight: 0,
    page_number: 1,
    pages: 0,
    sortType: 0

  },
  //头部tab切换
  onTabCLick(e: any) {
    // console.log('e==========',e);
    this.setData({
      page_number: 1,
      sortType: e.detail.index
    })
    if (e.detail.index != this.data.tabsIndex) {
      this.setData({
        tabsIndex: e.detail.index,
        catalogId: e.detail.id,
        leftIndex: 0
      });
      this.getClassifyChild(this.data.catalogId);
    }
  },
  //左边滚动
  changeLeftClassification(e: any) {
    // console.log('left,e==========',e);
    this.setData({
      page_number: 1
    })
    if (this.data.leftIndex != e.currentTarget.dataset.index) {
      this.setData({
        leftIndex: e.currentTarget.dataset.index,
        catalog_id: e.currentTarget.dataset.id,
      });
      this.getProductList(this.data.catalog_id);
    }
  },
  //右边内容
  goH5Detail(e: any) {
    // console.log('right,e======',e);
    let addAgruments:any = {
      catalogId: e.currentTarget.dataset.item.catalogId,
      itemId: e.currentTarget.dataset.item.itemId,
      itemType: e.currentTarget.dataset.item.itemType
    };
    console.log('合并之前的=====',util.getCommonArguments());
    let params = Object.assign(util.getCommonArguments(), addAgruments, );
    console.log('567899',params);
    wx.navigateTo({
      url: `/pages/pageDetail/index?url=${classifyApp.globalData.h5Address}productDetail&params=${encodeURIComponent(JSON.stringify(params))}`
    })
  },
  //h5搜索页
  focusH5() {
    wx.hideKeyboard();
    wx.navigateTo({
      url: `/pages/customerPage/index?url=${classifyApp.globalData.h5Address}searchPage&flag=searchPage&currentTime=${Date.parse(new Date().toString())}&params=${encodeURIComponent(JSON.stringify(util.getCommonArguments()))}`
    })
  },
  //查看全部
  goAll() {
    // var catalogId=||'1216691943003929686';
    let params = {
      catalogId: this.data.catalogId,
      // sortType:this.data.sortType,
    }
    let assignParams=Object.assign(util.getCommonArguments(),params);
    wx.navigateTo({
      url: `/pages/customerPage/index?url=${classifyApp.globalData.h5Address}goodList&params=${encodeURIComponent(JSON.stringify(assignParams))}`
    })
  },
  //一级类目
  getClassify() {
    let _that = this;
    util.request(api.getClassify,).then(function (res: any) {
      if (res && res.data) {
        // console.log('一级类目====',res.data);
        _that.setData({
          tabs: res.data,
          catalogId: res.data[0].id,
        });
        _that.getClassifyChild(_that.data.catalogId);
      }
    });
  },
  //一级类目对应左边的二级类目
  getClassifyChild(catalogId: Number) {
    let self = this;
    util.request(api.getClassifyChild, { catalog_id: catalogId }).then(function (res: any) {
      if (res && res.data) {
        // console.log('一级类目下的子类目====',res.data);
        self.setData({
          leftClassification: res.data,
          catalog_id: res.data[0].id,

        });
        self.getProductList(self.data.catalog_id);

      }
    });
  },
  //二级类目默认第一个类目下的产品
  getProductList(catalog_id: Number) {
    let _self = this;
    _self.setData({
      rightProductList: [],
    })
    util.showOtherToast('加载中', "loading");
    util.request(api.getProductList, { catalog_id, page_number: _self.data.page_number, page_size: 10 }).then(function (res: any) {
      if (res && res.data.itemVos && res.data.itemVos.list) {
        // console.log('根据类目查询到产品列表====',res.data);
        _self.setData({
          rightProductList: res.data.itemVos.list,
          pages: res.data.itemVos.pages
        });
      } else {
        _self.setData({
          rightProductList: [],
        });
      }
    });
  },
  getOtherProductList(catalog_id: Number) {
    let _self = this;
    util.showOtherToast('加载中', "loading");
    util.request(api.getProductList, { catalog_id, page_number: _self.data.page_number, page_size: 10 }).then(function (res: any) {
      if (res && res.data.itemVos && res.data.itemVos.list) {
        let getArr: any = _self.data.rightProductList.concat(res.data.itemVos.list);
        _self.setData({
          rightProductList: getArr,
        });
      }
    });
  },
  loadBottom() {
    let currentPage_num = this.data.page_number;
    this.setData({
      page_number: currentPage_num + 1
    });
    if (this.data.page_number <= this.data.pages) {
      this.getOtherProductList(this.data.catalog_id);

    }
    console.log('滑倒底部了=====');

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.getClassify();
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
    // util.getThemeColor().then((themeColor:string)=>{
        this.setData({
            themeColor:classifyApp.globalData.themeColor
        })
    // })
    if (this.selectComponent("#dialogProtocol")) {
        this.selectComponent("#dialogProtocol").close();
      }
    console.log('2345678====', this.selectComponent("#dialogProtocol"))
    var that = this;
    var query = wx.createSelectorQuery();
    //选择id
    query.select('.header_box').boundingClientRect(function (rect) {
      console.log('rect.height', rect);
      // domHeight=rect.height;
      // 获取系统信息
      wx.getSystemInfo({
        success: function (res) {
          console.log('屏幕参数', res);
          // 获取可使用窗口宽度
          let windowHeight = res.windowHeight;
          // 设置高度
          let currentHeight = (windowHeight - rect.height);
          console.log('当前高度====', currentHeight);
          that.setData({
            maxHeight: currentHeight
          });
        }
      });
    }).exec();


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