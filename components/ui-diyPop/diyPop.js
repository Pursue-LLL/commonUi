
Component({
  properties: {
    show: {
      type: Boolean,
      value: true
    },
    btnText:String,
    title:String,
    height:{
      type:String,
      value:'88%'
    },
    position: {
      type: String,
      value: 'right'
    },
  },
  options: {
    addGlobalClass: true,
  },

  data: {
    theme: wx.theme,
    images: wx.globalData.images,
  },
  methods: {
    closePop() {
      this.triggerEvent('exit')
    },
    tapBtn(){
      this.triggerEvent('confirm')
    }
  },
  //options(Object)
  lifetimes: {
    ready() {

    }
  }

});