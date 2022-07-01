// pages/feedbackComplaints/feedbackComplaints.ts
const newApp = getApp<IAppOption>()
import {svgColor} from "../../../utils/changeThemeColor";
var api = require('../../../config/api');
var util = require('../../../utils/util');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        imageUrl:newApp.globalData.imageUrl,

        themeColor:newApp.globalData.themeColor,
        formData:{
            radio:1
        },

        isShowInput:true,
        showActionsheet: false,
        groups: [
            { text: '产品', value: '产品' },
            { text: '物流', value: '物流' },
            { text: '店主服务', value: '店主服务' },
            { text: '其他', value: '其他' },
        ],
        radioItems: [
            {name: '是', value: '1',checked: true},
            {name: '否', value: '0'},
        ],
        checkboxItems: [
            {name: '否', value: '0', checked: true},
            {name: '是', value: '1'}
        ],
        index:1,
        isShowTips:true,
        feedbackComplaintsTextareaValue:"",
        checkedValue:"",
        mobile:"",
        radioUrl:newApp.globalData.imageUrl+'/icons/radioNormal.svg',
        radioOnUrl:newApp.globalData.imageUrl+"/icons/radioOn.svg",
        uploadImg:[],
        timer:null,
        tmpTime:true
},

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad():void{
        // let radioUrl:string = svgColor(this.data.radioUrl,"#ffffff")
        // let radioOnUrl:string = svgColor(this.data.radioOnUrl,this.data.themeColor)
        // this.setData({
        //     radioUrl,
        //     radioOnUrl
        // })
        this.changeColor('radioUrl',this.data.radioUrl,"#ffffff")
        this.changeColor('radioOnUrl',this.data.radioOnUrl,this.data.themeColor)

    },
    changeColor(name: string, url: string, color = '#EBEBEB', type = 'fill') {
        util.svgColor(url, color, type).then((res: any) => {
          this.setData({ [name]: res })
        })
    
    
      },
    uploadUrl(v:any){
        console.log(v.detail,"666666666666666666666");
        this.setData({
            uploadImg:v.detail
        })
        
    },
    isShowSheet: function ():void{
        this.setData({
            showActionsheet: true
        })
    },
    btnClick(e:any):void{
        console.log(e.detail.value)
        this.setData({
            checkedValue:e.detail.value,
            showActionsheet: false
        })
    },
    radioChange: function (e:any):void{
        console.log('radio发生change事件，携带value值为：', e.detail.value);
        let radioItems = this.data.radioItems;
        for (var i = 0, len = radioItems.length; i < len; ++i) {
            radioItems[i].checked = radioItems[i].value == e.detail.value;
        }
        this.setData({
            radioItems: radioItems,
            [`formData.radio`]: e.detail.value,
            isShowInput:!!(e.detail.value*1)
        });
        if(!(e.detail.value*1)){
            this.setData({
                mobile:''
            })
        }
    },
    handleCloseTips():void{
        this.setData({
            isShowTips:false
        })
    },
    handleToList():void{
        wx.navigateTo({
            url:"/packageOne/pages/feedbackComplaintsList/feedbackComplaintsList"
        })
    },
    ButtonSubmit(){
        let that = this
        console.log("提交",this.data);
        let checkedValueType:any = {
            '产品':1,
            '物流':2,
            '店主服务':3,
            '其他':4,
        }
        let initData = this.data
        let userInfo = wx.getStorageSync("userInfo")
        let shopInfo = wx.getStorageSync("shopInfo")
        let data = {
            "createFrom": 1,
            "createId": userInfo.id,
            "description": initData.feedbackComplaintsTextareaValue,
            "images": initData.uploadImg,
            "mobile": initData.mobile,
            "needCallback": !!(initData.formData.radio*1),
            "partnerId": shopInfo.partner.id,
            "shopId": shopInfo.shop.id,
            "type": checkedValueType[initData.checkedValue],
            "updateFrom": 1,
            "userId": userInfo.id
        }
        if(!data.type)return util.showErrorToast('投诉类型不能为空')
        if(!data.description)return util.showErrorToast('投诉内容不能为空')
        let reg =/^1[3-9]\d{9}$/
        if(initData.isShowInput&&!data.mobile)return util.showErrorToast('手机号不能为空')
        if(initData.isShowInput&&data.mobile&&!reg.test(data.mobile))return util.showErrorToast('请输入正确的手机号')
        if(!this.data.tmpTime){
            util.showErrorToast("您提交的数据正在上传中,请耐心等待");
            return
        }
        this.setData({
            tmpTime:false
        })
        util.request(api.postComplaints,data,"POST").then((res:any)=>{
            console.log(res);
            wx.showToast({
                title: '已提交成功',
                icon: 'success',
                duration: 1000,
                mask:true,
                success() {
                  setTimeout(() => {
                    that.setData({
                        tmpTime:true
                    })
                    util.backAddress();
                  }, 1000)
                }
              });
        }).catch(()=>{
            util.showErrorToast("提交失败了");
            that.setData({
                tmpTime:true
            })
        })
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
        this.setData({
            themeColor:newApp.globalData.themeColor
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