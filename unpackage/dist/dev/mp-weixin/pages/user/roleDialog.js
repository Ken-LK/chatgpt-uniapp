"use strict";
const common_vendor = require("../../common/vendor.js");
const chatInput = () => "../../components/chatinput-role.js";
const messageShow = () => "../../components/messageshow-role.js";
var requestTaskG = null;
var result = "";
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
      info: null,
      currentMode: null,
      currentMax: 1,
      showAnimation: true
    };
  },
  components: {
    chatInput,
    messageShow
  },
  beforeCreate: function() {
    console.log("beforeCreate");
  },
  onReady() {
    console.log("onReady");
  },
  onShow() {
    console.log("onShow");
    if (getApp().globalData.platform === "mp-toutiao") {
      common_vendor.index.websocket.initSocket(2);
      common_vendor.index.websocket.createSocket(2, this.webSocketReceive);
    }
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
        that.scrollToBottom();
      }
    }, 500);
  },
  onLoad: function(option) {
    console.log("onLoad");
    const res = common_vendor.index.getSystemInfoSync();
    this.info = JSON.parse(option.info);
    console.log(res);
    this.style.pageHeight = res.windowHeight;
    this.style.contentViewHeight = getApp().globalData.platform === "mp-weixin" ? res.windowHeight - res.windowTop - res.statusBarHeight - 44 : res.screenHeight / 1.4;
    this.style.windowWidth = res.screenWidth;
    const resSt = common_vendor.index.getStorageSync(getApp().globalData.messageQueueName + "_" + this.info.id);
    if (resSt) {
      this.messages = resSt;
    }
    if (this.messages.length === 0) {
      this.addMessage("home", this.info.contentH, false);
    }
    this.queueCount++;
    this.currentMode = getApp().globalData.isBlank(common_vendor.index.getStorageSync(getApp().globalData.modeNameCacheName)) ? {
      index: 0,
      name: "3.5基础模型",
      mode: "base"
    } : common_vendor.index.getStorageSync(getApp().globalData.modeNameCacheName);
    common_vendor.index.setNavigationBarTitle({
      title: this.info.title + "(" + this.currentMode.name + ")"
    });
    common_vendor.index.setNavigationBarColor({
      backgroundColor: "#4fbbbf",
      frontColor: "#ffffff",
      animation: {
        duration: 400,
        timingFunc: "easeIn"
      }
    });
  },
  methods: {
    forceScrollBottom: function() {
      this.showAnimation = false;
      this.scrollTop = this.scrollTop - 10;
      this.scrollToBottom();
    },
    saveCache: function() {
      const that = this;
      setTimeout(() => {
        common_vendor.index.setStorage({
          key: getApp().globalData.messageQueueName + "_" + this.info.id,
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
        imgUrl: that.info.imgHUrl,
        loading,
        infoId: that.info.id
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
        content: "您的问题还在回复中，是否需要停止回复",
        confirmText: "停止",
        success: function(res) {
          if (res.confirm) {
            requestTaskG.abort();
          } else if (res.cancel) {
            console.log("用户点击了取消");
          }
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
          rolePlay: true,
          infoId: that.info.id
        };
        requestTaskG = common_vendor.index.http.streamWx(
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
            rolePlay: true,
            infoId: that.info.id
          };
          common_vendor.index.websocket.sendMessage(
            2,
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
  const _component_message_show = common_vendor.resolveComponent("message-show");
  const _component_chat_input = common_vendor.resolveComponent("chat-input");
  const _easycom_uni_notice_bar2 = common_vendor.resolveComponent("uni-notice-bar");
  (_component_message_show + _component_chat_input + _easycom_uni_notice_bar2)();
}
const _easycom_uni_notice_bar = () => "../../uni_modules/uni-notice-bar/components/uni-notice-bar/uni-notice-bar.js";
if (!Math) {
  _easycom_uni_notice_bar();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.f($data.messages, (message, index, i0) => {
      return {
        a: common_vendor.sr("messageShow", "01e2f95b-0-" + i0, {
          "f": 1
        }),
        b: index,
        c: index,
        d: "01e2f95b-0-" + i0,
        e: common_vendor.p({
          message,
          id: index,
          currentMax: $data.currentMax
        })
      };
    }),
    b: $data.style.contentViewHeight + "px",
    c: $data.showAnimation,
    d: $data.scrollTop,
    e: common_vendor.sr("chatInput", "01e2f95b-1"),
    f: common_vendor.o($options.getInputMessage),
    g: $data.style.windowWidth + "px",
    h: $data.noticeMessage != ""
  }, $data.noticeMessage != "" ? {
    i: common_vendor.p({
      ["show-close"]: true,
      ["show-icon"]: true,
      text: $data.noticeMessage
    })
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/Users/ken/Documents/HBuilderProjects/chatgpt-uniapp/pages/user/roleDialog.vue"]]);
wx.createPage(MiniProgramPage);
