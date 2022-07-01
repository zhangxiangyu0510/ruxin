// components/commendHeader.ts
var changeHeaderSvg: any = require('../../utils/changeThemeColor');
let headerApp = getApp<IAppOption>();
var util = require('../../utils/util');
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    titleText: {
      type: String,
      value: 'My Shop'
    },
    showBg: {
      type: Boolean,
      value: false
    },
  },
  /**
   * 组件的初始数据
   */
  data: {
    logo: headerApp.globalData.imageUrl+'/icons/logo_header.svg'
  },
  pageLifetimes: {
    show: function () {
      this.changeColor('logo', headerApp.globalData.imageUrl+'/icons/logo_header.svg', headerApp.globalData.themeColor);
    }
  },
  

  created() {
    // debugger

  },
  /**
   * 组件的方法列表
   */
  methods: {
    changeColor(name: string, url: string, color = '#EBEBEB', type = 'fill') {
      util.svgColor(url, color, type).then((res: any) => {
        this.setData({ [name]: res })
      })
  
  
    },


  }
})
