import wxp from './wxp.js';
const crypto = require('./crypto-js');
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatTimeStr = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('') + [hour, minute, second].map(formatNumber).join('')
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

var MakeHttpHead = function(appid, appkey, timestamp, random, jsonstr) {
  var str_b = crypto.SHA256(jsonstr).toString()
  //console.log("str_b==" + str_b)
  var str_c = appid + timestamp + random.toString() + str_b
  //console.log("stc_c==" + str_c)
  var signbytes = crypto.HmacSHA256(str_c, appkey)
  //console.log("signbytes==" + signbytes)
  var sign = crypto.enc.Base64.stringify(signbytes);
  //console.log("sign==" + sign)
  var auth = 'OPEN-BODY-SIG AppId="' + appid + '", Timestamp="' + timestamp + '", Nonce="' + random.toString() + '", Signature="' + sign + '"'
  //console.log("auth==" + auth)
  var headers = {
    'Content-Type': 'application/json;charset=UTF-8',
    'Authorization': auth,
  }
  return headers;
}

var Post = function(url, headers, data) {
  var promise = new Promise((resolve, reject) => {
    //init
    var that = this;
    var postData = data;
    var head = headers;
    //网络请求
    wx.request({
      url: url,
      data: postData,
      method: 'POST',
      header: head,
      success: function(res) {
        resolve(res);
      },
      error: function(e) {
        reject(e);
      }
    })
  });
  return promise;
}

//加密使用的是3DES中的ECB,解密对应的使用ECB
var encrypt = function(data, key) {
  var base64 = crypto.enc.Utf8.parse(key)
  var encrypt = crypto.TripleDES.encrypt(data, base64, {
    mode: crypto.mode.ECB, //ECB模式
    padding: crypto.pad.Pkcs7 //padding处理Pkcs7=Pkcs5
  })
  var encryptData = encrypt.toString() //加密完成后，转换成字符串
  return encryptData
}

//解密
var decrypt = function(data, key) {
  var base64 = crypto.enc.Utf8.parse(key)
  var decrypt = crypto.TripleDES.decrypt(data, base64, {
    mode: crypto.mode.ECB,
    padding: crypto.pad.Pkcs7 //padding处理Pkcs7=Pkcs5
  })
  //解析数据后转为UTF-8
  var parseData = decrypt.toString(crypto.enc.Utf8)
  return parseData
}

//sha256
var SHA256 = function (data) {
  //解析数据后转为UTF-8
  var parseData = crypto.SHA256(data).toString().toLocaleUpperCase()
  return parseData
}

var ScanCode = function() {
  wxp.scanCode().then((res) => {
    var code = JSON.stringify(res.result);
    return code;
  }, (res) => {

  })
}


var ShowResult = function(title, icon) {
  wx.showToast({ //这里提示失败原因
    title: title,
    icon: icon,
    duration: 1500
  })


}


module.exports = {
  formatTime: formatTime,
  formatTimeStr: formatTimeStr,
  MakeHttpHead: MakeHttpHead,
  Post: Post,
  ShowResult: ShowResult,
  ScanCode: ScanCode,
  encrypt: encrypt,
  decrypt: decrypt,
  SHA256: SHA256

}