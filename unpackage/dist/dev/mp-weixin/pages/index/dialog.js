"use strict";
const common_vendor = require("../../common/vendor.js");
const chatInput = () => "../../components/chatinput.js";
const messageShow = () => "../../components/messageshow.js";
var result = "";
let interstitialAd = null;
const _sfc_main = {
  data() {
    return {
      style: {
        pageHeight: 0,
        contentViewHeight: 0,
        footViewHeight: 90,
        mitemHeight: 0,
        windowWidth: 0
      },
      scrollTop: 0,
      messages: [],
      isLoading: false,
      isShowLoading: false,
      //模拟队列做屏幕自动下滑
      queueCount: 0,
      queueTimer: null,
      noticeMessage: "",
      currentMode: null,
      currentMax: 1,
      showAnimation: true,
      showTopGuide: false,
      barTitle: "对话",
      selectDatas: [{
        index: 0,
        name: "3.5基础模型",
        model: "base"
      }, {
        index: 1,
        name: "4.0plus模型",
        model: "plus"
      }],
      showModelSelect: false
    };
  },
  components: {
    chatInput,
    messageShow
  },
  beforeCreate: function() {
    console.log("beforeCreate");
  },
  onShareAppMessage() {
    return {
      title: "超强AI4.0来袭，免费体验",
      path: "/pages/index/dialog",
      imageUrl: "https://wx.wtianyu.com/ai/static/share/share.jpg"
    };
  },
  onShow() {
    const inputValue = getApp().globalData.produceInfo;
    console.log("onShow");
    if (inputValue !== null) {
      this.$refs.chatInput.setInputValue(inputValue);
    }
    getApp().globalData.produceInfo = null;
    if (getApp().globalData.platform === "mp-toutiao") {
      common_vendor.index.websocket.initSocket(1);
      common_vendor.index.websocket.createSocket(1, this.webSocketReceive);
    }
    if (common_vendor.index.isShowLoading) {
      common_vendor.index.hideLoading();
      common_vendor.index.isShowLoading = false;
    }
    this.$nextTick(() => {
      if (this.$refs.messageShow != void 0) {
        this.$refs.messageShow.forEach((child) => {
          child.updateUi();
        });
      }
      this.$refs.chatInput.updateUi();
    });
    this.currentMode = getApp().globalData.isBlank(common_vendor.index.getStorageSync(getApp().globalData.modeNameCacheName)) ? {
      index: 0,
      name: "3.5基础模型",
      mode: "base"
    } : common_vendor.index.getStorageSync(getApp().globalData.modeNameCacheName);
    this.barTitle = "对话(" + this.currentMode.name + ")";
    if (!this.isLoading) {
      this.currentMax = this.messages.length;
      this.forceScrollBottom();
    }
  },
  onReady: function() {
    console.log("onReady");
    const that = this;
    this.queueTimer = setInterval(() => {
      if (that.queueCount > 0) {
        that.queueCount--;
        console.log(that.queueCount);
        that.scrollToBottom();
      }
    }, 500);
    common_vendor.wx$1.checkIsAddedToMyMiniProgram({
      success: (res) => {
        that.showTopGuide = !res.added;
        console.log("checkIsAddedToMyMiniProgram_success", res);
      }
    });
  },
  onLoad: function() {
    console.log("onLoad");
    const that = this;
    common_vendor.index.notice.mainNotice((msg) => {
      console.log("msg", msg);
      that.noticeMessage = msg;
    });
    const res = common_vendor.index.getSystemInfoSync();
    this.style.pageHeight = res.windowHeight;
    this.style.contentViewHeight = getApp().globalData.platform === "mp-weixin" ? res.windowHeight - res.windowTop - res.statusBarHeight - 116 : res.screenHeight / 1.4;
    this.style.windowWidth = res.screenWidth;
    const resSt = common_vendor.index.getStorageSync(getApp().globalData.messageQueueName);
    if (resSt) {
      this.messages = resSt;
    } else {
      this.messages.push({
        user: "home",
        type: "head",
        content: "我是小月，你的专属智能助手，有什么能帮助您的吗"
      });
    }
    this.queueCount = this.queueCount++;
    if (common_vendor.wx$1.createInterstitialAd) {
      interstitialAd = common_vendor.wx$1.createInterstitialAd({
        adUnitId: "adunit-ee4a586a235c8e84"
      });
      interstitialAd.onLoad(() => {
      });
      interstitialAd.onError((err) => {
      });
      interstitialAd.onClose(() => {
      });
    }
    setTimeout(() => {
      if (interstitialAd) {
        console.log("显示插屏广告");
        interstitialAd.show().catch((err) => {
          console.error(err);
        });
      }
    }, 100);
  },
  methods: {
    selectModel: function(modelInfo) {
      this.currentMode = modelInfo;
      this.barTitle = "对话(" + this.currentMode.name + ")";
      common_vendor.index.setStorageSync(getApp().globalData.modeNameCacheName, modelInfo);
      this.showModelSelect = false;
    },
    barLeftClick: function(e) {
      console.log("barLeftClick点击了");
      this.showModelSelect = !this.showModelSelect;
    },
    forceScrollBottom: function() {
      this.showAnimation = false;
      this.scrollTop = this.scrollTop - 10;
      this.scrollToBottom();
    },
    changeShowTopGuide: function() {
      this.showTopGuide = false;
    },
    saveCache: function() {
      const that = this;
      setTimeout(() => {
        common_vendor.index.setStorage({
          key: getApp().globalData.messageQueueName,
          data: that.messages.length > 20 ? that.messages.slice(that.messages.length - 20, that.messages.length) : that.messages
        });
      }, 500);
    },
    getInputMessage: function(message) {
      if (this.isLoading) {
        this.showStopDialog();
        return;
      }
      this.showAnimation = true;
      result = "";
      this.addMessage("customer", message.content, false);
      this.addMessage("home", "", false, false, true);
      this.queueCount++;
      this.toRobot(message.content);
    },
    addMessage: function(user, content, hasSub, subcontent, loading) {
      var that = this;
      const msgData = {
        user,
        content,
        hasSub,
        subcontent,
        loading
      };
      that.messages.push(msgData);
    },
    arrayBufferToString: function(arr) {
      if (typeof arr === "string") {
        return arr;
      }
      var dataview = new DataView(arr.data);
      var ints = new Uint8Array(arr.data.byteLength);
      for (var i = 0; i < ints.length; i++) {
        ints[i] = dataview.getUint8(i);
      }
      arr = ints;
      var str = "", _arr = arr;
      for (var i = 0; i < _arr.length; i++) {
        var one = _arr[i].toString(2), v = one.match(/^1+?(?=0)/);
        if (v && one.length == 8) {
          var bytesLength = v[0].length;
          var store = _arr[i].toString(2).slice(7 - bytesLength);
          for (var st = 1; st < bytesLength; st++) {
            store += _arr[st + i].toString(2).slice(2);
          }
          str += String.fromCharCode(parseInt(store, 2));
          i += bytesLength - 1;
        } else {
          str += String.fromCharCode(_arr[i]);
        }
      }
      return str;
    },
    calculateMitemHeight: function(callBack) {
      const promises = [];
      const that = this;
      let totalHeight = that.style.mitemHeight || 0;
      if (this.$refs.messageShow === void 0)
        return;
      this.$refs.messageShow.forEach((child) => {
        const promise = new Promise((resolve, reject) => {
          child.getDomByClass(".m-item_flag").boundingClientRect().exec(function(rect) {
            resolve(rect[0].height);
          });
        });
        promises.push(promise);
      });
      Promise.all(promises).then((heights) => {
        heights.forEach((height) => {
          totalHeight += height + 20;
        });
        that.style.mitemHeight = totalHeight;
        console.log(that.style.mitemHeight);
        callBack();
      }).catch((error) => {
        console.log(error);
      });
    },
    scrollToBottom: function() {
      const that = this;
      that.style.mitemHeight = 0;
      if (getApp().globalData.platform === "mp-toutiao") {
        let query = tt.createSelectorQuery();
        query.selectAll(".m-item_flag").boundingClientRect();
        query.exec((res) => {
          res[0].forEach((item) => {
            that.style.mitemHeight += item.height + 20;
          });
          if (that.style.mitemHeight > that.style.contentViewHeight) {
            that.scrollTop = that.style.mitemHeight - that.style.contentViewHeight + 40;
          }
        });
      } else if (getApp().globalData.platform === "mp-weixin") {
        this.calculateMitemHeight(() => {
          that.scrollTop = that.style.mitemHeight;
        });
      }
    },
    showStopDialog: function() {
      common_vendor.index.showModal({
        title: "提示",
        content: "您的问题还在回复中",
        showCancel: false,
        success: function(res) {
        }
      });
    },
    wxRobatRequest: function(question) {
      const that = this;
      that.isLoading = true;
      this.isShowLoading = true;
      if (getApp().globalData.platform === "mp-weixin") {
        const requestData = {
          "prompt": question,
          "network": false,
          "system": "",
          "withoutContext": false,
          "stream": true,
          "rolePlay": false
        };
        common_vendor.index.http.streamWx(
          this,
          requestData,
          (sucess) => {
            console.log("request success", sucess);
          },
          (fail) => {
            console.log("request fail", fail);
            if (fail.errMsg != "request:fail abort") {
              result += "服务器网络异常，请重试";
              let msg = that.messages.pop();
              if (msg.user === "customer") {
                that.messages.push(msg);
              }
              that.addMessage("home", result, true);
              this.queueCount++;
            }
          },
          (complete) => {
            console.log("request complete", complete);
            that.isLoading = false;
            that.saveCache();
            this.queueCount++;
          },
          (onHeadersReceivedCallBack) => {
            console.log("onHeadersReceived", onHeadersReceivedCallBack);
          },
          (onChunkReceivedCallBack) => {
            if (!getApp().globalData.isDevTools()) {
              let requestData2 = that.arrayBufferToString(onChunkReceivedCallBack);
              if (requestData2.indexOf("WTALL:") > -1) {
                requestData2 = requestData2.substring(6, requestData2.length);
              }
              console.log("onChunkReceived", requestData2);
              result += requestData2;
              let msg = that.messages.pop();
              if (msg.user === "customer") {
                that.messages.push(msg);
              }
              that.addMessage("home", result, true);
              this.queueCount++;
            } else {
              let requestData2 = "i am test answer";
              result += requestData2;
              let msg = that.messages.pop();
              if (msg.user === "customer") {
                that.messages.push(msg);
              }
              that.addMessage("home", result, true);
              this.queueCount++;
            }
          }
        );
      } else if (getApp().globalData.platform === "mp-toutiao") {
        if (!getApp().globalData.isDevTools()) {
          let req = {
            type: "1",
            content: question,
            security: true,
            appType: getApp().globalData.appType,
            "rolePlay": false
          };
          common_vendor.index.websocket.sendMessage(
            1,
            JSON.stringify(req),
            that.webSocketReceive,
            () => {
              setTimeout(() => {
                if (that.isShowLoading) {
                  common_vendor.index.hideLoading();
                  that.isShowLoading = false;
                  that.isLoading = false;
                }
              }, 5e3);
            },
            () => {
              if (this.isShowLoading) {
                common_vendor.index.hideLoading();
                this.isShowLoading = false;
              }
              this.isLoading = false;
              common_vendor.index.showToast({
                title: "网络异常，请稍后重试",
                icon: "error",
                position: "top",
                duration: 2e3
              });
            }
          );
        } else {
          common_vendor.index.hideLoading();
          let requestData = "i am test answer";
          that.isLoading = false;
          result += requestData;
          let msg = that.messages.pop();
          if (msg.user === "customer") {
            that.messages.push(msg);
          }
          that.addMessage("home", result, true);
          this.queueCount++;
        }
      }
    },
    webSocketReceive: function(receiveMsg) {
      const that = this;
      if (this.isShowLoading) {
        common_vendor.index.hideLoading();
        this.isShowLoading = false;
        this.isLoading = false;
      }
      let requestData = receiveMsg.data;
      if (requestData.indexOf("WTALL:") > -1) {
        requestData = requestData.substring(6, requestData.length);
      }
      if (requestData === "WTALL_END") {
        that.isLoading = false;
        that.saveCache();
        this.queueCount++;
        return;
      }
      result += requestData;
      let msg = that.messages.pop();
      if (msg.user === "customer") {
        that.messages.push(msg);
      }
      that.addMessage("home", result, true);
      this.queueCount++;
    },
    toRobot: function(info) {
      const that = this;
      common_vendor.index.getSystemInfo({
        success: function(res) {
          if (res.uniPlatform === "web") {
            that.addMessage("home", info + "_response", false);
            that.saveCache();
            this.queueCount++;
          } else if (res.uniPlatform !== "mp-weixin1") {
            that.wxRobatRequest(info);
          }
        }
      });
    }
  }
};
if (!Array) {
  const _easycom_uni_nav_bar2 = common_vendor.resolveComponent("uni-nav-bar");
  const _easycom_my_js_select2 = common_vendor.resolveComponent("my-js-select");
  const _component_message_show = common_vendor.resolveComponent("message-show");
  const _component_chat_input = common_vendor.resolveComponent("chat-input");
  const _easycom_uni_notice_bar2 = common_vendor.resolveComponent("uni-notice-bar");
  (_easycom_uni_nav_bar2 + _easycom_my_js_select2 + _component_message_show + _component_chat_input + _easycom_uni_notice_bar2)();
}
const _easycom_uni_nav_bar = () => "../../uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.js";
const _easycom_my_js_select = () => "../../components/my-js-select/my-js-select.js";
const _easycom_uni_notice_bar = () => "../../uni_modules/uni-notice-bar/components/uni-notice-bar/uni-notice-bar.js";
if (!Math) {
  (_easycom_uni_nav_bar + _easycom_my_js_select + _easycom_uni_notice_bar)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o($options.barLeftClick),
    b: common_vendor.p({
      border: false,
      leftText: "模型",
      ["left-icon"]: "arrowdown",
      color: "#ffffff",
      ["background-color"]: "#4fbbbf",
      shadow: true,
      height: "180rpx",
      title: $data.barTitle
    }),
    c: common_vendor.o($options.selectModel),
    d: common_vendor.p({
      selectDatas: $data.selectDatas,
      showHidden: $data.showModelSelect
    }),
    e: common_vendor.f($data.messages, (message, index, i0) => {
      return {
        a: common_vendor.sr("messageShow", "6314b988-2-" + i0, {
          "f": 1
        }),
        b: index,
        c: index,
        d: "6314b988-2-" + i0,
        e: common_vendor.p({
          message,
          id: index,
          currentMax: $data.currentMax
        })
      };
    }),
    f: $data.style.contentViewHeight + "px",
    g: $data.showAnimation,
    h: $data.scrollTop,
    i: common_vendor.sr("chatInput", "6314b988-3"),
    j: common_vendor.o($options.getInputMessage),
    k: $data.style.windowWidth + "px",
    l: $data.noticeMessage != ""
  }, $data.noticeMessage != "" ? {
    m: common_vendor.p({
      ["show-close"]: true,
      ["show-icon"]: true,
      text: $data.noticeMessage
    })
  } : {}, {
    n: $data.showTopGuide
  }, $data.showTopGuide ? {
    o: common_vendor.o((...args) => $options.changeShowTopGuide && $options.changeShowTopGuide(...args))
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/Users/ken/Documents/HBuilderProjects/chatgpt-uniapp/pages/index/dialog.vue"]]);
_sfc_main.__runtimeHooks = 2;
wx.createPage(MiniProgramPage);
