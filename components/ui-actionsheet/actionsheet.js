"use strict";

Component({
  options: {
    multipleSlots: true,
    addGlobalClass: true
  },
  properties: {
    title: {
      type: String,
      value: ''
    },
    showCancel: {
      type: Boolean,
      value: true
    },
    cancelText: {
      type: String,
      value: '取消'
    },
    maskClass: {
      type: String,
      value: ''
    },
    extClass: {
      type: String,
      value: ''
    },
    maskClosable: {
      type: Boolean,
      value: true
    },
    mask: {
      type: Boolean,
      value: true
    },
    show: {
      type: Boolean,
      value: false
    },
    actions: {
      type: Array,
      value: [],
      observer: '_groupChange'
    }
  },
  methods: {
    _groupChange(e) {
      if (e.length > 0 && typeof e[0] !== 'string' && !(e[0] instanceof Array)) {
        this.setData({
          actions: [this.data.actions]
        });
      }
    },
    buttonTap(e) {
      var _e$currentTarget$data = e.currentTarget.dataset,
        value = _e$currentTarget$data.value,
        groupindex = _e$currentTarget$data.groupindex,
        index = _e$currentTarget$data.index;

      // this.triggerEvent('actiontap', { value: value, groupindex: groupindex, index: index });
      this.onTap({ value, groupindex, index })
      this.setData({
        show:false
      })
    },
    closeActionSheet(e) {
      var type = e.currentTarget.dataset.type;
      if (this.data.maskClosable || type) {
        this.setData({
          show: false
        });
        // this.triggerEvent('close');
        this.onClose()
      }
    }
  }
});