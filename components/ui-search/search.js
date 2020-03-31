Component({
  properties: {
    value: String
  },
  options: {
    addGlobalClass: true,
  },

  data: {},
  methods: {
    clear() {
      this.setData({
        value: ''
      })
    },

    searchMonitor(e) {
      let val = e.detail.value
      this.setData({
        value: val
      })
      val == '' && this.triggerEvent('clear')
    },

    clickSearch(e) {
      this.triggerEvent('search', { value: this.data.value })
    },
  },

  lifetimes: {

  }

});