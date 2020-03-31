'use strict';

Component({
  options: {
    addGlobalClass: true,
  },

  properties: {
    show: {
      type: Boolean,
    },
    title: {
      type: String
    },
    cancleText: {
      type: String,
      value: '取消'
    },
    confirmText: {
      type: String,
      value: '确定'
    }
  },
  data: {
    theme: wx.theme,
  },

  methods: {
    cancle() {
      this.setData({
        show: false
      })
      this.hook.cb(false)
    },

    confirm() {
      this.setData({
        show: false
      })
      // this.triggerEvent('go')
      this.hook.cb(true)

    },

  },

  lifetimes: {
    created() {
      var that = this;
      // 处理钩子的对象
      this.hook = (function () {
        return {
          init: function (params, success, fail) {
            if (Object.prototype.toString.call(params) === '[object Object]') {
              var { title, cancleText, confirmText } = params
            } else {
              var title = params
            }
            this.success = success
            this.fail = fail
            that.setData({
              show: true,
              title,
              cancleText: cancleText || that.data.cancleText,
              confirmText: confirmText || that.data.confirmText
            })
          },
          cb: function (status) {
            status ? this.success() : this.fail()
          },
        }
      }())

    },

  },
});