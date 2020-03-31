'use strict';
Component({
  behaviors: [wx.computedBehavior],
  watch: {
    'show': function (val) {
      var that = this;
      if (val) {
        setTimeout(() => {
          that.setData({
            placeholder: '请输入内容'
          })
        }, 500);
      } else {
        that.setData({
          placeholder: ' '
        })
      }
    },
  },
  options: {
    addGlobalClass: true,
  },

  properties: {
    show: Boolean,
    title: {
      value: '提示',
      type: String
    },
    length: {
      value: -1,
      type: Number
    },
    input: {
      type: [Number, Boolean]
    },
    textarea: {
      type: [Number, Boolean]
    },
    content: String,
    inputValue: String,
    cancleText: {
      type: String,
      value: '取消'
    },
    confirmText: {
      type: String,
      value: '确定'
    },
    event_id: String

  },
  data: {
    // ...wx.util.commonData,
    padding: wx.IS_ANDROID ? ' 18rpx 20rpx' : ''
  },
  ready: function ready() {

  },

  methods: {
    inputMonitor(e) {
      // console.log(e);
      this.setData({
        inputValue: e.detail.value
      })

    },

    verifyInput() {
      if (!this.data.input || (this.data.input && this.data.inputValue)) {
        return true
      }
    },
    verifyTextarea() {
      if (!this.data.textarea || (this.data.textarea && this.data.inputValue)) {
        return true
      }
    },

    // 取消
    hideModal() {
      this.setData({
        inputValue: '',
        show: false
      })
      this.fail()
      this.triggerEvent('cancle')
    },

    // 确定  可以使用回调 也可触发事件(适合多个事件进行同一种操作的情况)
    go() {
      if (this.verifyInput() && this.verifyTextarea()) {
        this.success(this.data.inputValue)
        this.triggerEvent('go', { value: this.data.inputValue, id: this.data.event_id })
        this.setData({
          show: false,
          inputValue: '',
        })
      } else {
        wx.Toast(this, '您提交的是空内容哦~')
      }
    },


  },

});