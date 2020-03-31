'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _StyleHelper = require('../../libs/StyleHelper.js');

var _StyleHelper2 = _interopRequireDefault(_StyleHelper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Component({
  behaviors: [wx.computedBehavior],
  watch: {
    'show': function (val) {
      var _this = this;
      var eventName = val ? 'show' : 'hide';
      this.triggerEvent(eventName);

      if (!this.data.isInit) {
        setTimeout(function () {
          _this.triggerEvent('init');
        }, 300);

        this.setData({
          isInit: true
        });
      }
    },
  },
  properties: {
    show: {
      type: Boolean,
    },
    width: {
      type: Number | String
    },
    height: {
      type: Number | String
    },
    top: {
      type: Number | String,
      value: 0
    },
    showMask: {
      type: Boolean,
      value: true
    },
    maskStyle: {
      type: Object | String
    },
    hideOnBlur: {
      type: Boolean,
      value: true
    },
    position: {
      type: String,
      value: 'center'
    },
    maxHeight: String,
    background: {
      type: String
    },
    // cropout: {
    //   type: Boolean
    // },
    radius: Boolean

  },
  data: {
    isInit: false,
    popTop: '' //更改过
  },
  ready() {
    //减1px避免漏出黑线
    this.setData({
      popTop: parseInt(this.data.top) - 2 + "rpx"//提取字符串中的位于开头的数字部分
    })
    var selfContentStyle = _StyleHelper2.default.getPlainStyle({
      // top: this.data.top,
      height: this.data.height,
      width: this.data.width,
      background: this.data.background,
    });

    // var selfStyle = '';
    // var selfContentStyle = '';

    // if (this.data.cropout) {
    //   selfStyle = style;
    // } else {
    //   selfContentStyle = style;
    // }

    this.setData({
      // selfStyle: selfStyle,
      selfContentStyle: selfContentStyle,
      selfMaskStyle: _StyleHelper2.default.getPlainStyle(this.data.maskStyle)
    });
  },

  methods: {
    //监听滑动手势 避免滚动穿透
    // catchtouchmove="handleTouchMove"
    handleTouchMove(e) {},
    handleMaskTap(e) {
      if (this.data.hideOnBlur) {
        this.setData({
          show: false
        });
      }
    }
  }
});