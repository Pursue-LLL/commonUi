'use strict';

var _WxHelper = require('../libs/WxHelper.js');
var _MultiHelper = require('../libs/MultiHelper.js');

var ParentPath = '../ui-tabs/index';

Component({
  relations: _WxHelper.default.getParentRelation(ParentPath), //关联父节点
  data: {
    selfStyle: '',
    index: 0,
    active: false,
    width: 60,
    height: 45,
    isParentInkBar: false
  },
  ready: function ready() {
    this._init();
  },

  methods: {
    _init() {
      var _this = this;

      var parent = this.getRelationNodes(ParentPath)[0];
      this.parent = parent
      // 别的情况之后在考虑
      // let width = parent.data.autoWidth ? rect.width : Number(parent.data.width) / parent.data.children.length  //用于tabborder

      _this.setData({
        isParentInkBar: parent.data.inkBar,
        width: Number(parent.data.width) / parent.data._children.length,
        height: parent.data.height,
        // tabWidth: Number(parent.data.width) / parent.data.children.length,  //自动宽度
        index: _MultiHelper.default.getChildIndex(parent, _this)
      });

      _WxHelper.default.getComponentRect(this, '.ui-tab').then(function (rect) {
        parent._increaseWalkDistance(rect);
      });
    },

    handleTap() {
      this.parent.handleIndexChange(this.data.index, false);
    }
  }
});