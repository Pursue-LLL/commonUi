'use strict';

var _StyleHelper = require('../libs/StyleHelper.js');
var _WxHelper = require('../libs/WxHelper.js');
var _MultiHelper = require('../libs/MultiHelper.js');

var ChildPath = '../ui-tab/index';

Component({
  relations: _WxHelper.default.getChildRelation(ChildPath), //关联子节点
  behaviors: [],
  options: {
    addGlobalClass: true,
    pureDataPattern: /^_/
  },
  properties: {
    index: {
      type: Number | String,
      value: 0,
      observer(index) {
        this.handleIndexChange(index, true);
      }
    },
    probe: {
      type: Number | String,
      value: 0
    },
    width: {
      type: Number | String,
      value: wx.WIN_WIDTH
    },
    height: {
      type: Number,
      value: 90
    },
    autoWidth: {  //不是自动宽度就居中
      type: Boolean,
      value: true
    },
    inkBar: {
      type: Boolean
    },
    inkBarStyle: {
      type: String | Object
    },
    tabStyle: {
      type: Object | String
    },
    activeTabStyle: {
      type: Object | String
    },
    fixed: {  //默认固定
      type: Boolean,
      value: true
    },
    // noHolder:Boolean

  },
  data: {
    isInit: false,
    scrollTop: 0,
    scrollLeft: 0,
    _children: [],
    rect: {},
    outerChange: false,
    walkDistance: 0,
    walkCount: 0,
    selfStyle: '',
    selfInkBarStyle: '',
    inkBarWrapperStyle: ''
  },
  ready() {

    this._init();
  },

  methods: {
    _init() {
      this._initRect();
      this._initChildren();
      this._initChildActive();
      //多余  可以优化等有时间
      this._initSelfStyle();

      if (this.data.inkBar) {
        this._initSelfInkBarStyle();
      }
    },
    _initChildren() {
      var children = this.getRelationNodes(ChildPath);
      
      this.setData({
        _children: children
      });
    },
    _initChildActive() {
      // 将index项设置为active
      this.data._children[this.data.index].setData({
        active: true
      });
    },
    _initRect() {
      var _this = this;

      _WxHelper.default.getComponentRect(this, '.ui-tabs').then(function (rect) {
        _this.setData({
          rect: rect
        });
      });
    },
    _initSelfStyle() {
      this.setData({
        selfStyle: _StyleHelper.default.getPlainStyle({
          width: this.data.width
        })
      });
    },
    _initSelfInkBarStyle() {
      this.setData({
        selfInkBarStyle: _StyleHelper.default.getPlainStyle(this.data.inkBarStyle)
      });
    },
    handleIndexChange(index, outerChange) {
      _MultiHelper.default.updateChildActive(this, index);
      var probe = this.data.probe;
      if (probe === 0 || probe === 1 && !outerChange) {
        this.triggerEvent('change', { index: index });
      }

      this.setData({
        index: index
      });

      this._setTabStyle();

      // 初始化完成时再执行_autoCenterTab，否则WxHelper.getComponentRect可能会报错
      if (this.data.isInit) {
        this._autoCenterTab();
      }

      if (this.data.inkBar) {
        this._setInkBarWrapperStyle();
      }
    },
    _setTabStyle() {
      var _data = this.data,
        children = _data._children,
        index = _data.index,
        tabStyle = _data.tabStyle,
        activeTabStyle = _data.activeTabStyle,
        autoWidth = _data.autoWidth;


      var style = _StyleHelper.default.getPlainStyle(tabStyle);
      var activeStyle = _StyleHelper.default.getMergedPlainStyles([tabStyle, activeTabStyle]);

      children.forEach(function (child, index) {
        var renderStyle = index === index ? activeStyle : style;

        if (autoWidth) {
          renderStyle += ';width: ' + child.data.width + 'px';
        }

        child.setData({
          selfStyle: renderStyle
        });
      });
    },
    _autoCenterTab() {
      var _this2 = this;

      var child = this.data._children[this.data.index];
      _WxHelper.default.getScrollViewRect(this, '.ui-tabs').then(function (scrollRect) {
        _WxHelper.default.getComponentRect(child, '.ui-tab').then(function (rect) {
          var diff = rect.left - (_this2.data.rect.width - child.data.width) / 2;
          _this2.setData({
            scrollLeft: diff + scrollRect.scrollLeft
          });
        });
      });
    },
    _setInkBarWrapperStyle() {
      var _data2 = this.data,
        children = _data2._children,
        rect = _data2.rect;

      var left = 0;
      var width = 0;

      for (var i = 0; i < children.length; i++) {
        if (children[i].data.active) {
          width = children[i].data.width;
          break;
        } else {
          left += children[i].data.width;
        }
      }

      this.setData({
        inkBarWrapperStyle: _StyleHelper.default.getPlainStyle({
          top: rect.height - 2,
          left: left,
          width: width
        })
      });
    },
    _increaseWalkDistance(rect) {
      var _this3 = this;

      this.data.walkDistance += rect.width;
      this.data.walkCount++;

      // 最后一个tab初始化完成时
      if (this.data.walkCount === this.data._children.length) {
        var _data3 = this.data,
          walkDistance = _data3.walkDistance,
          walkCount = _data3.walkCount,
          _rect = _data3.rect,
          tabStyle = _data3.tabStyle,
          activeTabStyle = _data3.activeTabStyle,
          children = _data3._children,
          index = _data3.index;


        var resetTabHandle = null;

        var fixedStyle = {};

        var width = null;

        // 当walkDistance < 容器宽度时，tab项的样式需要重设
        if (walkDistance < _rect.width && this.data.autoWidth) {
          width = _rect.width / walkCount;
          fixedStyle = { width: width };
        }

        var style = _StyleHelper.default.getMergedPlainStyles([tabStyle, fixedStyle]);
        var activeStyle = _StyleHelper.default.getMergedPlainStyles([tabStyle, activeTabStyle, fixedStyle]);

        this.setData({
          isInit: true
        });

        this._autoCenterTab();

        resetTabHandle = function resetTabHandle() {
          children.forEach(function (child, index) {
            child.setData({
              selfStyle: index === index ? activeStyle : style
            });

            if (width) {
              child.setData({
                width: width
              });
            }
          });
        };

        setTimeout(function () {
          if (resetTabHandle) {
            resetTabHandle();
          }

          if (_this3.data.inkBar) {
            _this3._setInkBarWrapperStyle();
          }
        });
      }
    }
  }
});