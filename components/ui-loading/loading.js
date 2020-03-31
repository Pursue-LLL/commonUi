'use strict';

Component({
  options: {
    addGlobalClass: true,
  },
  behaviors: [wx.computedBehavior],
  watch: {
    'show': function (val) {
      var _this = this;
      if (val && this.data.duration != 0) {
        setTimeout(function () {
          _this.setData({
            show: false
          })
        }, _this.data.duration);
      }
    }
  },

  properties: {
    show: {
      type: Boolean,
    },
    duration: {
      type: Number,
      value: 0
    },
    longload: Boolean
  },
  data: {
    ...wx.util.commonData,
  },
  methods: {

  },
  lifetimes: {
    attached() {

    },
    ready() {
      this.setData({
        loadingGif: `http://yun.qyayun.com/2019/07/31/ceb4ccf1401352f480727864f8f77647.gif!${this.data.gifSuffix}`
      })
    }
  }
});