const dialogApp2 = getApp<IAppOption>();
var util = require('../../utils/util');
var api = require('../../config/api');
import imClient from "../../utils/imClient";
var getChangeTheme = require("../../utils/changeThemeColor");
import { messageObj } from '../..//utils/globalMessage'
Component({
    /**
     * 组件的属性列表
     */
    properties: {

    },
    // 模拟弹出写后续逻辑
    lifetimes: {
        attached() {

        },
    },

    /**
     * 组件的初始数据
     */
    data: {
        isShow:false,
        groupOffShelfBody: {},
        groupOffShelfimage: '',
        themeColor: dialogApp2.globalData.themeColor,
        imageUrl: dialogApp2.globalData.imageUrl,
        showShare: false,
        painting: '' as any,
        wxQrcode: '',
        messageList: [] as Array<any>,
        sdkReady: null as any,
        messageReceived: null as any,
        ids: [] as Array<number>,
        offOnImage: '',
    },
    attached() { },
    pageLifetimes: {
        show: function () {
            let _protocolInfo = wx.getStorageSync('protocolInfo')
            let _newProtocolInfo  =   wx.getStorageSync('newProtocolInfo')
            if(_protocolInfo && (_protocolInfo.version==_newProtocolInfo.version)){
                this.setData({
                    isShow: true
                })
            }
            if (wx.getStorageSync('cookie')) {
                this.setData({ 'messageList': [] })
                let getMessage = messageObj.getAllNews();
                console.log('message=======', getMessage)
                console.log(getMessage);
                if (getMessage.length > 0) {
                    for (let i = 0; i < getMessage.length; i++) {

                        this.push(getMessage[i]);
                    }
                    if(this.data.isShow){
                        wx.hideTabBar({})
                    }
                }
            }
            this.setData({
                themeColor: dialogApp2.globalData.themeColor,
                imageUrl: dialogApp2.globalData.imageUrl,
            })
        }

    },
    detached() { },

    /**
     * 组件的方法列表
     */
    methods: {
        push(data: any) {
            console.log('进来了', data);
            var array: any = null;
            var messageIds: Array<number> = [];
            var arr1: any = []
            var ids: any = []
            if (!data.messageType) {
                return
            }
            console.log(this.data.messageList.length, '@@@@@3')
            if (this.data.messageList.length > 0) {
                arr1 = this.data.messageList;
                messageIds = this.data.ids


            }
            // messageIds.push(data.messageId);
            if (arr1.length > 0) {
                console.log(3333, arr1.length)
                arr1.forEach((item: any, index: number) => {
                    if (item.messageType == data.messageType) {

                        messageObj.removeNews(messageIds[index]);
                        console.log(messageIds, arr1)

                        arr1.splice(index, 1)
                        messageIds.splice(index, 1);
                        console.log(index)

                    }
                })

            }
            if (!array) {
                array = arr1;

            }
            console.log(array, messageIds, '###')
            console.log(array)
            messageIds.push(data.messageId);
            array.push(data);

            console.log(array);

            if (data.messageType && (data.messageType != "shopLevelUp" && data.messageType != 'getBadge')) {
                wx.setStorageSync('messageList', array);
                wx.setStorageSync('messageIds', messageIds);
            }
            console.log('handlePush', data, dialogApp2.globalData.imageUrl, array)

            if (messageIds[0] && array[0].messageType) {
                // this.data.messageList.push(array[0])
                this.setData({
                    messageList: array,
                    ids: messageIds
                })
                if(this.data.isShow){
                    wx.hideTabBar({})
                }
            }
            console.log('打印message====', this.data.messageList)
        },
        //关闭解绑换绑
        tapDialogButton(e: any) {
            this.data.messageList.splice(e.currentTarget.dataset.index, 1)
            messageObj.removeNews(this.data.ids[e.currentTarget.dataset.index]);
            this.data.ids.splice(e.currentTarget.dataset.index, 1)
            this.setData({
                messageList: this.data.messageList,
                ids: this.data.ids
            })
              imClient.disconnect();
              wx.getStorageSync("token") && wx.removeStorageSync("token");
              wx.getStorageSync("openId") && wx.removeStorageSync("openId");
              wx.getStorageSync("userInfo") && wx.removeStorageSync("userInfo");
              wx.getStorageSync("cookie") && wx.removeStorageSync("cookie");
              wx.getStorageSync("permisssion") && wx.removeStorageSync("permisssion");
              wx.getStorageSync("userSign") && wx.removeStorageSync("userSign");
              wx.getStorageSync("currentUserInfo") && wx.removeStorageSync("currentUserInfo"); 
              if (this.data.messageList.length === 0) {
                wx.showTabBar({})
            }  
          },
    }
})
