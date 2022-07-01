// components/commendHeader.ts
const noDataApp = getApp<IAppOption>();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    titleText: {
      type: String,
      value: '暂无数据'
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    imageUrl:noDataApp.globalData.imageUrl

  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
