"use strict";
/**
 * 该文件用于在wx对象上挂载常用常量和函数,以方便全局调用
 */


//若使用计算属性和监听属性工具类库  //注意按需加载
wx.computedBehavior = require('miniprogram-computed')

/* 引入全局事件通讯模块 */
wx.eventBus = require('./event-bus')


const sys = wx.getSystemInfoSync();
const capsule = wx.getMenuButtonBoundingClientRect()  //根据胶囊计算导航栏高度

wx.IS_IPHONEX = sys.safeArea && sys.safeArea.top > 40
wx.IS_IOS = /ios/i.test(sys.system);
wx.IS_ANDROID = /android/i.test(sys.system);
wx.WIN_WIDTH = sys.screenWidth;
wx.WIN_HEIGHT = sys.screenHeight;
wx.CONTENT_HEIGHT = sys.screenHeight - sys.statusBarHeight;
wx.WINDOW_HEIGHT = sys.screenHeight - wx.NAV_HEIGHT
wx.STATUS_BAR_HEIGHT = sys.statusBarHeight;
wx.HEADER_HEIGHT = capsule.height + (capsule.top - sys.statusBarHeight) * 2
wx.NAV_HEIGHT = wx.HEADER_HEIGHT + wx.STATUS_BAR_HEIGHT

/* 用于保存 tabbar实例,使用自定义tabbar且需要显示红点时需要用到 */
wx.tabbarInstances = []
/* 保存全局数据(比getApp更快,更易管理) */
wx.globalData = {
  imageUrl: '',
  limitNum: 10, //获取数据条目限制
  shareTitle: {
    home: '这是主页的分享title'
  },
 //...其余可根据需要自定义添加

}


/* 主题管理 用于控制组件即页面的样式表现 如需多主题切换时可用*/
// wx.theme0 = {
//   btnBg: 'linear-gradient(150deg, rgba(245, 117, 94,0.7),rgba(230, 175, 94,0.8))',
//   pageBg: 'linear-gradient(110deg, #e78354, rgb(245, 117, 94))',
//   homeBg: 'linear-gradient(50deg, rgb(245, 117, 94), rgb(255, 193, 136))',//主页匹配背景
//   navBg: 'linear-gradient(110deg, rgb(245, 117, 94), #F5AC6E)',
//   bg: 'linear-gradient(100deg,rgb(245, 117, 94), rgb(255, 185, 124))',
//   color: 'rgb(245, 117, 94)',
//   type: 0,
//   shadow: 'rgb(248, 125, 94)',
//   name: '热情'
// }

wx.theme1 = { 
  btnBg: 'linear-gradient(110deg, rgba(12, 158, 97, 0.6), rgba(9, 143, 132, 0.7));',
  pageBg: 'linear-gradient(45deg, rgba(21, 209, 153,.6), rgba(45, 155, 163,.7))',
  homeBg: 'linear-gradient(20deg,  rgb(13, 172, 111), #3c918a)',
  navBg: 'linear-gradient(110deg,rgb(45, 155, 163), rgb(34, 167, 122))',
  bg: 'linear-gradient(20deg,rgb(23, 194, 108), #45938d)',
  color: '#317e7a',//'16AEC3'
  type: 1,
  shadow: '#5ba891',
  name: '清新'
}

wx.theme = wx.theme1

// wx.theme 对象改变时 更新依赖关系
wx.updateTheme = function (that) {
  that.setData({
    theme: wx.theme
  })
}


/* Alert 提醒 */
wx.showAlert = function (text, title = '提示', cb) {
  wx.showModal({
    title: title,
    content: text,
    showCancel: false,
    confirmText: '我知道了',
    confirmColor: '#576B95',
    success: function (res) {
      if (res.confirm) {
        cb && cb()
      } else if (res.cancel) { }
    }
  })
}

// 获取授权状态
wx.getWXAuth = function (authority) {
  return new Promise((resolve) => {
    wx.getSetting({
      success(res) {
        if (!res.authSetting[`scope.${authority}`]) {
          resolve(false)
        } else {
          resolve(true)
        }
      }
    })
  })
}


//验证当前对象是否是自己
wx.isMine = function (objId) {
  if (!objId) return false

  if (objId == wx.MYID) {
    return true
  } else {
    return false
  }
}

// 跳转首页 
wx.navToHome = function (timeout = 0) {
  setTimeout(() => {
    wx.switchTab({
      url: '/pages/home/index',
      success: (result) => {

      },
    });
  }, timeout);
}


/* 获取formId 需要发送模板消息时可用*/
wx.getFormId = function (e) {
  console.log("携带formId为" + e.detail.formId)

}

/*微信支付
  wx.wePay(10,'会员费').then(res)=>{}
*/
wx.wePay = function (fee, title) {
  return new Promise((resolve, reject) => {
    let data = {
      title: title,
      fee: fee,
      openid: wx.MYID
    }
    wx.ajax('pay/wePay', data).then((res) => {
      console.log(res)
      // orderId = res.out_trade_no,//订单号，如需保存请建表保存。
      wx.requestPayment({
        'timeStamp': res.timeStamp,
        'nonceStr': res.nonceStr,
        'package': res.package,
        'signType': 'MD5',
        'paySign': res.paySign,
        'success': function (res) {
          //付款成功,这里可以写你的业务代码
          resolve(res)
        },
        'fail': function (res) {
          reject(res)
        }
      })
    })
  })
}

/**
 * 封装异步请求
 * wx.ajax(url,{a:1},"GET").then(res)=>{}
 */
wx.ajax = function (url, data = {}, method = "POST") {
  return new Promise((resolve, reject) => {
    var type = 'application/json'
    if (method == "GET") {
      if (data !== {}) {
        var arr = [];
        for (var key in data) {
          arr.push(`${key}=${data[key]}`);
        }
        url += `?${arr.join("&")}`;
      }
      type = 'application/x-www-form-urlencoded'
    }
    wx.request({
      url: 'http://localhost:3000/' + url,
      method,
      data,
      header: {
        'content-type': type  // 默认值application/json对于 POST 方法且 header['content-type'] 为 application/json 的数据，会对数据进行 JSON 序列化// 对于 POST 方法且 header['content-type'] 为 application / x - www - form - urlencoded 的数据， 会将数据转换成 query string
      },
      success: function (res) {
        if (res.statusCode == 200 && res.data) {
          resolve(res.data)
        } else {
          console.log("服务器错误", res)
          reject(res)
        }
      },
      fail: function (res) {
        console.log("发起请求失败:", res)
        wx.showToast({
          title: '网络溜走了~',
          icon: 'none',
          image: '/images/fail.png',
          duration: 1000,
          mask: false,
        });
        reject(res)
      }
    })
  })
}



/* 组件相关 */

/**
 *
 * @param {*} that
 * @param {string|Object} params title
 * @param {string} params.title-。
 * @param {string} params.confirmText-。
 * @param {string} params.cancleText-。
 * @returns
 */
wx._showConfirm = function (that, params) {
  that.data._swiper && that.Owner && (that = that.Owner)
  return new Promise((resolve, reject) => { //主动取消或出错都会调用reject
    that.selectComponent('#confirm').hook.init(params, () => resolve(), () => reject())
  })
}

// 居中选项弹窗
wx._showOptPop = function (that, { el = '#options', title = '', options = [], data = {}, center = false, hide = () => { } } = {}) {
  that.data._swiper && that.Owner && (that = that.Owner)
  that = that.selectComponent(el)
  return new Promise((resolve) => {
    that.setData({
      show: true,
      options,
      data,
      title,
      center
    })
    that.onPopHide = hide;
    that.onTap = (data) => resolve(data);
  })
}

/* 底部操作弹窗 */
wx._showActionSheet = function (that, { el = '#actionSheet', title = '', actions = [] }) {
  that.data._swiper && that.Owner && (that = that.Owner)
  that = that.selectComponent(el)
  return new Promise((resolve, reject) => {
    that.setData({
      show: true,
      actions,
      title
    })
    that.onClose = () => reject();
    that.onTap = (data) => resolve(data);
  })
}


// modal弹窗
wx._showModal = function (that, { el = '#modal', hint = '', cancle = '取消', confirm = '确定', title = '提示', len = '-1', id = '', input = 0, textarea = 0, value = '' } = {}) {
  that.data._swiper && that.Owner && (that = that.Owner)
  that = that.selectComponent(el)
  return new Promise((resolve, reject) => {
    that.setData({
      show: true,
      content: hint,
      cancleText: cancle,
      confirmText: confirm,
      title,
      length: len,
      event_id: id,
      input,
      textarea,
      inputValue: value,
    })
    that.fail = () => reject();
    that.success = (inputValue) => resolve(inputValue);
  })
}

//三点加载中...
wx.dotLoading = function (that, duration = 0, longload = false) {
  that.data._swiper && that.Owner && (that = that.Owner)
  that.selectComponent('#loading').setData({
    show: true,
    longload: longload,
    duration: duration
  })
}
//关闭加载中
wx.dotHide = function (that) {
  that.data._swiper && that.Owner && (that = that.Owner)
  that.selectComponent('#loading').setData({
    show: false,
  })
  that.setData({
    showPubing: false  //同时关闭发布中圆圈...
  })
}

// 显示提醒信息
wx.Toast = function (that, title, err = false) {
  that.data._swiper && that.Owner && (that = that.Owner) //用于组件被swiper使用的情况
  that.selectComponent('#toast').setData({
    show: true,
    text: title,
    err
  })
}

// 显示帮助弹窗
wx.showHelp = function (that, text) {
  that.data._swiper && that.Owner && (that = that.Owner)
  that.selectComponent('#help').setData({
    show: true,
    text: text,
  })
}