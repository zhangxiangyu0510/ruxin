// components/uploader/uploader.ts
var api = require('../../config/api')
var util = require('../../utils/util');
let componentApp = getApp<IAppOption>();
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        
    },

    /**
     * 组件的初始数据
     */
    data: {
        imgs: [],
        uploadUrl:[],
        imageUrl:componentApp.globalData.imageUrl
    }as{
        imgs:string[],
        uploadUrl:string[],
        
    },
    /**
     * 组件的方法列表
     */
    methods: {
        getUploadUrl(){
            return new Promise(function (resolve){
              util.request(api.UploadAvatar).then((res:any)=>{
                resolve(res)
              })
            })
        },
        // 上传图片
        chooseImg() :void{
            let that = this;
            let imgs:string[] = this.data.imgs;
            if (imgs.length >= 9) {
            this.setData({
                lenMore: 1
            });
            setTimeout(function ():void{
                that.setData({
                lenMore: 0
                });
            }, 2500);
            return;
            }
            wx.chooseImage({
                // count: 1, // 默认9
                sizeType: ['original', 'compressed'],
                sourceType: ['album', 'camera'], 
                success: function (res:any):void {
                    let currentUrl =res.tempFilePaths
                    currentUrl.forEach((element:string) => {
                        that.getUploadUrl().then((ress:any)=>{
                            console.log(ress,"99999999");
                            let url = ress.data.downloadUrl
                            that.setData({
                                uploadUrl:[...that.data.uploadUrl,url]
                            })
                            wx.getFileSystemManager().readFile({
                                filePath:element,
                                success(data){
                                util.request(ress.data.uploadUrl,data.data,"PUT",{'Content-Type': 'image/'+element.split('.')[1]}).then(()=>{
                                    console.log("成功了");
                                    that.triggerEvent("uploadUrl",that.data.uploadUrl)
                                })
                                }
                            })
                        })
                    });
                    // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                    let tempFilePaths:string[] = res.tempFilePaths;
                    let imgs:string[] = that.data.imgs;
                    // console.log(tempFilePaths + '----');
                    for (var i = 0; i < tempFilePaths.length; i++) {
                        if (imgs.length >= 9) {
                            that.setData({
                                imgs: imgs
                            });
                            return;
                        } else {
                            imgs.push(tempFilePaths[i]);
                        }
                    }
                    // console.log(imgs);
                    that.setData({
                        imgs: imgs
                    });
                }
            });
        },
        // 删除图片
        deleteImg: function (e:any):void{
            let imgs:string[] = this.data.imgs;
            let uploadUrl:string[] = this.data.uploadUrl;
            let index:number = e.currentTarget.dataset.index;
            imgs.splice(index, 1);
            uploadUrl.splice(index, 1);
            this.setData({
                imgs: imgs,
                uploadUrl:uploadUrl
            });
        },
        // 预览图片
        previewImg: function (e:any):void {
            //获取当前图片的下标
            let index:number = e.currentTarget.dataset.index;
            //所有图片
            let imgs:string[] = this.data.imgs;
            wx.previewImage({
                //当前显示图片
                current: imgs[index],
                //所有图片
                urls: imgs
            })
        },
    }
})
