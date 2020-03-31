var app = getApp()

var _StyleHelper = require('../libs/StyleHelper.js');
Component({
  options: {
    addGlobalClass: true,
  },
  externalClasses: ['my-class'],
  properties: {
    customStyle: {
      type: String | Object
    },
    show: {
      type: Boolean,
      value: true
    },

    btnText: String
  },



  data: {
    selfCustomStyle: {}
  },
  methods: {
    getFormId(e) {
      wx.getFormId(e)
    },
    // tap() {
    //   const myEventDetail = {} // detail对象，提供给事件监听函数
    //   const myEventOption = {} // 触发事件的选项
    //   // this.triggerEvent('tap', myEventDetail, myEventOption)
    // },
  },
  //options(Object)
  lifetimes: {
    ready() {
      this.setData({
        selfCustomStyle: _StyleHelper.default.getPlainStyle(this.data.customStyle)
      })
    }
  }

});