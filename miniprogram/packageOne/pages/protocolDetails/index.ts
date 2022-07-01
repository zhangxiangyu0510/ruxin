// packageOne/pages/protocolDetails/index.ts
var api = require('../../../config/api')
var util = require('../../../utils/util');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        content: ""
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        console.log(options.code, "options");

        this.getDetailData(options.code + "")
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


    getDetailData(id: string) {
     
        util.request(api.getTermdetails,{termsId:id}).then((res: any) => {
            this.setData({
                content: res.data.content
            })
        })
    }
})