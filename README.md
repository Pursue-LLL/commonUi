# commonUi
给你漂亮的组件,给你简洁的样式类,给你强大的工具库,不需框架,只用原生让你体验最简单快捷高效的小程序开发
# 前言
commonUi 不是一个框架,它提供给你一个完整的开发思路,是一套组件化模块化开发解决方案,你不需要花费额外的时间和精力去研究一个框架的使用,commonUi给你的无论是组件、样式或是工具库都可以在你现有的小程序项目中拿来即用,只需要了解我提供给你的文件都有什么作用即可,接下来把它复制到你的项目里就可以开发,因此我给你提供的是各具其功能的文件模块,而不是一个小程序项目模板,接下来我会详述每一个模块的作用和用法(目前只说明涉及模块,具体使用如每一个组件的使用方法会后续更新).
# 使用原生小程序开发
## 创建或利用你的现有小程序项目
### 将utils文件夹复制到你的项目
#### **commonUi.wxss**
该文件为基础的全局样式文件.包含常用背景色,flex布局,九宫格布局,内边距,外边距,阴影,分割线等等等  

例如使用类'h-hvc'即可实现水平方向的水平垂直居中效果  

    <view class="h-hvc">文字</view>  
    
或用'mt-s','mr-m','ml-l'等来表示不同大小的外边距效果  
而想实现文本超出部分出现省略号你只需要添加这样一个类'text-overflow'  
使用:app.wxss 引入  
#### **animation.wxss**
该文件包含一些常用的动画效果,旋转缩放展开收缩等等  
例如你的应用里有一个红包的图标你想让他闪烁起来以更引人注意,你只需要添加'am-glimmer'类在你的元素上即可实现  
或者要实现一个喇叭图标的摇动渐隐效果, class="am-rockOpa" 即可
使用:app.wxss 引入  
#### **system.js**
该文件导出一个立即执行函数,将常用变量和api封装起来挂在wx对象上,提供了系统参数如导航栏高度、状态栏高度、机型等常量，封装了网络请求授权验证微信支付以及组件调用等api  
例如使用'wx.IS_IPHONEX'来判断当前机型是否是iphoneX  
或者使用'wx.NAV_HEIGHT' 获取导航栏的高度,并且该高度在iphoneX以上机型也兼容
例如我们要使用commonUi提供的比官方更漂亮更强大的modal组件，    

              wx._showModal(this, {  //this 当前页面实例  
                title: '请您注意',  
                hint: '您选择的图片经检测包含违规内容,如有异议,可点击下方申诉',  
                cancle: '我要申诉',  
                confirm: '我知道了'  
              }).then(() => {  
                console.log('确定');  
              }).catch(() => {  
                console.log('取消');  
              })
              
你是否发现与官方组件的调用方法一样，而且还是promise的方式，而以往你用的组件一定都是在data里初始化你组件所用的数据，然后在wxml中引入组件使用一大堆的‘data-’来传入值，如果一个页面需要使用多个这样的组件，你就要引入多个，使用commonUi，你只需要调用api定制你的组件内容。  
使用:在app.js import './utils/system';  
#### **utils.js**
该文件是一个js工具库,提供了基础的数组,字符串,对象处理函数,以及节流防抖生成唯一id等函数,还有封装了小程序一些方法的函数,选择图片,并发压缩图片,预览图片等等   
例如使用checkImage方法可以并发检测图片违规,所有图片检测完成后返回结果  
使用Array.shuffle函数将数组元素随机洗牌
使用timeAgo函数处理日期时间为几天前几小时前的格式
使用:在app.js import util from './utils/util';  
onLaunch生命周期中 wx.util = util  即可全局使用wx.util调用工具函数  
#### **event-bus.js**
用于实现全局事件(页面间)通讯和状态管理的类  
例如在改变主题页设置了当前主题为黑色,则任何注册并监听了该变化的页面的主题都变为黑色  
使用:在页面引入或app.js引入挂在wx对象上全局使用  
### 组件 将 components 文件夹复制到你的项目
该文件夹包含20+功能强大的ui组件 ,在页面的json文件里注册即可使用,如ui-icon、ui-toast等组件需要全局使用的,需在app.json里注册,
之后在需要的页面wxml里使用,js中像官方组件一样调用即可
## icon组件
icon图标组件,图标使用阿里iconfont  
例 使用一个向右的箭头 颜色#eee 尺寸22  

    <ui-icon type="arrow-right" color="#eee" size="22"><ui-icon>  
    

## confirm组件
![](http://yun.qyayun.com/2020/04/02/9d42a18e40e4475880c520000766557a.PNG)　　
###使用方法：
**wxml**文件　

	<ui-confirm id="confirm"></ui-confirm>

**js**文件
	
	    wx._showConfirm(this, { title: '立即去查看并分享我的主页', cancleText: '稍后' }).then(() => {
    		／／确认操作
        }).catch(() => {
			／／取消操作
		})

## 弹出输入框 (model组件)
![](http://yun.qyayun.com/2020/04/02/342439e340d328ba80f5145e7c420d32.PNG)　　
###使用方法：
**wxml**文件　

	<ui-modal id="modal" bindgo="cb"></ui-modal>

**js**文件
	
        wx._showModal(this, {
          len: 30,
          title: '修改微信号',
          id: 'wechat',
          input: 1	//textarea:1
        })

        wx._showModal(that, {
         title: '请您注意',
         hint: '您选择的图片经检测包含违规内容,如对本次处理有异议,可点击下方申诉',
         cancle: '我要申诉',
         confirm: '我知道了'
        }).then(() => {
           console.log('确定');
        }).catch(() => {
           console.log('取消');
        })

## 滑动移动组件(swipe-out)
![](http://yun.qyayun.com/2020/04/02/08aaa73a40af4da380e9000f461b5013.PNG)　

## 选项弹窗组件
![](http://yun.qyayun.com/2020/04/02/2ffaa8b5403d972b804163e39f66b140.PNG)　

## 弹出pop层
![](http://yun.qyayun.com/2020/04/02/e831fd7440c5d202803388cce4c2fd0a.PNG)　


### 其他功能性模块可根据需要使用 
#### **自定义tabbar**
可随评论滚动方向而显示或隐藏的tabbar,中间可使用图片  
#### **swiper优化模块**
类似新闻一样的信息流可使用  
可控制仅首次切换时加载数据;动态获取swiper高度,可记忆swiper-item滚动距离,实现和app一样的效果  
#### **拖动编辑菜单顺序模块**
使用wxs实现的拖动改变菜单顺序  
#### **高性能的吸顶**
使用节点布局相交状态api替代监听scroll来实现更高性能更简单的吸顶组件  


###注意组件化模块化开发
类似或可复用代码多的使用 Component 构造器构造页面,使用behavior管理通用方法和变量

#常见问题

1.减少setData的频率和数据,多次变更合并提交,上拉加载使用二维数组  

	原理:逻辑层（App Service）和 视图层（View）
	通过系统层的JSBridage来通信的，逻辑层把数据变化通知到视图层，触发视图层页面更新，视图层把触发的事件通知到
	逻辑层进行业务处理。
2.iphoneX兼容性  
3.频繁触发函数的情况使用节流防抖

#### ** 组件部分后续更新...  **

如有问题请添加微信  

![微信](http://yun.qyayun.com/2020/03/30/612cca7b40e1a955809e0a1eb21643a5.jpg)  

