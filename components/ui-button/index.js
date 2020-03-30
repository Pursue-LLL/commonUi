'use strict';

exports.default = Component({
  behaviors: [],
  options: {
    addGlobalClass: true,
  },
  externalClasses: ['my-class'],
  properties: {
    round: Boolean,
    border: Boolean,
    shadow: Boolean,
    size: {
      value: 'btn-s',
      type: String
    }

  },
  data: {
    theme:wx.theme,
  },
  ready() {

  },

  methods: {
    getFormId(e) {
      wx.getFormId()
    },
    click() {
      this.triggerEvent('click')
    },




  }
});