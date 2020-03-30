'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _StringHelper = require('../../libs/StringHelper.js');

var _StringHelper2 = _interopRequireDefault(_StringHelper);

var _StyleHelper = require('../../libs/StyleHelper.js');

var _StyleHelper2 = _interopRequireDefault(_StyleHelper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getText = function (text, maxlength) {
  var length = text.toString().length;
  if (length > maxlength) {
    if (_StringHelper2.default.isNumber(text)) {
      return Math.pow(10, maxlength) - 1;
    } else {
      return text.substring(0, maxlength);
    }
  }
  return text;
};

exports.default = Component({
  behaviors: [],
  properties: {
    text: {
      type: String | Number,
      value: '',
      observer() {
        this.setText();
      }
    },
    maxlength: {
      type: String | Number,
      value: 2
    },
    customStyle: {
      type: String | Object
    }
  },
  data: {
    selfText: ''
  },
  ready() {
    this.setText();
  },

  methods: {
    setText() {
      var _data = this.data,
        text = _data.text,
        maxlength = _data.maxlength,
        customStyle = _data.customStyle;

      var isSingleNumber = false;
      var isNumberOverLength = false;
      var isStringOverLength = false;

      if (_StringHelper2.default.isNumber(text)) {
        let len = text.toString().length
        if (len === 1) {
          isSingleNumber = true;
        }

        isNumberOverLength = maxlength < len;
      } else {
        isStringOverLength = maxlength < text.length;
      }
      var selfText = getText(text, maxlength);

      this.setData({
        isSingleNumber,
        isNumberOverLength,
        isStringOverLength,
        selfText,
        selfCustomStyle: _StyleHelper2.default.getPlainStyle(customStyle)
      });
    }
  }
});