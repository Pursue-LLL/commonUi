var app = getApp()
Component({
  properties: {
    show: Boolean,
    posters: Array,
    hide: {
      type: Boolean,
    },
  },
  data: {
    showPosterPop: false,
    currentSwiper: 2,
  },
  methods: {
    popHide() {
      const myEventDetail = {} // detail对象，提供给事件监听函数
      const myEventOption = {} // 触发事件的选项
      this.triggerEvent('hide', myEventDetail, myEventOption)
      this.setData({
        show: false
      })
    },

    closePoster() {
      this.setData({
        showPosterPop: false
      })
    },

    openPoster() {
      this.setData({
        showPosterPop: true
      })
      if (!this.data.hide) {
        wx.showLoading({
          title: '正在加载海报...',
        })
      }
    },

    //图片载入完毕
    imgDone(e) {
      console.log("加载玩海报")
      wx.hideLoading()
    },

    swiperChange(e) {
      let current = e.detail.current
      // let id = e.detail.currentItemId
      console.log(e)
      this.setData({
        currentSwiper: current
      })
    },

    // 保存图片到本地
    saveImg() {
      var that = this;
      wx.downloadFile({
        url: that.data.posters[that.data.currentSwiper], // 仅为示例，并非真实的资源
        success(res) {
          console.log(res)
          // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
          if (res.statusCode === 200) {
            wx.saveImageToPhotosAlbum({
              filePath: res.tempFilePath,
              success(res) {
                wx.showToast({
                  title: '已成功保存到相册,快去分享吧~',
                  icon: 'none',
                  duration: 2500,
                  mask: false,
                });
              },
              fail(res) {
                wx.dotHide(that)
                wx.showAlert('保存失败! 请至「右上角」 - 「关于」 - 「右上角」 - 「设置」中进行授权后再继续操作哦~')
              }
            })
          }
        }
      })
    },

  },
  //options(Object)
  lifetimes: {
    ready() {
      this.data.posters
    }
  }

});