/* global Component wx */
Component({
    properties: {
        visiable: {
            type: Boolean,
            value: false
          },
          shareImage: {
            type: String,
            value: ''
          }
       
    },
    data: {
        showCanvas: false,
        width: 100,
        height: 100,
        tempFileList: [],
        isPainting: false,
        painting: {},
        goodsUrl: '',
        goods: {},
        
    },

    methods: {
        closeDialog(){
            this.setData({
                visiable:false
            });
            wx.navigateBack({
                delta:1
            })
        },
        getQrcode() {
            let that = this;
            // util.request(api.GetBase64, {
            //     goodsId: id
            // }, 'POST').then(function(res) {
            //     if (res.errno === 0) {
            //         that.getQrcodeJpg(res.data);
            //     }
            // });
            that.getQrcodeJpg();
        },
        getQrcodeJpg() {
            let that = this;
            let num = Math.floor(Math.random() * 50);
            // let promise = new Promise((resolve, reject) => {
            //     const filePath = wx.env.USER_DATA_PATH + '/temp_image' + num + '.jpeg';
            //     const buffer = wx.base64ToArrayBuffer(code);
            //     wx.getFileSystemManager().writeFile({
            //         filePath,
            //         data: buffer,
            //         encoding: 'binary',
            //         success() {
            //             that.getGoodsInfo(filePath);
            //         },
            //         fail() {
            //             reject(new Error('ERROR_BASE64SRC_WRITE'));
            //         },
            //     });
            // });
            that.getGoodsInfo();
        },
        getGoodsInfo() {
            let that = this;
            // let id = that.data.goodsid;
            // util.request(api.GoodsShare, {
            //     id: id
            // }).then(function(res) {
            //     if (res.errno === 0) {
            //         that.setData({
            //             goods: res.data,
            //         });
            //         that.eventDraw(qrcodeUrl);
            //     }
            // });
            that.eventDraw();
        },
        eventDraw() {
            let that = this;
            let goodsUrl = that.data.goodsUrl;
            let goods = that.data.goods;

            that.setData({
                painting: {
                    width: 248,
                    height: 366,
                    background: '#fff',
                    clear: true,
                    views: [{
                            type: 'rect',
                            top: 0,
                            left: 0,
                            width: 248,
                            height: 366,
                            background: '#ccc'
                        },
                        {
                            type: 'rect',
                            top: 248,
                            left: 16,
                            width: 216,
                            height: 80,
                            background: '#fff',
                            borderRadius: 8
                        },

                        {
                            type: 'rect',
                            top: 202,
                            left: 78,
                            width: '10',
                            height: '13',
                            background: '#fff'
                        },

                        {
                            type: 'rect',
                            top: 340,
                            left: 80,
                            width: '87',
                            height: '14',
                            background: '#fff'
                        },
                        {
                            type: 'arc',
                            top: 40,
                            left: 74,
                            width: '100',
                            height: '100',
                            background: '#fff',
                        },
                        // {
                        //     type: 'arc',
                        //     top: 109,
                        //     left: 149,
                        //     width: '30',
                        //     height: '30',
                        //     background: '#fff',
                        // },  


                        // {
                        //     type: 'image',
                        //     url: goodsUrl,
                        //     top: 35,
                        //     left: 35,
                        //     width: 305,
                        //     height: 305,
                        // },
                        {
                            type: 'text',
                            content: '???????????????',
                            fontSize: 16,
                            lineHeight: 22,
                            color: '#383549',
                            textAlign: 'left',
                            top: 170,
                            left: 83,
                            width: 305,
                            MaxLineNumber: 1,
                            breakWord: true,
                            // bolder: true
                        },
                        {
                            type: 'text',
                            content: '13255998901',
                            fontSize: 14,
                            lineHeight: 17,
                            color: '#4A4A4A',
                            textAlign: 'left',
                            top: 202,
                            left: 96,
                            width: 40,
                            MaxLineNumber: 1,
                            // breakWord: true,
                            // bolder: true
                        },
                        {
                            type: 'text',
                            content: '???????????????',
                            fontSize: 14,
                            lineHeight: 20,
                            color: '#383549',
                            textAlign: 'left',
                            top: 262,
                            left: 28,
                            width: 150,
                            MaxLineNumber: 1,
                            breakWord: true,
                            // bolder: true
                        },
                        {
                            type: 'text',
                            content: '???????????????????????????????????????????????????',
                            fontSize: 10,
                            lineHeight: 14,
                            color: '#4A4A4A',
                            textAlign: 'left',
                            top: 286,
                            left: 28,
                            width: 104,
                            MaxLineNumber: 2,
                            breakWord: true,
                            // bolder: true
                        },

                        {
                            type: 'text',
                            content: '???NU???',
                            fontSize: 10,
                            lineHeight: 14,
                            color: '#8c8c8c',
                            textAlign: 'left',
                            top: 264,
                            left: 102,
                            width: 200,
                            MaxLineNumber: 1,
                            // breakWord: true,
                            // bolder: true
                        },
                        // {
                        //     type: 'image',
                        //     url: qrcodeUrl,
                        //     top: 470,
                        //     left: 127.5,
                        //     width: 120,
                        //     height: 120
                        // },
                        {
                            type: 'text',
                            content: '?????????????????????',
                            fontSize: 16,
                            color: '#383549',
                            textAlign: 'center',
                            top: 610,
                            left: 250,
                            lineHeight: 20,
                            MaxLineNumber: 1,
                            breakWord: true,
                            width: 200
                        }
                    ]
                }
            })
            this.setData({
                showCanvas: true,
                isPainting: true
            })
            this.readyPigment()
            this.triggerEvent('getImage', {
                errMsg: 'canvasdrawer:samme params'
            })
        },
        readyPigment() {
            const {
                width,
                height,
                views
            } = this.data.painting
            this.setData({
                width,
                height
            })
            // debugger
            const inter = setInterval(() => {
                if (this.ctx) {
                    clearInterval(inter)
                    this.ctx.clearActions()
                    this.ctx.save()
                    this.getImagesInfo(views)
                }
            }, 100)
        },
        getImagesInfo(views) {
            const imageList = []
            for (let i = 0; i < views.length; i++) {
                if (views[i].type === 'image') {
                    //    debugger
                    //     console.log(views[i].url)
                    imageList.push(this.getImageInfo(views[i].url))
                }
            }
            const loadTask = []
            for (let i = 0; i < Math.ceil(imageList.length / 8); i++) {
                loadTask.push(new Promise((resolve, reject) => {
                    Promise.all(imageList.splice(i * 8, 8)).then(res => {
                        resolve(res)
                    }).catch(res => {
                        reject(res)
                    })
                }))
            }
            Promise.all(loadTask).then(res => {
                let tempFileList = []
                for (let i = 0; i < res.length; i++) {
                    tempFileList = tempFileList.concat(res[i])
                }
                this.setData({
                    tempFileList
                })
                this.startPainting()
            })
        },
        startPainting() {
            // console.log('startPainting');
            const {
                tempFileList,
                painting: {
                    views
                }
            } = this.data
            // console.log(tempFileList)
            for (let i = 0, imageIndex = 0; i < views.length; i++) {
                // console.log(views[i]);
                // console.log(views[i].type);
                if (views[i].type === 'image') {
                    this.drawImage({
                        ...views[i],
                        url: tempFileList[imageIndex]
                    })
                    imageIndex++
                } else if (views[i].type === 'text') {
                    if (!this.ctx.measureText) {
                        wx.showModal({
                            title: '??????',
                            content: '??????????????????????????????????????? measureText ???????????????????????????????????????????????????'
                        })
                        this.triggerEvent('getImage', {
                            errMsg: 'canvasdrawer:version too low'
                        })
                        return
                    } else {
                        this.drawText(views[i])
                    }
                } else if (views[i].type === 'rect') {
                    this.drawRect(views[i])
                } else if (views[i].type === 'arc') {
                    // ctx.arc(150, 150, 60, 0, 2 * Math.PI)
                    this.ctx.strokeStyle = '#fff';
                    const {
                        top = 0,
                            left = 0,
                            width = 0,
                            height = 0
                    } = views[i]
                    this.ctx.arc(left + width / 2, top + width / 2, width / 2, 0, 2 * Math.PI);
                    this.ctx.clip()
                    this.drawRect(views[i])
                    this.ctx.restore()

                    // this.ctx.stroke();
                    // this.ctx.clip()


                    // this.drawRect(views[i])

                    // ctx.drawImage(img, 90, 90, 120, 120)

                    // this.ctx.beginPath();
                    // this.ctx.lineWidth = 2;
                    // this.ctx.strokeStyle = '#fff';

                    // this.ctx.arc(122,80,  views[i].radius/2, 0, 2 * Math.PI);

                    // this.ctx.stroke();
                }
            }
            // console.log('?????????????????');
            this.ctx.draw(false, () => {
                // console.log(this.cache);
                wx.setStorageSync('canvasdrawer_pic_cache', this.cache)
                const system = wx.getSystemInfoSync().system
                if (/ios/i.test(system)) {
                    this.saveImageToLocal()
                } else {
                    // ???????????????????????????????????????????????????bug???
                    setTimeout(() => {
                        this.saveImageToLocal()
                    }, 800)
                }
            })
        },
        drawImage(params) {
            // console.log('drawImage');
            this.ctx.save()
            const {
                url,
                top = 0,
                left = 0,
                width = 0,
                height = 0,
                borderRadius = 0,
                deg = 0
            } = params
            // if (borderRadius) {
            //   this.ctx.beginPath()
            //   this.ctx.arc(left + borderRadius, top + borderRadius, borderRadius, 0, 2 * Math.PI)
            //   this.ctx.clip()
            //   this.ctx.drawImage(url, left, top, width, height)
            // } else {
            if (deg !== 0) {
                this.ctx.translate(left + width / 2, top + height / 2)
                this.ctx.rotate(deg * Math.PI / 180)
                this.ctx.drawImage(url, -width / 2, -height / 2, width, height)
            } else {
                this.ctx.drawImage(url, left, top, width, height)
            }
            // }
            this.ctx.restore()
        },
        drawText(params) {
            // console.log('drawText');
            this.ctx.save()
            // console.log('drawText');            
            const {
                MaxLineNumber = 2,
                    breakWord = false,
                    color = 'black',
                    content = '',
                    fontSize = 16,
                    top = 0,
                    left = 0,
                    lineHeight = 20,
                    textAlign = 'left',
                    width,
                    bolder = false,
                    textDecoration = 'none'
            } = params

            this.ctx.beginPath()
            this.ctx.setTextBaseline('top')
            this.ctx.setTextAlign(textAlign)
            this.ctx.setFillStyle(color)
            this.ctx.setFontSize(fontSize)

            if (!breakWord) {
                this.ctx.fillText(content, left, top)
                this.drawTextLine(left, top, textDecoration, color, fontSize, content)
            } else {
                let fillText = ''
                let fillTop = top
                let lineNum = 1
                for (let i = 0; i < content.length; i++) {
                    fillText += [content[i]]
                    if (this.ctx.measureText(fillText).width > width) {
                        if (lineNum === MaxLineNumber) {
                            if (i !== content.length) {
                                fillText = fillText.substring(0, fillText.length - 1) + '...'
                                this.ctx.fillText(fillText, left, fillTop)
                                this.drawTextLine(left, fillTop, textDecoration, color, fontSize, fillText)
                                fillText = ''
                                break
                            }
                        }
                        this.ctx.fillText(fillText, left, fillTop)
                        this.drawTextLine(left, fillTop, textDecoration, color, fontSize, fillText)
                        fillText = ''
                        fillTop += lineHeight
                        lineNum++
                    }
                }
                this.ctx.fillText(fillText, left, fillTop)
                this.drawTextLine(left, fillTop, textDecoration, color, fontSize, fillText)
            }
            this.ctx.restore()
            if (bolder) {
                this.drawText({
                    ...params,
                    left: left + 0.3,
                    top: top + 0.3,
                    bolder: false,
                    textDecoration: 'none'
                })
            }
        },
        drawTextLine(left, top, textDecoration, color, fontSize, content) {
            if (textDecoration === 'underline') {
                this.drawRect({
                    background: color,
                    top: top + fontSize * 1.2,
                    left: left - 1,
                    width: this.ctx.measureText(content).width + 3,
                    height: 1
                })
            } else if (textDecoration === 'line-through') {
                this.drawRect({
                    background: color,
                    top: top + fontSize * 0.6,
                    left: left - 1,
                    width: this.ctx.measureText(content).width + 3,
                    height: 1
                })
            }
        },
        drawRect(params) {
            this.ctx.save()
            const {
                background,
                top = 0,
                left = 0,
                width = 0,
                height = 0
            } = params
            this.ctx.setFillStyle(background)
            this.ctx.fillRect(left, top, width, height)
            this.ctx.restore()
        },
        getImageInfo(url) {
            return new Promise((resolve, reject) => {
                if (this.cache[url]) {
                    resolve(this.cache[url])
                } else {
                    const objExp = new RegExp(/^http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/)
                    if (objExp.test(url)) {
                        wx.getImageInfo({
                            src: url,
                            complete: res => {
                                // console.log(res.errMsg);
                                if (res.errMsg === 'getImageInfo:ok') {
                                    this.cache[url] = res.path
                                    resolve(res.path)
                                } else {
                                    this.triggerEvent('getImage', {
                                        errMsg: 'canvasdrawer:download fail'
                                    })
                                    reject(new Error('getImageInfo fail'))
                                }
                            }
                        })
                    } else {
                        this.cache[url] = url
                        resolve(url)
                    }
                }
            })
        },
        saveImageToLocal() {
            // console.log('saveImageToLocal');
            const {
                width,
                height
            } = this.data
            wx.canvasToTempFilePath({
                x: 0,
                y: 0,
                width,
                height,
                canvasId: 'canvasdrawer',
                complete: res => {
                    if (res.errMsg === 'canvasToTempFilePath:ok') {
                        this.setData({
                            showCanvas: false,
                            isPainting: false,
                            tempFileList: []
                        })
                        const data = {
                            tempFilePath: res.tempFilePath,
                            errMsg: 'canvasdrawer:ok'
                        }
                        this.eventGetImage(data)
                        // this.triggerEvent('getImage', {
                        //     tempFilePath: res.tempFilePath,
                        //     errMsg: 'canvasdrawer:ok'
                        // })
                    } else {
                        const data = {
                            errMsg: 'canvasdrawer:fail'
                        }
                        this.eventGetImage(data)
                        // this.triggerEvent('getImage', {
                        //     errMsg: 'canvasdrawer:fail'
                        // })
                    }
                }
            }, this)
        },
        eventGetImage(data) {
            wx.hideLoading()
            const {
                tempFilePath,
                errMsg
            } = data
            if (errMsg === 'canvasdrawer:ok') {
                this.setData({
                    shareImage: tempFilePath
                })
            }
        },
        eventSave() {
            wx.saveImageToPhotosAlbum({
                filePath: this.data.shareImage,
                success(res) {
                    wx.showToast({
                        title: '??????????????????',
                        icon: 'success',
                        duration: 2000
                    })
                }
            })
        },
    }
})