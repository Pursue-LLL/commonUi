'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _SystemHelper = require('../../libs/SystemHelper.js');

var _SystemHelper2 = _interopRequireDefault(_SystemHelper);

var _StyleHelper = require('../../libs/StyleHelper.js');

var _StyleHelper2 = _interopRequireDefault(_StyleHelper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = Component({
  behaviors: [wx.computedBehavior],
  externalClasses: ['my-class'],
  watch: {
    'show': function (val) {
      if (val) {
        this.setData({
          selfShow: true
        });
      } else {
        if (this.data.hideDelay) {
          setTimeout(function () {
            _this.setData({
              selfShow: false
            });
          }, this.data.hideDelay);
        } else {
          this.setData({
            selfShow: false
          });
        }
      }
    },
  },
  properties: {
    customStyle: {
      type: String | Object
    },
    show: {
      type: Boolean,
    },
    top: {
      type: Number | String,
      value: 0
    },
    effect: { //scale-in scale-out
      type: String,
      value:'scale-in'
    },
    hideDelay: {
      type: Number
    },
    hideOnTap: {
      type: Boolean,
      value: true
    },
    blur: { //dark
      type: String,
      value:'dark'
    }
  },
  
  ready() {
    var selfCustomStyle = _StyleHelper2.default.getMergedPlainStyles([{ top: this.data.top }, this.data.customStyle]);
    var blurClass = '';
    if (this.data.blur) {
      var _platform = _SystemHelper2.default.isIos() ? 'ios' : 'android';
      blurClass = 'blur-' + this.data.blur + '-' + _platform;
    }
    this.setData({
      selfCustomStyle: selfCustomStyle,
      blurClass: blurClass
    });
  },

  data: {
    selfShow: false,
    isInTimeout: false,
    blurClass: ''
  },
  methods: {
    handleMaskTap() {
      if (this.data.hideOnTap) {
        this.setData({
          show: false
        });
        this.triggerEvent('hide')
      }
    },
    /* 避免在swiper内可以上下滑动 */
    touchmove(){
      return
    }
  }
});