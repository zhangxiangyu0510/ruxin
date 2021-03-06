// components/commonNoticeDialog/commonNoticeDialog.ts
let componentApp = getApp<IAppOption>();
var componSvg = require('../../utils/changeThemeColor')
var api = require('../../config/api')
var util = require('../../utils/util');
import { svgColor } from "../../utils/changeThemeColor";


Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },
  lifetimes: {
    attached() {
        this.changeColor('my_header_avater',this.data.my_header_avater, componentApp.globalData.themeColor , "stroke")
      // let themeIcon: string = svgColor(this.data.my_header_avater, componentApp.globalData.themeColor, "stroke")
      // let _userInfo = wx.getStorageSync('userInfo')
      let _userInfo = wx.getStorageSync('userInfo')

      this.setData({
        userInfo: wx.getStorageSync('userInfo'),
        // zuo: componSvg.svgColor('/images/icons/huangguan.svg', _userInfo.type != 1 && _userInfo.level == 3 ? componentApp.globalData.themeColor : '#7f7f7f'),
        // you: componSvg.svgColor('/images/icons/beijing.svg', _userInfo.type != 1 && _userInfo.level == 3 ? componentApp.globalData.themeColor : '#7f7f7f'),
        // Union: componSvg.svgColor('/images/icons/Union.svg', componentApp.globalData.themeColor ),
        themeColor: componentApp.globalData.themeColor,
        // my_header_avater: themeIcon,
      })
      this.changeColor('zuo',componentApp.globalData.imageUrl+'/icons/huangguan.svg',_userInfo.type != 1 && _userInfo.level == 3?componentApp.globalData.themeColor: '#7f7f7f')
      this.changeColor('you',componentApp.globalData.imageUrl+'/icons/beijing.svg',_userInfo.type != 1 && _userInfo.level == 3?componentApp.globalData.themeColor: '#7f7f7f')
      this.changeColor('Union',componentApp.globalData.imageUrl+'/icons/Union.svg', componentApp.globalData.themeColor )
      this.changeColor('my_header_avater',this.data.my_header_avater, componentApp.globalData.themeColor , "stroke")
    },
  },
  pageLifetimes: {
    show() {
      let _userInfo = wx.getStorageSync('userInfo')
      // let themeIcon: string = svgColor(this.data.my_header_avater, componentApp.globalData.themeColor, "stroke")
      this.setData({
        userInfo: wx.getStorageSync('userInfo'),
        themeColor: componentApp.globalData.themeColor,
        // my_header_avater: themeIcon,

      })
      this.changeColor('zuo',componentApp.globalData.imageUrl+'/icons/huangguan.svg',_userInfo.type != 1 && _userInfo.level == 3?componentApp.globalData.themeColor: '#7f7f7f')
      this.changeColor('you',componentApp.globalData.imageUrl+'/icons/beijing.svg',_userInfo.type != 1 && _userInfo.level == 3?componentApp.globalData.themeColor: '#7f7f7f')
      this.changeColor('Union',componentApp.globalData.imageUrl+'/icons/Union.svg', componentApp.globalData.themeColor )
      this.changeColor('my_header_avater',componentApp.globalData.imageUrl+"/icons/defaultMyIcon.svg", componentApp.globalData.themeColor , "stroke")
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    my_header_avater: componentApp.globalData.imageUrl+"/icons/defaultMyIcon.svg",
    userInfo: wx.getStorageSync('userInfo'),
    selfEnData: {},
    // Union: componSvg.svgColor(componentApp.globalData.imageUrl+'/icons/Union.svg', componentApp.globalData.themeColor ),
    // zuo: componSvg.svgColor(componentApp.globalData.imageUrl+'/icons/huangguan.svg', componentApp.globalData.themeColor),
    // you: componSvg.svgColor(componentApp.globalData.imageUrl+'/icons/beijing.svg', componentApp.globalData.themeColor),
    themeColor: componentApp.globalData.themeColor,
    imageUrl:componentApp.globalData.imageUrl,
    painting: {
      width: 248,
      height: 400,
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
        type: 'text',
        content: '恭喜您的如新NU店',
        fontSize: 16,
        lineHeight: 20,
        color: '#383549',
        textAlign: 'left',
        top: 190,
        left: 56,
        MaxLineNumber: 2,
        breakWord: true,
        // bolder: true
      },
      {
        type: 'text',
        content: '等级已提升至',
        fontSize: 16,
        lineHeight: 20,
        color: '#383549',
        textAlign: 'left',
        top: 220,
        left: 60,
        MaxLineNumber: 2,
        breakWord: true,
        // bolder: true
      },
      {
        type: 'text',
        content: 'V.1',
        fontSize: 16,
        lineHeight: 20,
        color: wx.getStorageSync('themeColor'),
        textAlign: 'left',
        top: 220,
        left: 160,
        MaxLineNumber: 2,
        breakWord: true,
        // bolder: true
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
        content: '薛静静呀',
        fontSize: 12,
        lineHeight: 20,
        color: '#383549',
        textAlign: 'left',
        top: 258,
        left: 55,
        width: 70,
        MaxLineNumber: 2,
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
        content: '如新NU店小程序 ',
        fontSize: 14,
        lineHeight: 14,
        color: '#4A4A4A',
        textAlign: 'left',
        top: 310,
        left: 24,
        width: 190,
        MaxLineNumber: 2,
        breakWord: true,
        // bolder: true
      },
      {
        type: 'image',
        url: '',
        top: 320,
        left: 170,
        width: 60,
        height: 60,
      },
      {
        type: 'image',
        url: componentApp.globalData.imageUrl+'/icons/canvas_addBg.svg',
        top: 340,
        left: 24,
        width: 30,
        height: 30,
      },

      {
        type: 'image',
        url: componentApp.globalData.imageUrl+'/icons/level_1.png',
        top: 49,
        left: 53,
        width: 142,
        height: 132,
      },
      ],
    },

  },
  created() {

    this.getSelfEnNumber()
  },



  /**
   * 组件的方法列表
   */
  methods: {
    openSharePosters() {
      this.triggerEvent('closePosters')
    },
    // 获取en家点数
    getSelfEnNumber() {
      let that = this
      util.request(api.getSelfEnNumber, 'get').then(function (res: any) {
        that.setData({
          selfEnData: res.data && res.data[0]
        })
      });
    },
    changeColor(name: string, url: string, color = '#EBEBEB', type = 'fill') {
      util.svgColor(url, color, type).then((res: any) => {
        this.setData({ [name]: res })
      })
  
  
    },

  }
})
