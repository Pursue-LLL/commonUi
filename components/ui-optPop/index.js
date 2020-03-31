'use strict';

Component({
  behaviors: [],
  options: {
    addGlobalClass: true,
  },
  properties: {
    show: Boolean,
    /* 可选预设options 或传入数组 (需要动态更改内容的情况)*/
    options: {
      type: [Array, String]
    },
    title: String,
    /* 其他参数 */
    data: Object,
    center:Boolean,


  },
  data: {

  },

  methods: {
    getFormId(e) {
      wx.getFormId(e)
    },
    popHide() {
      this.onPopHide()
    },
    canle() {
      this.setData({
        show: false
      })
    },
    optTap(e) {
      let idx = e.currentTarget.dataset.idx
      let name = e.currentTarget.id
      this.onTap({ idx, name, data: this.data.data })
      this.setData({
        show: false
      })
      if (this.data.options == 'jubaoOpts') {
        this.toJubao({ idx, name, data: this.data.data })
      }
    },

    /* 举报相关逻辑在此定义 */
    toJubao(e) {

      console.log('去举报');

    },

  }
});