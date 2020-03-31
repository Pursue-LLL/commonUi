'use strict';
Component({
  options: {
    multipleSlots: true,
    addGlobalClass: true,
    pureDataPattern: /^_/  //纯数据字段
  },
  properties: {
    customSlot: Boolean,
    title: String,
    noFixed:Boolean,  //默认固定
    /* 背景 */
    _bg: {
      type:String,
      value:wx.theme.navBg
    },
    /* 标题颜色 */
    _black: Boolean, //默认为白色
    noHolder: Boolean, //默认需要占位
    isBack: Boolean ,//默认为自定义事件
    hideBorder: Boolean
  },
  observers: {
    '_black': function (val) {
      this.setData({
        color: val ? 'rgb(66, 66, 66)' : 'white'
      })
    },
    'noFixed': function (val) {
      this.setData({
        bg: val ?'initial': this.data._bg
      })
      console.log('设置背景',this.data.bg);
    },
    '_bg': function (val) {
      //不固定设置背景色
      if(!this.data.noFixed){
        this.setData({
          bg: val
        })
      }
      console.log('设置背景',val);
    },
  },

  data: {
    statusHeight: wx.STATUS_BAR_HEIGHT,
    navHeight: wx.NAV_HEIGHT,
    color: '',
    bg: wx.theme.navBg

  },
  methods: {

    goBack() {
      wx.navigateBack({
        delta: 1
      })

      // if (this.data.isBack) { //属性不为空 返回上一页
      //   let pages = getCurrentPages();
        // console.log(pages)
      //   if (pages.length == 1) { //如果只有一个页面 返回首页
      //     wx.navToHome(0)
      //   } else {
      //     wx.navigateBack({
      //       delta: 1
      //     })
      //   }
      // } else {
      //   this.triggerEvent('Back')
      // }
    },
  },
  attached () {
    let pages = getCurrentPages()
    console.log('初始化导航栏');
    
    // console.log(pages);
    if(pages.length>1){
      this.setData({
        showBack:true
      })

    }
    

  },
  ready() {

  }
});