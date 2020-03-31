
Component({
  properties: {
    show:Boolean,
    text:String
  },
  options: {
    addGlobalClass: true,
  },

  data: {
    ...wx.util.commonData,
  },
  methods: {
    popHide() {
      this.setData({
        show:false
      })

    },
  },
  //options(Object)
  lifetimes: {
    ready() {

    }
  }

});