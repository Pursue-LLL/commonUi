"use strict";
/* 导出一个立即执行函数 */
export default (() => {
  const res = wx.getSystemInfoSync();
  let tabbarHeight = 50
  if (res.safeArea && res.safeArea.top > 40) {
    wx.iPhoneX = true
    tabbarHeight = 71 //预留底部安全区域20px
  }

  wx.IS_IOS = /ios/i.test(res.system);
  wx.IS_ANDROID = /android/i.test(res.system);
  wx.WIN_WIDTH = res.screenWidth;
  wx.WIN_HEIGHT = res.screenHeight;
  wx.STATUS_BAR_HEIGHT = res.statusBarHeight;

  wx.CONTENT_HEIGHT = res.screenHeight - res.statusBarHeight;
  const jn = wx.getMenuButtonBoundingClientRect()  //根据胶囊计算导航栏高度
  wx.HEADER_HEIGHT = jn.height + (jn.top - res.statusBarHeight) * 2
  wx.NAV_HEIGHT = wx.HEADER_HEIGHT + wx.STATUS_BAR_HEIGHT
  wx.WINDOW_HEIGHT = res.screenHeight - wx.NAV_HEIGHT

  // console.log(wx.WIN_HEIGHT)
  // console.log(wx.STATUS_BAR_HEIGHT)
  // console.log(wx.HEADER_HEIGHT)
  // console.log(wx.NAV_HEIGHT )
  // console.log(wx.CONTENT_HEIGHT)
  // console.log(wx.WINDOW_HEIGHT)
  wx.tabbarInstances = [] //tabbar实例
  // 全局数据
  wx.globalData = {
    imageUrl: '',
    showRedDot: false, //tabbar页面onShow时是否显示红点
    limitNum: 10, //获取数据条目限制
    shareTitle: {
      home: ''
    },
    topPrice: 0.1,
    broadcastPrice: 0.1,
    imgCompress: '/compress/true/quality/80/format/webp', //上传图片时直接带后缀(一张大图不带)
    jubaoOpts: ['发布违法、时政敏感类内容',
      '色情低俗、血腥暴恐类内容',
      '攀比拜金等传播负能量内容',
      '标题/封面党、刷屏、重复等无意义内容',
      '攻击侮辱诅咒谩骂行为',
      '引战、键盘侠、带节奏行为',
      '造谣、传播发布垃圾广告和虚假信息行为',]

  }

  // wx.toRPX = function(px){
  //   return (px * (1334 / res.windowHeight))
  // }


  // 主题管理
  wx.theme0 = { //热情
    btnBg: 'linear-gradient(150deg, rgba(245, 117, 94,0.7),rgba(230, 175, 94,0.8))',
    pageBg: 'linear-gradient(110deg, #e78354, rgb(245, 117, 94))',
    homeBg: 'linear-gradient(50deg, rgb(245, 117, 94), rgb(255, 193, 136))',//主页匹配背景
    navBg: 'linear-gradient(110deg, rgb(245, 117, 94), #F5AC6E)',
    bg: 'linear-gradient(100deg,rgb(245, 117, 94), rgb(255, 185, 124))',
    color: 'rgb(245, 117, 94)',
    type: 0,
    shadow: 'rgb(248, 125, 94)',
    name: '热情'
  }

  wx.theme1 = {  //清新
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


  /**
   *
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

  // 检测个人信息是否完整
  wx.detectInfo = function (that) {
    if (wx.hasInfo) return true
    if (wx.MY) {
      if (wx.MY.avatar && wx.MY.nickName && wx.MY.school) {
        wx.hasInfo = true
        return true
      } else {
        wx.showAlert('有必要的信息还没有填写哦~,请到个人信息页补充')
      }
    } else {  //是否需要异步
      //  getApp().getMyData = res => {
      //    if (wx.MY.avatar && wx.MY.nickName && wx.MY.school) {
      //      wx.hasInfo = true
      //      return true
      //    }
      //   }
    }
  }


  //验证当前对象是否是自己
  wx.isMine = function (objId) {
    if (!objId) return false

    if (objId == wx.MYID) {
      console.log("当前对象是自己")
      return true
    } else {
      console.log(wx.MYID);
      console.log("当前对象不是自己")
      return false
    }
  }

  // 跳转首页  注意顺序改变后的索引值 onShow
  wx.navToHome = function (timeout = 0) {
    setTimeout(() => {
      wx.switchTab({
        url: '/pages/home/index',
        success: (result) => {

        },
      });
    }, timeout);
  }

  // 跳转到墙
  wx.navToWall = function (timeout = 0) {
    setTimeout(() => {
      wx.switchTab({
        url: '/pages/wall/index',
        success: (result) => {

        },
      });
    }, timeout);
  }

  // 判断是否显示红点
  // wx.showRedDot = function () {
  //   var app = getApp()
  //   console.log("app.globalData.showRedDot" + app.globalData.showRedDot)
  //   if (app.globalData.showRedDot) {
  //     wx.showTabBarRedDot({
  //       index: 2,
  //     })
  //   }
  // }




  // 附加额外必要信息,避免返回数据冗余 --用户信息更新时要批量更新帖子评论等
  //所有发布的情况注意考虑加上
  /*       author: {
      objectId: wx.MYID
    },
    to_author: wx.get_author(wx.MY),
     */

  wx.get_author = function ({ _id, avatar, school, nickName, info: { sex } }) {
    return { _id, avatar, school, sex, nickName }
  }


  wx.getFormId = function (e) {
    // var data = {
    //   openid: app.globalData.openId,
    //   formid: e.detail.formId
    // }
    console.log("携带formId为" + e.detail.formId)
    // app.ajaxPost('Zjzl-TempletMsg-saveFormID', data, function (res) {
    //   console.log(res)
    // })
  }

  /**封装微信支付 */
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
})();



