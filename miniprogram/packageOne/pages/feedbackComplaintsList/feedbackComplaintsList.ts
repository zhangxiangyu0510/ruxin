// pages/customer/feedbackComplaintsList/feedbackComplaintsList.ts
var api = require('../../../config/api');
var util = require('../../../utils/util');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        historyData:[],
        themeColor:wx.getStorageSync('themeColor'),
        page:1,
        isShowNotDataTitle:false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    handleToDetail(e:any){
        console.log(e.currentTarget.dataset.item);
        let id:String = e.currentTarget.dataset.item.id
        if(!id)return
        wx.navigateTo({
            url:`/packageOne/pages/feedbackComplaintsDetail/feedbackComplaintsDetail?DetailId=${id}`,
        })
    },
    getComplaintsListData(page:number){
        let data = {
            page,
            pageSize:20
        }
        util.request(api.getComplaintsList,data).then((res:any)=>{
            let getData:any = [...this.data.historyData,...res.data.complainInfos]
            if(!res.data.complainInfos.length||res.data.complainInfos.length<20){
                this.setData({
                    isShowNotDataTitle:true,
                })
            }
            
            getData = getData.length&&getData.map((item:any)=>{
                if(item.images.length>3){
                    item.images = item.images.slice(0,3)
                }
                return item
            })||[]
            this.setData({
                historyData:getData
            })
            
        })
    },
    onLoad() {
        util.showOtherToast('加载中', "loading", 500);
        this.getComplaintsListData(this.data.page)
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
        ++this.data.page
        this.getComplaintsListData(this.data.page)
    },

})