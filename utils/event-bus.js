
'use strict';

var EventTypeEnum = {
  NORMAL_EVENT:1,
  ONCE_EVENT:2
};

/**
 * 创建唯一id
 */
function createUid() {
  return (Math.random()).toString().substr(2);
}

//构造函数
function EventBus() {
  //储存事件的容器
  this.events = [];
}
/**
 * on 新增事件监听
 * @param name 事件名
 * @param callback 回调函数
 * @returns { string } eventId 事件ID，用户取消该事件监听
 */
EventBus.prototype.on = function (name, callback) {
  return this.addEvent(name, EventTypeEnum.NORMAL_EVENT, callback);
};
/**
 * one 只允许添加一次事件监听
 * @param name 事件名
 * @param callback 回调函数
 * @returns { string } eventId 事件ID，用户取消该事件监听
 */
EventBus.prototype.once = function (name, callback) {
  return this.addEvent(name, EventTypeEnum.ONCE_EVENT, callback);
};
/**
 * remove 移除事件监听
 * @param name 事件名
 * @param eventId 移除单个事件监听需传入
 * @returns { EventBus } EventBus EventBus 实例
 */
EventBus.prototype.remove = function (name, eventId) {
  var events = this.events;
  for (var i = 0; i < events.length; i++) {
    if (events[i].name === name) {
      // 移除具体的操作函数
      if (eventId && events[i].executes.length > 0) {
        var eventIndex = events[i].executes.findIndex(function (item) { return item.id === eventId; });
        if (eventIndex !== -1) {
          events[i].executes.splice(eventIndex, 1);
        }
      }
      else {
        events.splice(i, 1);
      }
      return this;
    }
  }
  return this;
};
/**
 * emit 派发事件
 * @param name 事件名
 * @param args 其余参数
 * @returns { EventBus } EventBus EventBus 实例
 */
EventBus.prototype.emit = function (name) {
  var that = this;
  var args = [];
  for (var _i = 1, len = arguments.length; _i < len; _i++) {
    args[_i - 1] = arguments[_i];
  }
  var events = this.events;
  var _loop_1 = function (i) {
    if (name === events[i].name) {
      var funcs_1 = events[i].executes;
      funcs_1.forEach(function (item, i) {
        item.callback.apply(item, args);
        if (item.eventType === EventTypeEnum.ONCE_EVENT) {
          funcs_1.splice(i, 1);
        }
      });
      return { value: that };
    }
  };

  for (var i = 0; i < events.length; i++) {
    var state_1 = _loop_1(i);
    if (typeof state_1 === "object")
      return state_1.value;
  }
  return this;
};
/**
 * 查找事件的方法
 * @param name
 */
EventBus.prototype.find = function (name) {
  var events = this.events;
  for (var i = 0; i < events.length; i++) {
    if (name === events[i].name) {
      return events[i];
    }
  }
  return null;
};
/**
 * 添加事件的方法
 * @param name
 * @param callback
 */
EventBus.prototype.addEvent = function (name, eventType, callback) {
  var eventId = createUid();
  var events = this.events;
  var event = this.find(name);
  if (event !== null) {
    event.executes.push({ //事件队列
      id: eventId,
      eventType: eventType,
      callback: callback
    });
    console.log('添加同名事件监听', events);
    return eventId;
  }
  events.push({
    name: name,
    executes: [
      {
        id: eventId,
        eventType: eventType,
        callback: callback
      }
    ]
  });
  console.log('添加事件监听', events);
  return eventId;
};

function createInstance() {
  var bus = new EventBus();
  // @ts-ignore
  return bus;
}
var bus = createInstance();
bus.create = function create() {
  return createInstance();
};

module.exports = bus;  //直接返回实例化后的对象 ,全局只有一个

/*
(1) 如果是第一次调用，那么就加载,执行脚本;
(2) 每个代码模块由module.exports 导出的对象;
(3) 每次require的时候，都返回module.exports;
(4) 如果不是第一次执行，那么直接返回module.exports;
 */

