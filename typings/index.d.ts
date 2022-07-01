/// <reference path="./types/index.d.ts" />

interface IAppOption {
  globalData: {
    userInfo?: WechatMiniprogram.UserInfo,
    // [propName: string]:any;//不够严谨
    fontFamily:string,
    themeColor?:any,
    h5Address:string,
    imageUrl?:string
    customerH5:string,
    staticFont:string,
    payAppId:string,
    SDKAppID:number,
    shopKeeperAppId:string
  }
  userInfoReadyCallback?: WechatMiniprogram.GetUserInfoSuccessCallback,
}
// class  themeColor{
//   color:string;
//   constructor(){
   
//   }

// }