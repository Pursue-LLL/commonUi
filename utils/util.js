/* 初始化云开发数据库 */
wx.cloud.init({
  env: 'xxiaoer-server-oey7d',
  traceUser: true,
})
//获取数据库实例
wx.db = wx.cloud.database()
wx._ = wx.db.command
wx.$ = wx.db.command.aggregate

/* 初始化高度地图 */
const amapFile = require('../utils/amap-wx.js');
const myAmap = new amapFile.AMapWX({
  key: '19e07dcf72353cc39f2c7bf9bcf56a13'
});
wx.myAmap = myAmap


//引入计算属性和监听属性工具类库  //注意按需加载
wx.computedBehavior = require('miniprogram-computed')

/* 引入全局事件通讯模块 */
wx.eventBus = require('./event-bus')

//引入mobx 状态管理
// import { storeBindingsBehavior, createStoreBindings } from 'mobx-miniprogram-bindings'
// import { store } from '../utils/store'
// wx.store = store
// wx.storeBindings = storeBindingsBehavior
// wx.createBindings = createStoreBindings



const isNumber = targe => Object.prototype.toString.call(targe) === '[object Number]'
const isArray = targe => Object.prototype.toString.call(targe) === '[object Array]'
const isString = targe => Object.prototype.toString.call(targe) === '[object String]'
const isObject = targe => Object.prototype.toString.call(targe) === '[object Object]'

// const isUndefined = targe => Object.prototype.toString.call(targe) === '[object Undefined]'
// const isBoolean = targe => Object.prototype.toString.call(targe) === '[object Boolean]'
// const isFunction = targe => Object.prototype.toString.call(targe) === '[object Function]'



const commonFun = {
  /* 临时图片操作相关 */
  previewTmpImg(e) {
    wx.previewImage({
      current: e.currentTarget.dataset.src,
      urls: this.data.tempChoosedImg,
    })
  },

  chooseImage() {
    wx.util.chooseImage(this.data.tempChoosedImg, this)
  },

  delChoosedImg(e) {
    wx.util.delChoosedImg(e, this)
  },
}



/**
 * 后端数据相关api
 *
 * */
wx.Api = {}
/**
 *  删除cdn上传的图片资源
 *
 * @param {string|string[]} urls
 */
wx.Api.delImg = function (urls) {
  console.log('本次要删除素材',urls);
  if (!urls || urls.length == 0) return
  if (isArray(urls)) {
    urls = urls.map((item => {
      return item.subBefore("!")          //(截掉附加的后缀)
    }))
  } else {
    urls = urls.subBefore("!")
  }

  const del = wx.Bmob.File()
  del.destroy(urls).then((res) => {
    console.log("删除素材成功", res);
  }).catch(function (err) {
    console.log(err);
  });
}

/* 格式化服务器时间 */
wx.Api.getServeDate = function (date) {
  return wx.$.dateToString({
    date: date,
    format: '%m月%d日 %H:%M',
    timezone: 'Asia/Shanghai'
  })
}

/* 更新集合特定字段 */
wx.Api.updateCollection = async function (_id, model, data) {
  try {
    return await wx.cloud.callFunction({
      name: 'updateCollection',
      data: {
        _id,
        model,
        data
      }
    })
  } catch (e) {
    console.error(e)
  }
}

/**
 *
 *  多个操作符更新字段
 * @param {*} _id
 * @param {*} model
 * @param {object|object[]} update
 * @param {string} update.field-。
 * @param {string} update.cmd-。
 * @param {string} update.val-。

 * @returns
 */
wx.Api.updateByCmd = async function (data) {
  try {
    return await wx.cloud.callFunction({
      name: 'updateByCmd',
      data
    })
  } catch (e) {
    console.error(e)
  }
}

// 检测敏感词 wx.Api.msgSecCheck
wx.Api.msgSecCheck = function (msg) {
  return new Promise((resolve) => {
    let data = {
      msg: msg
    }
    wx.ajax('wxApi/msgSecCheck', data).then((res) => {
      console.log(res)
      if (res.errcode == 87014) {
        wx.Toast(this, '您再检查一下,输入的内容里不要包含敏感词哦~')
        //计入评分系统 不要尝试发送违规内容
        resolve(false)
      }
      resolve(true)
    }).catch((res) => {
      console.log('捕获错误', res);
    })
  })
}

/* 获取官方预设数据 */
wx.Api.getOfficialData = function (field) {
  return new Promise((resolve) => {
    wx.db.collection("_Official").doc('official_preset_doc').field({
      [field]: true,
    }).get().then(res => {
      resolve(res.data[field])
    })
  })
}

/* 添加通知消息 */
wx.Api.addMessage = async function (_id, field, data) {
  let msgObj = {
    _id: wx.util.generateUUID(),
    avatar: wx.MY.avatar,
    nickName: wx.MY.nickName,
    msg: '关注了你',
    user_id: wx.MYID,
    createdAt: wx.db.serverDate(),//{offset: 60 * 60 * 1000 * 8}
  }
  Object.assign(msgObj, data)
  return await wx.Api.updateByCmd({
    _id,
    model: 'message',
    update: [
      {
        field: `${field}Msg`,
        cmd: 'unshift',
        val: msgObj
      }, {
        field: `${field}UnviewNum`,
        cmd: 'inc',
        val: 1
      }
    ]
  })
}





/**
 * 防抖 (首次不执行) 短时间只触发一次
 * 适用短时间内多次触发,只需在最后一次触发时执行的的情况
 * */

function debounce(fn, delay = 200) {
  let timer = null;
  return function () {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {  //重新计时
      fn.apply(this, arguments);
      timer = null;
    }, delay);
  }
}

/**
 * 节流  (首次执行) 在 wait 秒内最多执行 func 一次的函数
 * @param {function} fn
 * @param {number} delay
 */

function throttle(fn, delay) {
  let last = 0;
  return function () {
    let cur = +new Date();
    if (cur - last > delay) {
      fn.apply();
      last = cur;
    }
  }
}

// 截取关键词之前
String.prototype.subBefore = function (key) {
  var str = this
  if (this.includes(key)) {
    let index = this.lastIndexOf(key)
    str = this.substring(0, index)
  }
  return str
}


//末尾添加不重复元素
Array.prototype.unique = function () {
  for (let i = 0; i < arguments.length; i++) {
    var ele = arguments[i];
    if (this.indexOf(ele) == -1) {
      this.push(ele);
    }
  }
};

// 删除数组指定元素
Array.prototype.remove = function (val) {
  let index
  if (isString(val)) {
    index = this.indexOf(val);
  } else {    /* 如果参数为对象 */
    let key = Object.keys(val)[0]
    index = this.findIndex(function (item) { return item[key] === val[key] })
  }

  if (index > -1) {
    this.splice(index, 1);
  }
  return this
};

// 修改数组指定元素
Array.prototype.update = function (val, newVal) {
  let index
  if (isString(val)) {
    index = this.indexOf(val);
    this[index] = newVal
  } else {    /* 如果val参数为对象 */
    let key = Object.keys(val)[0]
    index = this.findIndex(function (item) { return item[key] === val[key] })
    if (isString(newVal)) {
      this[index][key] = newVal
    } else {
      let newkey = Object.keys(newVal)[0]
      this[index][newkey] = newVal[newkey]
    }
  }
  return this
};

//数组元素随机(洗牌)
Array.prototype.shuffle = function () {
  var that = this;
  this.re = [];
  this.t = this.length;
  for (var i = 0; i < this.t; i++) {
    (function (i) {
      var temp = that;
      var m = Math.floor(Math.random() * temp.length);
      that.re[i] = temp[m];
      that.splice(m, 1);
    })(i)
  }
  return this.re
}

// 数组克隆 浅拷贝
// Array.prototype.copy = function () {
//   var [...newArr] = this
//   return newArr
// }

// 深拷贝 (键非函数)
Array.prototype.copy = function () {
  return JSON.parse(JSON.stringify(this))
}

//数组合并
Array.prototype.merge = function (arr) {
  this.push(...arr)
}

//数组去重
// Array.prototype.dedupe = function(array) {
//   return Array.from(new Set(array));
// let unique = [...new Set(arr)];
// }




// 对象数组排序方法
Array.prototype.keySort = function (key) {
  return this.sort(function (o, p) {
    var a, b;
    if (typeof o === "object" && typeof p === "object" && o && p) {
      a = o[key];
      b = p[key];
      if (a === b) {
        return 0;
      }
      //纯数字
      if (typeof a === typeof b && typeof b === 'number') {
        return Number(a) < Number(b) ? 1 : -1;
        // return a - b; //数字升序
      }
      //包含数字的字符串 只取数字部分进行比较
      if (typeof a === typeof b && typeof b === 'string') {
        let reg = /[^0-9]/ig
        return Number(a.replace(reg, "")) < Number(b.replace(reg, "")) ? 1 : -1;
      }
      return typeof a < typeof b ? 1 : -1;
    }
    else {
      throw ("error");
    }
  })
}



//修复Math计算相乘精度丢失
Math.floatFix = function (val, digit = 1) {
  var m = Math.pow(10, digit);
  return parseInt(val * m) / m;
}



/* 获取链式对象属性 避免undefined报错*/
Object.getAttr = function (obj, search) {
  if (!obj) return ''
  const arr = search.split(".");
  for (let i = 0; i < arr.length; i++) {
    obj = obj[arr[i]]
    if (obj === undefined) {
      return '';
    }
  }
  return obj;
}

//判断对象深度相等
Object.Equal = function Equal(a = {}, b = {}) {
  var aProps = Object.getOwnPropertyNames(a);
  var bProps = Object.getOwnPropertyNames(b);
  let alen = aProps.length
  if (alen != bProps.length) {
    return false;
  }
  for (var i = 0; i < alen; i++) {
    var propName = aProps[i]
    var propA = a[propName]
    var propB = b[propName]
    if ((typeof (propA) === 'object')) {
      if (this.Equal(propA, propB)) { //数组或者对象相等接着向后遍历 直到最后一个属性对比完成结束
        if (i == alen - 1) return true
      } else {
        return false
      }
    } else if (propA !== propB) {
      return false
    }
  }
  return true
}



/**
 *URL对象转为查询字符串
 *
 * @param {*} obj
 */
Object.getUrlString = function (obj) {
  return encodeURIComponent(JSON.stringify(obj))
}
String.getUrlObject = function (string) {
  return JSON.parse(decodeURIComponent(string))
}

// 格式化当前时间戳为月日时分
const formatTime = function (date) {
  var month = date.getMonth() + 1
  var day = date.getDate()
  var hour = date.getHours()
  var minute = date.getMinutes()
  if (hour < 10) hour = '0' + hour
  if (minute < 10) minute = '0' + minute

  return month + '月' + day + '日' + ' ' + hour + ':' + minute
}

/* 格式化标准时间为几天前格式 */
function timeAgo(date) {
  if (!date) return
  const dateTimeStamp = date.valueOf()
  var minute = 1000 * 60;      //把分，时，天，周，半个月，一个月用毫秒表示
  var hour = minute * 60;
  var day = hour * 24;
  var week = day * 7;
  var halfamonth = day * 15;
  var month = day * 30;
  var now = new Date().getTime();   //获取当前时间毫秒
  var diffValue = now - dateTimeStamp;//时间差

  if (diffValue < 0) return
  var minC = diffValue / minute;  //计算时间差的分，时，天，周，月
  var hourC = diffValue / hour;
  var dayC = diffValue / day;
  var weekC = diffValue / week;
  var monthC = diffValue / month;
  let result
  if (monthC >= 1 && monthC <= 3) {
    result = " " + parseInt(monthC) + "月前"
  } else if (weekC >= 1 && weekC <= 3) {
    result = " " + parseInt(weekC) + "周前"
  } else if (dayC >= 1 && dayC <= 6) {
    result = " " + parseInt(dayC) + "天前"
  } else if (hourC >= 1 && hourC <= 23) {
    result = " " + parseInt(hourC) + "小时前"
  } else if (minC >= 1 && minC <= 59) {
    result = " " + parseInt(minC) + "分钟前"
  } else if (diffValue >= 0 && diffValue <= minute) {
    result = "刚刚"
  } else {
    var datetime = new Date();
    datetime.setTime(dateTimeStamp);
    var Nyear = datetime.getFullYear();
    var Nmonth = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
    var Ndate = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
    var Nhour = datetime.getHours() < 10 ? "0" + datetime.getHours() : datetime.getHours();
    var Nminute = datetime.getMinutes() < 10 ? "0" + datetime.getMinutes() : datetime.getMinutes();
    var Nsecond = datetime.getSeconds() < 10 ? "0" + datetime.getSeconds() : datetime.getSeconds();
    result = Nyear + "-" + Nmonth + "-" + Ndate
  }
  return result;
}

/* 生成唯一标识符 uuid */
function generateUUID() {
  var d = new Date().getTime();
  // if (window.performance && typeof window.performance.now === "function") {
  //   d += performance.now(); //use high-precision timer if available
  // }
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
  return uuid;
}





/** canvas压缩图片 */
// var compressionImage = function (index, tempFilePaths, arr, cb, that) {
//   let len = tempFilePaths.length
//   if (index < len) {
//     wx.getImageInfo({
//       src: tempFilePaths[index],
//       success: function (res) {
//         console.log("原图信息:", res)
//         var ctx = wx.createCanvasContext('photo_canvas');
//         //设置canvas尺寸
//         var ratio = 0.9;
//         var canvasWidth = res.width //图片原始长宽
//         var canvasHeight = res.height
//         while (canvasWidth > parseInt(wx.WIN_WIDTH * 0.7) || canvasHeight > parseInt(wx.WIN_HEIGHT * 0.7)) {// 保证宽高在400以内
//           canvasWidth = Math.trunc(canvasWidth * ratio)
//           canvasHeight = Math.trunc(canvasHeight * ratio)
//         }
//         that.setData({
//           canvas_h: canvasHeight * 2,
//           canvas_w: canvasWidth * 2
//         })
//         ctx.imageSmoothingEnabled = true
//         ctx.drawImage(tempFilePaths[index], 0, 0, res.width, res.height, 0, 0, canvasWidth * 2, canvasHeight * 2)
//         ctx.draw(false, function (res) {
//           console.log(res)
//           index = index + 1;//上传成功的数量，上传成功则加1
//           setTimeout(() => {
//             wx.canvasToTempFilePath({
//               destWidth: canvasWidth,
//               destHeight: canvasHeight,
//               canvasId: 'photo_canvas',
//               fileType: "jpg",
//               success: function (res) {
//                 arr.push(res.tempFilePath)
//                 // console.log("压缩完成", arr)
//                 wx.hideLoading();
//                 if (index == len) {
//                   var file;
//                   for (let item of arr) {
//                     file = Bmob.File('taskPic.jpg', item);
//                   }
//                   file.save().then(res => {
//                     let urls = []
//                     for (const item of res) {
//                       item.url = item.url.replace("bmob-cdn-19715.b0.upaiyun.com", "yun.qyayun.com");
//                       urls.push(item.url)
//                     }
//                     console.log("上传图片到服务器成功")
//                     if (len == 1) {
//                       wx.getImageInfo({
//                         src: arr[0],
//                         success(res1) {
//                           console.log("获取压缩完的单张图片宽高信息", res1)
//                           let obj = {
//                             url: urls[0],
//                             imgWidth: res1.width,
//                             imgHeight: res1.height
//                           }
//                           cb([obj])
//                         },
//                         fail(res) {
//                           console.log(res)
//                         }
//                       })
//                     } else {
//                       cb(urls)
//                     }
//                   }).catch(err => {
//                     console.log(err)
//                   })
//                 }
//                 compressionImage(index, tempFilePaths, arr, cb, that)
//               },
//               fail(res) {
//                 if (res.errMsg === "canvasToTempFilePath:fail:create bitmap failed") {
//                   console.log("导出map失败")
//                 }
//                 compressionImage(index, tempFilePaths, arr, cb, that)
//               }
//             }, this)
//           }, 200);
//         })
//       },
//       fail: function (res) {
//         console.log(res)
//       }
//     })
//   }
// }

// 删除临时选择图片
const delChoosedImg = function (e, that) {
  let index = e.currentTarget.dataset.idx
  let url = e.currentTarget.dataset.url
  that.data.tempChoosedImg.splice(index, 1)
  that.setData({
    ['tempChoosedImg']: that.data.tempChoosedImg,
  })
  /* //!存在没有发布就退出的情况 此时图片已经被直接被删除 */
  if (url.includes('qyayun')) {
    wx.Api.delImg(url)
  }
}


/* 并发检测图片违规 */
const checkImage = async (curImgs) => {
  const Pm = curPath => new Promise((resolve) => {
    let data = wx.getFileSystemManager().readFileSync(curPath)
    console.log(data);

    wx.cloud.callFunction({
      name: 'imgSecCheck',
      data: {
        data: data
      }
    }).then(res => {
      // console.log(res);
      resolve(res.result.errCode)

    }).catch(err => {
      console.log(err);
    })
  })
  try {
    let len = curImgs.length
    const tasks = []
    for (let i = 0; i < len; i++) {
      const promise = Pm(curImgs[i])
      tasks.push(promise)
    }
    /* 按顺序 */
    // return (await Promise.all(tasks)).reduce((acc, cur) => {
    //   return acc.concat(cur)
    // },[])
    return await Promise.all(tasks)
  } catch (e) {
    console.error(e)
  }
}


/**
 *  并发压缩图片
 */
const compressImage = async (curImgs) => {
  const Pm = curPath => new Promise((resolve) => {
    wx.compressImage({
      src: curPath, // 图片路径
      quality: 80,// 压缩质量
      success: function (res) {
        resolve(res.tempFilePath)
      },
      fail: function (err) {
        console.log(err);
      }
    })
  })
  try {
    let len = curImgs.length
    const tasks = []
    for (let i = 0; i < len; i++) {
      const promise = Pm(curImgs[i])
      tasks.push(promise)
    }
    /* 按顺序 */
    // return (await Promise.all(tasks)).reduce((acc, cur) => {
    //   return acc.concat(cur)
    // },[])
    return await Promise.all(tasks)
  } catch (e) {
    console.error(e)
  }
}

/**
 *  选择图片
 * @param {*} arred 已经选择图片
 * @param {*} that
 */
const chooseImage = function (arred = [], that, limit = 9) {
  return new Promise((resolve) => {
    wx.dotLoading(that)
    console.log("历史照片", arred)
    const edLen = isNumber(arred) ? arred : arred.length
    if (edLen < limit) {
      const c = limit - edLen
      wx.chooseImage({
        count: c, // 默认9
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: function (res) {
          // wx.dotHide(that);
          const filePaths = res.tempFilePaths
          checkImage(filePaths).then(res => {
            console.log(res);
            if (res.includes(87014)) {
              wx.dotHide(that);
              wx._showModal(that, {
                title: '请您注意',
                hint: '您选择的图片经检测包含违规内容,一旦系统检测到违规内容将会扣除您相应的校分并添加到记录,校分是用户荣誉品质和良好行为的见证,以营造良好和谐的网络环境,如对本次处理有异议,可点击下方申诉',
                cancle: '我要申诉',
                confirm: '我知道了'
              }).then(() => {
                console.log('确定');
              }).catch(() => {
                console.log('取消');
              })
            } else {
              compressImage(filePaths).then(res => {
                resolve(res)  //返回本次上传图片
                if (isArray(arred)) {
                  arred.merge(res)
                  that.setData({
                    tempChoosedImg: arred
                  })
                }
                wx.dotHide(that);
              })
            }
          })
        },
        fail: function () {
          wx.dotHide(that);
        }
      })
    } else {
      wx.Toast(that, `当前最多可选择${limit}张图片!`)
    }
  })

}

/**
 *
 *上传图片 (压缩完再上传)
 * @param {*} that
 * @param {*} prefix
 * @param {*} imgInfo  是否需要上传大图
 * @param {*} urls  选择图片直接上传的需要给定本次上传的urls
 * @returns
 */
const uploadPic = function (that, { prefix, imgInfo, urls } = {}) {
  return new Promise((resolve) => {
    var arr = urls || that.data.tempChoosedImg  //(临时被选择图片,选择完可以预览编辑的情况)
    console.log("本次上传图片", arr);
    if (arr.length) {
      var file;
      let fileName = `${prefix}_${wx.MY.nickName}_${wx.MYID}_.png`
      // console.log(fileName);

      let cdns = arr.filter((item) => { return item.includes('qyayun') })
      //如果全部都为网图  直接返回 不重新上传
      if (cdns.length == arr.length) {
        resolve(arr)
        return
      }

      let urls = []
      for (const item of arr) {
        if (item.includes('qyayun')) {
          //如果只有一张网图 原链接不带后缀
          if (cdns.length == 1) {
            item += wx.globalData.imgCompress
          }
          urls.push(item)
        } else {
          file = wx.Bmob.File(fileName, item);
        }
      }
      file.save().then(res => {
        console.log(res);
        for (const item of res) {
          var addstr = '!' + wx.globalData.imgCompress
          //!  getImageInfo不支持获取webp图片信息(一张图的情况)
          if (imgInfo && arr.length == 1) addstr = '!'
          item.url = item.url.replace("bmob-cdn-19715.b0.upaiyun.com", "yun.qyayun.com") + addstr
          urls.push(item.url)
        }
        wx.dotHide(that);
        resolve(urls)
        // console.log(res)
        console.log("上传图片到服务器成功", urls)
      }).catch(err => {
        console.log(err)
        wx.Toast(that, '网络开小差了~再试一下')
        wx.dotHide(that)
      })
    } else {  //没有图片
      resolve([])
    }
  })
}


// 预览服务器图片 预览和原图统一80压缩率
const previewNetImage = function (current, imgArr, isBig) {
  if (imgArr.length == 1 && isBig) { //有大图
    var urls = [imgArr[0].url + wx.globalData.imgCompress];
    // console.log('当前链接', urls)
    current += wx.globalData.imgCompress
  } else {
    var urls = imgArr;
    // console.log('当前链接数组', urls)
  }
  console.log('当前current', current);

  wx.previewImage({
    current,
    urls,
  });
}











module.exports = {
  commonFun,
  schoolData,
  chooseImage,
  delChoosedImg,
  compressImage,
  formatTime,
  uploadPic,
  previewNetImage,
  debounce,
  throttle,
  timeAgo,
  generateUUID

}