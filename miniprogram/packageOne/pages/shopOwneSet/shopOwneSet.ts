
const shopSetApp = getApp<IAppOption>()
import {svgColor} from "../../../utils/changeThemeColor";
var api = require('../../../config/api');
var util = require('../../../utils/util');
Page({
  data: {
    dialogShow:false,
    badgeData: [],
    imageUrl:shopSetApp.globalData.imageUrl,
    themeColor:shopSetApp.globalData.themeColor||wx.getStorageSync("themeColor"),
    scoreIcon:"/packageOne/images/userCenterIcon/Group 923.svg",
    userInfo:{},
    genderData: {
      0: '保密',
      1: "男",
      2: "女"
    },
    follow:true,
    my_header_avater: shopSetApp.globalData.imageUrl+"/icons/defaultMyIcon.svg",
    shopInfo:'',
    age:false,
    score:false,
    information:false,
    tipsIcon:`<svg style="fill:#FFF" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 0H0V24H24V0Z" fill-opacity="0.01"/>
    <path d="M12 22C14.7614 22 17.2614 20.8807 19.0711 19.0711C20.8807 17.2614 22 14.7614 22 12C22 9.2386 20.8807 6.7386 19.0711 4.92893C17.2614 3.11929 14.7614 2 12 2C9.2386 2 6.7386 3.11929 4.92893 4.92893C3.11929 6.7386 2 9.2386 2 12C2 14.7614 3.11929 17.2614 4.92893 19.0711C6.7386 20.8807 9.2386 22 12 22Z" stroke="white" fill-opacity="0.01" stroke-width="1.33333" stroke-linejoin="round"/>
    <rect x="11" y="10" width="2" height="8" rx="1"/>
    <rect x="10.5" y="6" width="3" height="3" rx="1.5" />
    </svg>
    `,
    tipsIcon2:`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 0H0V24H24V0Z" fill="white" fill-opacity="0.01"/>
    <path d="M12 22C14.7614 22 17.2614 20.8807 19.0711 19.0711C20.8807 17.2614 22 14.7614 22 12C22 9.2386 20.8807 6.7386 19.0711 4.92893C17.2614 3.11929 14.7614 2 12 2C9.2386 2 6.7386 3.11929 4.92893 4.92893C3.11929 6.7386 2 9.2386 2 12C2 14.7614 3.11929 17.2614 4.92893 19.0711C6.7386 20.8807 9.2386 22 12 22Z" stroke="#7F7F7F" stroke-width="1.33333" stroke-linejoin="round"/>
    <rect x="11" y="10" width="2" height="8" rx="1" fill="#7F7F7F"/>
    <rect x="10.5" y="6" width="3" height="3" rx="1.5" fill="#7F7F7F"/>
    </svg>
    `,
    bradge:false,
    scores:false,
    tipsCloseIcon:`<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11 22C4.928 22 0 17.072 0 11C0 4.928 4.928 0 11 0C17.072 0 22 4.928 22 11C22 17.072 17.072 22 11 22ZM11 1.045C5.522 1.045 1.045 5.522 1.045 11C1.045 16.478 5.511 20.955 11 20.955C16.489 20.955 20.955 16.489 20.955 11C20.955 5.511 16.478 1.045 11 1.045Z" fill="white"/>
    <path d="M11.7705 11L15.8475 6.94896C16.0508 6.74694 16.0508 6.41733 15.8475 6.18341L15.8154 6.15152C15.6121 5.94949 15.2804 5.94949 15.077 6.15152L11 10.2344L6.92295 6.18341C6.71964 5.98139 6.38791 5.98139 6.18459 6.18341L6.15249 6.21531C5.94917 6.41733 5.94917 6.74694 6.15249 6.98086L10.2295 11L6.15249 15.051C5.94917 15.2531 5.94917 15.5827 6.15249 15.8166L6.18459 15.8485C6.38791 16.0505 6.71964 16.0505 6.92295 15.8485L11 11.7656L15.077 15.8166C15.2804 16.0186 15.6121 16.0186 15.8154 15.8166L15.8475 15.7847C16.0508 15.5827 16.0508 15.2531 15.8475 15.0191L11.7705 11Z" fill="white"/>
    </svg>
    `,
    levelImg:wx.getStorageSync("levelImg")
  },
  goBadge(){
    wx.navigateTo({
      url:"/packageOne/pages/myBadge/myBadge"
    })
  },
  goBadgeDetail(e:any){
      console.log(e);
      
    let item = e.currentTarget.dataset.item
    wx.setStorageSync("badgeDetail",item)
    wx.navigateTo({
      url:"/packageOne/pages/badgeDetail/badgeDetail"
    })
  },
  changeColor(name: string, url: string, color = '#EBEBEB', type = 'fill') {
    util.svgColor(url, color, type).then((res: any) => {
      this.setData({ [name]: res })
    })
  },
  onLoad(){
    this.changeColor('my_header_avater',this.data.my_header_avater,wx.getStorageSync('themeColor'), "stroke")
    let scoreIcon:string = svgColor(this.data.scoreIcon,wx.getStorageSync("themeColor"))
      this.setData({
        scoreIcon:scoreIcon,
        tipsIcon:encodeURIComponent(this.data.tipsIcon),
        tipsIcon2:encodeURIComponent(this.data.tipsIcon2),
        tipsCloseIcon:encodeURIComponent(this.data.tipsCloseIcon),
        levelImg:wx.getStorageSync("levelImg")
      })
      this.isFollow();
      this.getBadge()

  },
  getUserInfo(info:any){
    this.setData({
      shopInfo:info.detail.userShopInfo
    })
  },
  getBadge(){
    util.request(api.getBadge,{shop_id:wx.getStorageSync('shopId')}).then((res:any)=>{
        console.log(res);
        res.data.sort((a, b) => { return b.lightingTime - a.lightingTime })
        this.setData({
            badgeData:res.data.length&&res.data.filter((item:any)=>{
                if(item.lighting){
                    return item
                }
            }).slice(0,4)
        })
    })
  },
  isFollow(){
    util.request(api.isFollow,{id:wx.getStorageSync('shopId')},'get').then((res: any) => {
      console.log('KKKKK',res);
      if (res.data) {
        this.setData({
          follow: true,
        })
      }
    }).catch((err: any) => {
      console.log(err);
    })

  },
  cancleFellow(){
  let _this = this;
  console.log(this.data.shopInfo)
    wx.showModal({
      title: '提示',
      content: '即将取消关注\r\n"'+this.data.userInfo.nickname+'"',
      success (res) {
        if (res.confirm) {
          console.log('9999')
          util.request(api.cancelFollow+'?shop_id='+(wx.getStorageSync('shopId')), {},'delete').then((res: any) => {
            console.log(res);
            if (res) {
              _this.setData({follow:false, userInfo:{}});
              getApp().sensors.track('CancelTheAttention',{
              });
              wx.navigateBack()
            }
          }).catch((err: any) => {
            console.log(err);
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    
   

  },
  toFollow(){
    util.request(api.follow,{shopId:wx.getStorageSync('shopId')},'post').then((res: any) => {
      console.log(res);
      if (res) {
        this.setData({
          follow: true,
        });
        getApp().sensors.track('AttentionShop',{
        });
      }
    }).catch((err: any) => {
      console.log(err);
    })
  
  },
  //名字脱敏处理
  noPassByName(str:string):any{
    if(null != str && str != undefined){
        if(str.length==2){
            return str.substring(0,1)+'*' //截取name 字符串截取第一个字符，
        }else if(str.length==3){
            return str.substring(0,1)+"*"+str.substring(2,3)//截取第一个和第三个字符
        }else if(str.length>3){
            return str.substring(0,1)+"*"+'*'+str.substring(3,str.length)//截取第一个和大于第4个字符
        }
    } else {
        return "";
    }
  },
  //获取店铺设置状态
  getShopConfig(shopId:string){
    util.request(api.getShopConfig, { shop_id: shopId }, 'get').then((res:any)=>{
        this.setData({
            age:res.data.age,
            score:res.data.score,
            information:res.data.information,
        })
    })
},
openConfirm(e:any){
    // if(e.currentTarget.dataset.type==='bradge'){
    //     this.setData({
    //         dialogShow:true,
    //         bradge:true,
    //         scores:false
    //     })
    // }else if(e.currentTarget.dataset.type==='scores'){
    //     this.setData({
    //         dialogShow:true,
    //         bradge:false,
    //         scores:true
    //     })
    // }
    this.setData({
        bradge:false,
        scores:false
    })
    this.setData({
        [e.currentTarget.dataset.type]:true,
        dialogShow:true
    })
},
closeConfirm(){
  this.setData({
    dialogShow:false,
    bradge:false,
    scores:false
  })
},
  onShow: function () {
    // wx.setStorageSync('userInfo', Object.assign(res.data.user, res.data.userProfile));
    let shopInfo = wx.getStorageSync("shopInfo")
    shopInfo.shopAge = shopInfo.shop && shopInfo.shop.startTime ? util.timeTmp(shopInfo.shop.startTime) : '0'
    shopInfo.age = util.getCurrentAge(new Date(shopInfo.partnerProfile.birthday))
    shopInfo.name = this.noPassByName(shopInfo.partnerProfile.realName)
    this.getShopConfig(shopInfo.shop.id)
    this.setData({
      userInfo:Object.assign(shopInfo,shopInfo.partner, shopInfo.partnerProfile),
      themeColor:shopSetApp.globalData.themeColor
    })
  }
})

