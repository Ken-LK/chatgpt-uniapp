"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
const common_js_http = require("./common/js/http.js");
const common_js_draw = require("./common/js/draw.js");
const common_js_dyAd = require("./common/js/dyAd.js");
const common_js_imageDraw = require("./common/js/imageDraw.js");
const common_js_websocket = require("./common/js/websocket.js");
const common_js_wxPay = require("./common/js/wxPay.js");
const common_js_notice = require("./common/js/notice.js");
const common_js_audio = require("./common/js/audio.js");
if (!Math) {
  "./pages/index/dialog.js";
  "./pages/user/dailyTask.js";
  "./pages/index/my.js";
  "./pages/user/vipBuy.js";
  "./pages/user/drawTask.js";
  "./pages/user/wx-login.js";
  "./pages/index/produce.js";
  "./pages/user/customerSupport.js";
  "./pages/index/draw.js";
  "./pages/user/drawTaskItem.js";
  "./pages/user/roleDialog.js";
  "./pages/user/rechargeRecord.js";
  "./pages/user/setting.js";
}
const platform = common_vendor.index.getSystemInfoSync().uniPlatform;
console.log("platform", platform);
const _sfc_main = {
  globalData: {
    isDev: false,
    platform,
    // url: "http://192.168.1.8:8099/wtall/",
    url: "https://cy2.wtianyu.com/wtall/",
    // webSocketUrl: "ws://192.168.1.3:8099/wtall/",
    // webSocketUrl: "wss://cy2.wtianyu.com/wtall/",
    webSocketUrl: "wss://cy2.wtianyu.com/wtall/",
    // 小程序的appId -生产
    appId: platform === "mp-weixin" ? common_vendor.index.getAccountInfoSync().miniProgram.appId : platform === "mp-toutiao" ? "tt13d565688ce9cbfa01" : "",
    // 小程序的appId -沙盒
    // appId: platform === 'mp-weixin' ? uni.getAccountInfoSync().miniProgram.appId : (platform === 'mp-toutiao' ?
    // 	'tt5dcb2b76c2f7701101' : ''),
    appType: platform === "mp-weixin" ? "WXXCX" : platform === "mp-toutiao" ? "DYXCX" : "",
    //消息队列的缓存名称
    messageQueueName: "messages_list_real_leiyunbaihuo",
    // openIdCacheName
    openIdCacheName: "openId",
    // avatarUrlCacheName
    avatarUrlCacheName: "avatarUrl",
    // nickNameCacheName
    nickNameCacheName: "nickName",
    // modeNameCacheName
    modeNameCacheName: "modeName",
    //temperatureNameCacheName
    temperatureNameCacheName: "temperature",
    // audioSwitchName
    audioSwitchName: "audioSwitch",
    audioSexName: "audioSex",
    //创作页跳转到会话页的参数
    produceInfo: null,
    //绘画详情也进行重画操作
    reDrawTask: null,
    //播放广告获取奖励类型
    adTypePlay: null,
    isBlank: function(data) {
      return data == null || data == "null" || data == "" || data == "undefined";
    },
    isNotBlank: function(data) {
      return !this.isBlank(data);
    },
    // 判断是否在开发者工具中
    isDevTools: function() {
      if (this.isDev || this.globalData != null && this.globalData.isDev) {
        return true;
      }
      const systemInfo = common_vendor.index.getSystemInfoSync();
      return systemInfo.platform === "devtools";
    }
  },
  onLaunch: function() {
    console.log("App Launch");
    common_vendor.index.showLoading({
      title: "数据正在初始化"
    });
    common_vendor.index.isShowLoading = true;
    common_vendor.index.http = common_js_http.http;
    common_vendor.index.draw = common_js_draw.draw;
    common_vendor.index.dyAd = common_js_dyAd.dyAd;
    common_vendor.index.imageDraw = common_js_imageDraw.imageDraw;
    common_vendor.index.websocket = common_js_websocket.websocket;
    common_vendor.index.notice = common_js_notice.notice;
    common_vendor.index.wxPay = common_js_wxPay.wxPay;
    common_vendor.index.audio = common_js_audio.audio;
    common_vendor.index.audioContextMap = /* @__PURE__ */ new Map();
    common_vendor.index.recorderManager = common_vendor.index.getRecorderManager();
    common_vendor.index.recorderManager.onFrameRecorded((res) => {
      console.log("recorderManager.onFrameRecorded", res);
    });
    this.login();
    let that = this;
    common_vendor.index.addInterceptor("navigateTo", {
      //监听跳转
      success(e) {
        that.watchRouter();
      }
    });
    common_vendor.index.addInterceptor("redirectTo", {
      //监听关闭本页面跳转
      success(e) {
        that.watchRouter();
      }
    });
    common_vendor.index.addInterceptor("switchTab", {
      //监听tabBar跳转
      success(e) {
        that.watchRouter();
      }
    });
    common_vendor.index.addInterceptor("navigateBack", {
      //监听返回
      success(e) {
        that.watchRouter();
      }
    });
    this.getNewSystems();
  },
  onShow: function() {
  },
  onHide: function() {
    console.log("App Hide");
  },
  methods: {
    watchRouter() {
      this.login();
    },
    login: function() {
      const that = this;
      console.log("check_login");
      if (that.globalData.isNotBlank(common_vendor.index.getStorageSync(that.globalData.openIdCacheName)) && that.globalData.isNotBlank(common_vendor.index.getStorageSync(that.globalData.avatarUrlCacheName)) && that.globalData.isNotBlank(common_vendor.index.getStorageSync(that.globalData.nickNameCacheName))) {
        return;
      }
      console.log("用户登陆");
      var appId = that.globalData.appId;
      common_vendor.index.login({
        success(res1) {
          if (res1.code) {
            console.log("uni.login", res1);
            that.sendLoginTokenToServer(res1.code, appId);
          } else {
            common_vendor.index.showModal({
              title: "提示",
              content: "用户组件创建失败，请确认网络正常后重试！",
              confirmText: "确认",
              success: function(res2) {
                if (res2.confirm) {
                  that.sendLoginTokenToServer(res1.code, appId);
                } else if (res2.cancel) {
                  console.log("用户点击了取消");
                }
              }
            });
          }
        }
      });
    },
    sendLoginTokenToServer: function(code, appId) {
      const that = this;
      const requestData = {
        token: code,
        appType: that.globalData.appType
      };
      common_vendor.index.http.userLogin(requestData, (success) => {
        console.log("login_req_success", success);
        common_vendor.index.setStorageSync(that.globalData.openIdCacheName, success.data.data.openId);
        common_vendor.index.setStorageSync(that.globalData.avatarUrlCacheName, success.data.data.imgUrl);
        common_vendor.index.setStorageSync(that.globalData.nickNameCacheName, success.data.data.name);
      }, (fail) => {
        console.log("login_req_fail", fail);
        setTimeout(function() {
          that.login();
        }, 2e3);
      });
    },
    //检测小程序更新
    getNewSystems() {
      if (common_vendor.wx$1.canIUse("getUpdateManager")) {
        const updateManager = common_vendor.wx$1.getUpdateManager();
        updateManager.onCheckForUpdate(function(res) {
          console.log(res);
          if (res.hasUpdate) {
            updateManager.onUpdateReady(function() {
              common_vendor.wx$1.showModal({
                title: "更新提示",
                content: "新版本已经准备好，是否重启当前应用？",
                showCancel: false,
                success(res2) {
                  if (res2.confirm) {
                    updateManager.applyUpdate();
                  }
                }
              });
            });
            updateManager.onUpdateFailed(function() {
              common_vendor.wx$1.showModal({
                title: "发现新版本",
                content: "新版本更新失败，请稍后重试"
              });
            });
          }
        });
      } else {
        common_vendor.wx$1.showModal({
          title: "更新提示",
          content: "当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。"
        });
      }
    }
  }
};
const App = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "/Users/ken/Documents/HBuilderProjects/chatgpt-uniapp/App.vue"]]);
function createApp() {
  const app = common_vendor.createSSRApp(App);
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
