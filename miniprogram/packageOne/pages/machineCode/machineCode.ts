// packageOne/pages/machineCode/machineCode.ts
var util = require('../../../utils/util');
var api = require('../../../config/api');
import { svgColor } from "../../../utils/changeThemeColor";
Page({

    /**
     * 页面的初始数据
     */
    data: {
        scanCode1: '',
        scanCode2: '',
        themeColor: wx.getStorageSync("themeColor"),
        pageType:'',
        keyword:'',
        icon:'packageOne/images/icons/code-icon.svg',
        errorText:''
    },
    bindKeyInput1(e:any){
        this.setData({
            scanCode1:e.detail.value
        })
    },
    bindKeyInput2(e:any){
        this.setData({
            scanCode2:e.detail.value
        })
    },
    bindHideToast() {
        this.setData({
            errorText: ''
        })
    },
    formSubmit(e:any){
        let that = this
        console.log(e.detail.value);
        let { scanCode1, scanCode2 ,pageType,keyword} = this.data
        console.log(scanCode1, scanCode2, "899");
        if (!scanCode1||!scanCode2||scanCode1 !== scanCode2) return
        if (scanCode1.indexOf(" ")===1||scanCode2.indexOf(" ")===1) return util.showErrorToast('输入机器码不能有空格');
        if (scanCode1.length<21||scanCode2.length<21) return util.showErrorToast('请输入有效机器码');
        // https://weshop-dev.cn.nuskin.com/api/business/Wechat_Shop_Dev_default/nuskin-shop-business-center/ageLockMe
        // https://weshop-test.cn.nuskin.com/api/business/Wechat_Shop_Test_default/nuskin-shop-business-center/ageLockMe
        util.request(api.ageLockMeCode,{ageLocMeCode:scanCode1,confirmCode:scanCode2},"POST",true).then((res:any)=>{
            if(res.data.success){
                wx.setStorageSync("currentTime",new Date().getTime())
                wx.showToast({
                    title: '提交成功了',
                    icon: 'success',
                    duration: 2000,
                    success() {
                      setTimeout(() => {
                        var pages  = getCurrentPages();
                        console.log(pages ,"88888");
                        var prevPage = pages[pages.length - 2];
                        prevPage.setData({
                            pageType,
                            keyword
                        })
                        wx.navigateBack({
                            delta: 1 // 返回上一级页面。
                        })
                      }, 2000)
                    }
                });
            }else{
                // util.showErrorToast(res.data.msg)
                that.setData({
                    errorText:res.data.msg
                })
            }  
        }).catch(()=>{
            util.showErrorToast("提交失败")
        })
    },
    handScanCode(e: any) {
        console.log(e.detail.value);
        let typeActive = e.currentTarget.dataset.active
        wx.scanCode({
            success: (res) => {
                if (typeActive === "scanCode1") {
                    this.setData({
                        scanCode1: res.result
                    })
                } else if (typeActive === "scanCode2") {
                    this.setData({
                        scanCode2: res.result
                    })
                }
            },
            fail: (err) => {
                console.log(err);
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options:any) {
        let params = JSON.parse(decodeURIComponent(options.params))
        console.log(params,"进入页面的传入参数");
        
        this.setData({
            pageType:params.type,
            keyword:params.keyword
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
            icon:svgColor(this.data.icon,wx.getStorageSync("themeColor"),"stroke")
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