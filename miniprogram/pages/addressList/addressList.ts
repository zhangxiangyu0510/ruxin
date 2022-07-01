// pages/customer1/customer1.ts
Page({

    /**
     * 页面的初始数据
     */
    data: {
        webViewSrc: '',
        newUrl:'',
        agreementsObj:{},
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options:any) {
        let agreementsObj= options;
        if(options.url){
            options.url = decodeURIComponent(options.url)
        }
        let args:any = {
            auth:'',
            unionid:'',
            mobile:'',
            openId:''
        };
        Object.keys(args).forEach((k:string) => {
            args[k] = agreementsObj[k]
        });
        let l = '?';
        if (options.url && options.url.indexOf('?') !== -1) {
            l = '&';
        }
        options.url +=`${l}params=${encodeURIComponent(JSON.stringify(args))}`;
        this.setData({
            webViewSrc:options.url,
        });
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
    bindLoadHandler: function (e:any):void{
        console.log(e);
           // webview重载时，同步更新变更的数据
    }
})