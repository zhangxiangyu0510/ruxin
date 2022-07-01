// pages/customer/feedbackComplaintsDetail/feedbackComplaintsDetail.ts
var api = require('../../../config/api');
var util = require('../../../utils/util');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        DetailData:{
            images:[]
        },
        DetailId:'',
        checkedValueType : {
            '1':'产品',
            '2':'物流',
            '3':'店主服务',
            '4':'其他',
        }
    },
    handleBindImg(e:any):void{
        console.log(e.currentTarget.dataset.url);
        let url:string = e.currentTarget.dataset.url
        wx.previewImage({
            current: url, // 当前显示图片的http链接
            urls: this.data.DetailData.images // 需要预览的图片http链接列表
          })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options):void {
        let DetailId:string|undefined = options.DetailId
        console.log(DetailId,"000000000");
        this.setData({
            DetailId
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
        let data = {
            id:this.data.DetailId
        }
        util.request(api.getComplaintsDetail,data).then((res:any)=>{
            console.log(res);
            this.setData({
                DetailData:res.data
            })
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