// miniprogram/pages/ucenter/userInfo/index.js
var api = require('../../../config/api')
var util = require('../../../utils/util');
var loginOut = getApp<IAppOption>();
import imClient from "../../../utils/imClient";
import { svgColor } from "../../../utils/changeThemeColor";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    newAgreementsId: '',
    isfocus: false,
    isfocus2: false,
    themeColor: wx.getStorageSync("themeColor"),
    my_header_avater: loginOut.globalData.imageUrl + "/icons/defaultMyIcon.svg",
    ValueMaxlength: 32,
    userInfo: {//自定义业务字段
      avatar: '',
      nickname: '',
      gender: '',
      mobile: '',
      constellation: '',
      cnCardNo: '',
      provinceName: '',
      cityName: '',
      regionName: '',
      birthday: ''
    },
    region: ['上海市', '上海市'],
    genderData: {
      3: '保密',
      1: "男",
      2: "女"
    },
    seeDetail: false,
    avatar: "",
    uploadUrl: "",
    index: 0,
    addressIndex: [0, 0],
    addressArray: [
      ['北京市', '天津市', '河北省', '山西省', '内蒙古自治区', '辽宁省', '吉林省', '黑龙江省', '上海市', '江苏省', '浙江省', '安徽省', '福建省', '江西省', '山东省', '河南省', '湖北省', '湖南省', '广东省', '广西壮族自治区', '海南省', '重庆市', '四川省', '贵州省', '云南省', '西藏自治区', '陕西省', '甘肃省', '青海省', '宁夏回族自治区', '新疆维吾尔自治区', '台湾省', '香港特别行政区', '澳门特别行政区'],
      ['北京市']
    ],
    isHandleClick: true
  },
  hanldefocus(e:any) {
    this.setData({
        [e.currentTarget.dataset.type]: true
    })
  },
  gettermsAndagreements() {
    util.request(api.getNewTermdetails).then((res: any) => {
      console.log(res, "这是最新的协议", res.data[0].termsId);
      this.setData({
        newAgreementsId: res.data[0].termsId
      })
    })
  },
  //   条款管理跳转
  termsAndagreements(event: any) {
    console.log(event, "event12312312");
    if (event.currentTarget.dataset.value == 1) {
      wx.navigateTo({
        url: '/packageOne/pages/termsManagement/index'
      })
    } else {
      wx.navigateTo({
        url: `/packageOne/pages/protocolDetails/index?code=${this.data.newAgreementsId}`
      })
    }
  },

  isChineseChar(str: string): any {
    var reg = /[\u4E00-\u9FA5\uF900-\uFA2D]/g
    return str.match(reg)
  },
  changeValue(e: any) {
    let chinese = this.isChineseChar(e.detail.value) && this.isChineseChar(e.detail.value).length || 0
    if (e.detail.value.length - chinese + chinese * 2 >= 32) {
      this.setData({
        ValueMaxlength: e.detail.value.length
      })
    }
  },
  bindRegionChange: function (e: any): void {
    console.log('picker发送选择改变，携带值为', e, e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },
  bindAddressPickerChange: function (e: any) {
    console.log('picker发送选择改变，携带值为 ', e.detail.value)
    this.setData({
      index: e.detail.value,
      region: [this.data.addressArray[0][this.data.addressIndex[0]], this.data.addressArray[1][this.data.addressIndex[1]]]
    })
  },
  /**
   * 列改变时触发事件
   */
  bindMutiAddressPickerChange: function (e: any) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value)

    this.dataValue(e.detail.value, e.detail.column)
  },
  dataValue(value: any, column: any) {
    var data = {
      addressArray: this.data.addressArray,
      addressIndex: this.data.addressIndex
    }
    data.addressIndex[column] = value;
    switch (column) {
      case 0:
        console.log('addressIndex值为：' + data.addressIndex[0])
        switch (data.addressIndex[0]) {
          case 0:
            data.addressArray[1] = ['北京市']
            break;
          case 1:
            data.addressArray[1] = ['天津市']
            break;
          case 2:
            data.addressArray[1] = ['石家庄市', '唐山市', '秦皇岛市', '邯郸市', '邢台市', '保定市', '张家口市', '承德市', '沧州市', '廊坊市', '衡水市']
            break;
          case 3:
            data.addressArray[1] = ['太原市', '大同市', '阳泉市', '长治市', '晋城市', '朔州市', '晋中市', '运城市', '忻州市', '临汾市', '吕梁市']
            break;
          case 4:
            data.addressArray[1] = ['呼和浩特市', '包头市', '乌海市', '赤峰市', '通辽市', '鄂尔多斯市', '呼伦贝尔市', '巴彦淖尔市', '乌兰察布市', '兴安盟', '锡林郭勒盟', '阿拉善盟']
            break;
          case 5:
            data.addressArray[1] = ['沈阳市', '大连市', '鞍山市', '抚顺市', '本溪市', '丹东市', '锦州市', '营口市', '阜新市', '辽阳市', '盘锦市', '铁岭市', '朝阳市', '葫芦岛市']
            break;
          case 6:
            data.addressArray[1] = ['长春市', '吉林市', '四平市', '辽源市', '通化市', '白山市', '松原市', '白城市', '延边朝鲜族自治州',]
            break;
          case 7:
            data.addressArray[1] = ['哈尔滨市', '齐齐哈尔市', '鸡西市', '鹤岗市', '双鸭山市', '大庆市', '伊春市', '佳木斯市', '七台河市', '牡丹江市', '黑河市', '绥化市', '大兴安岭地区']
            break;
          case 8:
            data.addressArray[1] = ['上海市']
            break;
          case 9:
            data.addressArray[1] = ['南京市', '无锡市', '徐州市', '常州市', '苏州市', '南通市', '连云港市', '淮安市', '盐城市', '扬州市', '镇江市', '泰州市', '宿迁市']
            break;
          case 10:
            data.addressArray[1] = ['杭州市', '宁波市', '温州市', '嘉兴市', '湖州市', '绍兴市', '金华市', '衢州市', '舟山市', '台州市', '丽水市']
            break;
          case 11:
            data.addressArray[1] = ['合肥市', '芜湖市', '蚌埠市', '淮南市', '马鞍山市', '淮北市', '铜陵市', '安庆市', '黄山市', '滁州市', '阜阳市', '宿州市', '六安市', '亳州市', '池州市', '宣城市']
            break;
          case 12:
            data.addressArray[1] = ['福州市', '厦门市', '莆田市', '三明市', '泉州市', '漳州市', '南平市', '龙岩市', '宁德市']
            break;
          case 13:
            data.addressArray[1] = ['南昌市', '景德镇市', '萍乡市', '九江市', '新余市', '鹰潭市', '赣州市', '吉安市', '宜春市', '抚州市', '上饶市']
            break;
          case 14:
            data.addressArray[1] = ['济南市', '青岛市', '淄博市', '枣庄市', '东营市', '烟台市', '潍坊市', '济宁市', '泰安市', '威海市', '日照市', '莱芜市', '临沂市', '德州市', '聊城市', '滨州市', '菏泽市']
            break;
          case 15:
            data.addressArray[1] = ['郑州市', '开封市', '洛阳市', '平顶山市', '安阳市', '鹤壁市', '新乡市', '焦作市', '濮阳市', '许昌市', '漯河市', '三门峡市', '南阳市', '商丘市', '信阳市', '周口市', '驻马店市']
            break;
          case 16:
            data.addressArray[1] = ['武汉市', '黄石市', '十堰市', '宜昌市', '襄阳市', '鄂州市', '荆门市', '孝感市', '荆州市', '黄冈市', '咸宁市', '随州市', '恩施土家族苗族自治州']
            break;
          case 17:
            data.addressArray[1] = ['长沙市', '株洲市', '湘潭市', '衡阳市', '邵阳市', '岳阳市', '常德市', '张家界市', '益阳市', '郴州市', '永州市', '怀化市', '娄底市', '湘西土家族苗族自治州']
            break;
          case 18:
            data.addressArray[1] = ['广州市', '韶关市', '深圳市', '珠海市', '汕头市', '佛山市', '江门市', '湛江市', '茂名市', '肇庆市', '惠州市', '梅州市', '汕尾市', '河源市', '阳江市', '清远市', '东莞市', '中山市', '潮州市', '揭阳市', '云浮市']
            break;
          case 19:
            data.addressArray[1] = ['南宁市', '柳州市', '桂林市', '梧州市', '北海市', '防城港市', '钦州市', '贵港市', '玉林市', '百色市', '贺州市', '河池市', '来宾市', '崇左市']
            break;
          case 20:
            data.addressArray[1] = ['海口市', '三亚市', '三沙市', '儋州市', '省直辖县级行政区划']
            break;
          case 21:
            data.addressArray[1] = ['重庆市', '县']
            break;
          case 22:
            data.addressArray[1] = ['成都市', '自贡市', '攀枝花市', '泸州市', '德阳市', '绵阳市', '广元市', '遂宁市', '内江市', '乐山市', '南充市', '眉山市', '宜宾市', '广安市', '达州市', '雅安市', '巴中市', '资阳市', '阿坝藏族羌族自治州', '甘孜藏族自治州', '凉山彝族自治州']
            break;
          case 23:
            data.addressArray[1] = ['贵阳市', '六盘水市', '遵义市', '安顺市', '毕节市', '铜仁市', '黔西南布依族苗族自治州', '黔东南苗族侗族自治州', '黔南布依族苗族自治州']
            break;
          case 24:
            data.addressArray[1] = ['昆明市', '曲靖市', '玉溪市', '保山市', '昭通市', '丽江市', '普洱市', '临沧市', '楚雄彝族自治州', '红河哈尼族彝族自治州', '文山壮族苗族自治州', '西双版纳傣族自治州', '大理白族自治州', '德宏傣族景颇族自治州', '怒江傈僳族自治州', '迪庆藏族自治州']
            break;
          case 25:
            data.addressArray[1] = ['拉萨市', '日喀则市', '昌都市', '林芝市', '山南市', '那曲市', '阿里地区']
            break;
          case 26:
            data.addressArray[1] = ['西安市', '铜川市', '宝鸡市', '咸阳市', '渭南市', '延安市', '汉中市', '榆林市', '安康市', '商洛市']
            break;
          case 27:
            data.addressArray[1] = ['兰州市', '嘉峪关市', '金昌市', '白银市', '天水市', '武威市', '张掖市', '平凉市', '酒泉市', '庆阳市', '定西市', '陇南市', '临夏回族自治州', '甘南藏族自治州']
            break;
          case 28:
            data.addressArray[1] = ['西宁市', '海东市', '海北藏族自治州', '黄南藏族自治州', '海南藏族自治州', '果洛藏族自治州', '玉树藏族自治州', '海西蒙古族藏族自治州']
            break;
          case 29:
            data.addressArray[1] = ['银川市', '石嘴山市', '吴忠市', '固原市', '中卫市']
            break;
          case 30:
            data.addressArray[1] = ['乌鲁木齐市', '克拉玛依市', '吐鲁番市', '哈密市', '昌吉回族自治州', '博尔塔拉蒙古自治州', '巴音郭楞蒙古自治州', '阿克苏地区', '克孜勒苏柯尔克孜自治州', '喀什地区', '和田地区', '伊犁哈萨克自治州', '塔城地区', '阿勒泰地区', '自治区直辖县级行政区划']
            break;
          case 31:
            data.addressArray[1] = ['台北市', '高雄市', '台南市', '台中市', '南投县', '基隆市', '新竹市', '嘉义市', '新北市', '宜兰县', '新竹县', '桃园市', '苗栗县', '彰化县', '嘉义县', '云林县', '屏东县', '台东县', '花莲县', '澎湖县']
            break;
          case 32:
            data.addressArray[1] = ['香港特别行政区']
            break;
          case 33:
            data.addressArray[1] = ['澳门特别行政区']
            break;
        }
        data.addressIndex[1] = 0
        break;
    }
    this.setData(data)
  },
  handleUpImg() {
    wx.chooseMedia({
      count: 1,
      mediaType: ["image"],
      sourceType: ['album', 'camera'],
      success(res: any) {
        let currentUrl = res.tempFiles[0].tempFilePath
        console.log(currentUrl, "9999999");
        wx.navigateTo({
          url: `/packageOne/pages/uploadAvatar/index?src=${currentUrl}`
        })
      },
      fail(err: any) {
        console.log(err);
      }
    })
  },
  changeColor(name: string, url: string, color = '#EBEBEB', type = 'fill') {
    util.svgColor(url, color, type).then((res: any) => {
      this.setData({ [name]: res })
    })


  },
  // 保存
  formSubmit(e: any) {
    if (!this.data.isHandleClick) return
    let value = e.detail.value;
    if (!value.nickname) return util.showErrorToast('昵称不能为空')
    if (!/^\S*$/.test(value.nickname)) return util.showErrorToast('昵称不能有空格，请重新输入')
    let data = {
      userProfile: {
        avatar: this.data.uploadUrl ? this.data.uploadUrl : this.data.avatar,
        nickname: value.nickname,
        provinceName: this.data.userInfo.provinceName,
        cityName: this.data.userInfo.cityName,
        regionName: this.data.userInfo.regionName
      }
    }
    data.userProfile.provinceName = this.data.region[0]
    data.userProfile.cityName = this.data.region[1]
    this.setData({
      isHandleClick: false
    })
    util.request(api.getUserInfo, data, "PUT").then(() => {
      console.log("成功了");
      wx.showToast({
        title: '已保存',
        icon: 'success',
        duration: 2000,
        success() {
          wx.setStorageSync('addInfo', 1);
          setTimeout(() => {
            util.backAddress();
          }, 2000)
        }
      });
    }).catch((err: any) => {
      this.setData({
        isHandleClick: true
      })
      util.showErrorToast(err.data.errMessage)
      if (err.data.errMessage === "头像存在敏感信息") {
        this.setData({
          avatar: this.data.userInfo.avatar,
          uploadUrl: ''
        })
      }
    })

  },
  handleBack() {
    wx.navigateBack()
  },
  // 退出登录
  handleLogOut() {
    let that = this;
    wx.showToast({
      title: '退出成功',
      icon: 'success',
      duration: 2000,
      success() {
        wx.getStorageSync("token") && wx.removeStorageSync("token");
        wx.getStorageSync("openId") && wx.removeStorageSync("openId");
        wx.getStorageSync("userInfo") && wx.removeStorageSync("userInfo");
        wx.getStorageSync("shopInfo") && wx.removeStorageSync("shopInfo");
        wx.getStorageSync("cookie") && wx.removeStorageSync("cookie");
        wx.getStorageSync("permisssion") && wx.removeStorageSync("permisssion");
        wx.getStorageSync("access_token") && wx.removeStorageSync("access_token");
        wx.getStorageSync("nuskinToken") && wx.removeStorageSync("nuskinToken");
        wx.getStorageSync("Neoanthropic") && wx.removeStorageSync("Neoanthropic");
        imClient.disconnect()
        // wx.getStorageSync("shopId")&&wx.removeStorageSync("shopId");
        // util.getThemeColor(70).then((themeColor:string)=>{
        //     wx.setStorageSync('themeColor',themeColor);
        //     loginOut.globalData.themeColor=themeColor;
        // });
        setTimeout(() => {
          wx.reLaunch({
            url: "/pages/index/index"
          })

        }, 2000)
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function ({ state }: { state: string }) {
    this.changeColor('my_header_avater', this.data.my_header_avater, wx.getStorageSync('themeColor'), "stroke")
    this.gettermsAndagreements()
    this.getUserInfo()
    if (state === 'seeDetail') {
      this.setData({
        seeDetail: true
      })
    } else {
      this.setData({
        seeDetail: false
      })
    }

    // this.changeColor('my_header_avater', this.data.my_header_avater, wx.getStorageSync('themeColor'), "stroke")
    // 隐私政策
  },
  getUserInfo() {
    util.request(api.getUserInfo).then((res: any) => {
      let userInfo = { ...res.data.user, ...res.data.userProfile, userName: res.data.nuskinUserInfo.userName }
      userInfo.birthday = userInfo.birthday ? util.formatDate(userInfo.birthday) : ''
      // http://tmp/ihHMMZkDyDNr77646e640306e3270edf369274e4581d.png
      let address = userInfo.provinceName && userInfo.cityName && [userInfo.provinceName, userInfo.cityName] || ["上海市", "上海市"]
      let provinceNameIndex = 0
      let cityNameIndex = 0
      this.data.addressArray[0].filter((item, index) => {
        if (item === userInfo.provinceName) {
          provinceNameIndex = index
        }
      })
      this.dataValue(provinceNameIndex, 0)
      this.data.addressArray[1].filter((item, index) => {
        if (item === userInfo.cityName) {
          cityNameIndex = index
        }
      })
      this.setData({
        userInfo,
        avatar: userInfo.avatar,
        region: address,
        addressIndex: [provinceNameIndex, cityNameIndex]
      })
    })
  },



  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      themeColor: loginOut.globalData.themeColor
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  }
})