Component({
  options: {
    addGlobalClass: true,
  },
  properties: {
    show: {
      type: Boolean,
      observer: function observer(val) {
        var _this = this;
        if (val){
          var timer = setTimeout(function () {
            _this.setData({
              hide: true
            })
            // console.log('开始渐隐')
            clearTimeout(timer)
          }, 1500);
          let timer1 = setTimeout(() => {
            _this.setData({
              show: false,
              hide:false
            })
            // console.log('开始删除')
            clearTimeout(timer1)
          }, 2500);
        }

      }
    },
    text: String,
  },
  data: {
    X: wx.iPhoneX,
    theme: wx.theme,
    bg0:wx.theme0.shadow,
    bg1:wx.theme1.color,
    err:false
  },
});