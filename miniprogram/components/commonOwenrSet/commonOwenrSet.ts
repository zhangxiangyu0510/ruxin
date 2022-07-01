// pages/ucenter/shopowner/shopowner.ts


// components/commendHeader.ts
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    ifShow: {
      type: Boolean,
      value: true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    badgeData: [{ name: '未来可期' }, { name: '十分热爱' }, { name: '开单大吉' },{ name: '订单不断' }, { name: '大有作为' }]

  },

  /**
   * 组件的方法列表
   */
  methods: {
    goReview() {

      this.triggerEvent("goReview")
    },
    goConfig() {
      this.triggerEvent("goConfig")
    },
    goEdit() {
      this.triggerEvent("goEdit")
    },
  },

})
