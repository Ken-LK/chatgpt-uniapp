"use strict";
const common_vendor = require("../../common/vendor.js");
const stimulateAd = () => "../../components/stimulateAd/stimulateAd.js";
const _sfc_main = {
  components: {
    stimulateAd
  },
  data() {
    return {
      list: [
        // {
        // 	name: '分享给好友',
        // 	id: 'setUp',
        // 	icon: 'paperplane-filled',
        // 	iconBackground: '#3b2021',
        // 	showArrow: false,
        // 	showType: 1,
        // },
        {
          name: "每日任务",
          id: "dailyTask",
          icon: "star",
          textColor: "#333",
          showArrow: true,
          showType: 0
        },
        {
          name: "卡密兑换",
          id: "cardCode",
          icon: "gift",
          textColor: "#333",
          showArrow: true,
          showType: 0
        },
        {
          name: "绘画记录",
          id: "drawRecord",
          icon: "image",
          textColor: "#333",
          showArrow: true,
          showType: 0
        },
        // {
        // 	name: '卡密兑换',
        // 	id: 'exchange',
        // 	icon: 'gift',
        // 	textColor: '#333',
        // 	showArrow: true,
        // 	showType: 0,
        // },
        {
          name: "充值记录",
          id: "recharge",
          icon: "list",
          textColor: "#333",
          showArrow: true,
          showType: 0
        },
        {
          name: "联系我们",
          id: "customerSupportIm",
          icon: "headphones",
          textColor: "#333",
          showArrow: true,
          showType: 0
        },
        {
          name: "设置",
          id: "settings",
          icon: "settings",
          textColor: "#333",
          showArrow: true,
          showType: 0
        },
        {
          name: "清除缓存",
          id: "clearStorage",
          icon: "close",
          textColor: "#333",
          showArrow: true,
          showType: 0
        }
        // {
        // 	name: '联系客服',
        // 	id: 'customerSupport',
        // 	icon: 'headphones',
        // 	iconBackground: '#3b2021',
        // 	showArrow: true,
        // 	showType: 0,
        // }, 
      ],
      nickName: common_vendor.index.getStorageSync(getApp().globalData.nickNameCacheName),
      avatarUrl: common_vendor.index.getStorageSync(getApp().globalData.avatarUrlCacheName),
      dialogValidTime: "",
      dialogValidTimeShow: false,
      dialogCount: "",
      dialogPlusCount: "",
      drawCount: null,
      adDialogTodayCount: 0,
      adDrawTodayCount: 0,
      shareDrawTodayCount: 0,
      dyVideoAd: null,
      platform: getApp().globalData.platform
    };
  },
  onShareAppMessage() {
    const that = this;
    if (this.platform === "mp-toutiao") {
      if (that.shareDrawTodayCount < 2) {
        getApp().globalData.adTypePlay = "stimulateShareAd";
        common_vendor.index.http.addValidTime((res, success) => {
          that.showValidTime();
        });
      }
    } else if (this.platform === "mp-weixin") {
      if (that.shareDrawTodayCount < 2) {
        getApp().globalData.adTypePlay = "stimulateShareAd";
        common_vendor.index.http.addValidTime((res, success) => {
          that.showValidTime();
        });
      }
    }
    const timestamp = (/* @__PURE__ */ new Date()).getTime();
    return {
      title: this.shareText ? this.shareText : "体验AI对话+AI绘画",
      path: "/pages/index/dialog",
      imageUrl: "https://wx.wtianyu.com/ai/static/share/share.jpg?t=" + timestamp
    };
  },
  onShow() {
    console.log("onShow");
    this.nickName = getApp().globalData.isBlank(common_vendor.index.getStorageSync(getApp().globalData.nickNameCacheName)) ? "微信用户" : common_vendor.index.getStorageSync(getApp().globalData.nickNameCacheName);
    this.avatarUrl = getApp().globalData.isBlank(common_vendor.index.getStorageSync(getApp().globalData.avatarUrlCacheName)) ? "../../static/img/default_img.png" : common_vendor.index.getStorageSync(getApp().globalData.avatarUrlCacheName);
    this.showValidTime();
  },
  onLoad() {
    if (this.platform === "mp-toutiao") {
      common_vendor.index.dyAd.createRewardedVideoAd(this);
    }
  },
  methods: {
    cardCodeDialogClose() {
      this.$refs.cardCodeDialog.close();
    },
    cardCodeDialogConfirm(e) {
      console.log("cardCodeDialogConfirm", e);
      const that = this;
      if (e === "") {
        return;
      }
      common_vendor.index.http.cardCodeChange({
        num: e
      }, (res) => {
        console.log("success", res);
        common_vendor.index.showModal({
          content: "兑换成功，您已获得" + res.data.data.textInfo,
          showCancel: false,
          success: function(res2) {
            that.$refs.cardCodeDialog.close();
            that.showValidTime();
          }
        });
      });
    },
    buyVip() {
      common_vendor.index.navigateTo({
        url: "/pages/user/vipBuy"
      });
    },
    imCallback(e) {
      console.log("跳转IM客服成功", e.detail);
    },
    onimError(e) {
      console.log("拉起IM客服失败", e.detail);
    },
    rewardSuccess() {
      const that = this;
      console.log("抖音广告rewardSuccess");
      common_vendor.index.http.addValidTime(() => {
        that.showValidTime();
      });
    },
    rewardFaile() {
      console.log("抖音广告rewardFaile");
    },
    dialogAd() {
      if (this.platform === "mp-toutiao") {
        getApp().globalData.adTypePlay = "stimulateAd";
        common_vendor.index.dyAd.showRewardedVideoAd();
      } else if (this.platform === "mp-weixin") {
        const that = this;
        getApp().globalData.adTypePlay = "stimulateAd";
        this.$refs.stimulateAd.showAd(() => {
          that.showValidTime();
        });
      }
    },
    drawAd() {
      const that = this;
      if (this.platform === "mp-toutiao") {
        getApp().globalData.adTypePlay = "stimulateDrawAd";
        common_vendor.index.dyAd.showRewardedVideoAd();
      } else if (this.platform === "mp-weixin") {
        getApp().globalData.adTypePlay = "stimulateDrawAd";
        this.$refs.stimulateAd.showAd(() => {
          that.showValidTime();
        });
      }
    },
    changeImage() {
      const that = this;
      if (this.platform === "mp-toutiao") {
        tt.getUserProfile({
          success: (resUser) => {
            console.log("tt.getUserProfile success，获取的用户信息：", resUser);
            common_vendor.index.login({
              success(res) {
                const requestData = {
                  token: res.code,
                  "imgUrl": resUser.userInfo.avatarUrl,
                  "name": resUser.userInfo.nickName,
                  appType: getApp().globalData.appType
                };
                common_vendor.index.http.updateNameAndImg(requestData, () => {
                  that.nickName = resUser.userInfo.nickName;
                  that.avatarUrl = resUser.userInfo.avatarUrl;
                });
              }
            });
          },
          fail(err) {
            console.log("tt.getUserProfile failed", err.errMsg);
          },
          complete() {
            console.log("tt.getUserProfile completed");
          }
        });
      } else if (this.platform === "mp-weixin") {
        common_vendor.index.navigateTo({
          url: "/pages/user/wx-login"
        });
      }
    },
    showValidTime() {
      common_vendor.index.http.getUserValidTime((res, success) => {
        if (success) {
          this.drawCount = res.data.data.drawCount;
          this.dialogCount = res.data.data.dialogCount;
          this.dialogPlusCount = res.data.data.dialogPlusCount;
        }
      });
    },
    onClick(item) {
      console.log(item);
      if (item.id === "clearStorage") {
        common_vendor.index.clearStorageSync();
        common_vendor.index.showModal({
          title: "提示",
          content: "缓存已清除，请重新启动小程序",
          showCancel: false
        });
        getApp().login();
      } else if (item.id === "customerSupportIm") {
        common_vendor.index.navigateTo({
          url: "/pages/user/customerSupport"
        });
      } else if (item.id === "drawRecord") {
        common_vendor.index.navigateTo({
          url: "/pages/user/drawTask"
        });
      } else if (item.id === "recharge") {
        common_vendor.index.navigateTo({
          url: "/pages/user/rechargeRecord"
        });
      } else if (item.id === "settings") {
        common_vendor.index.navigateTo({
          url: "/pages/user/setting"
        });
      } else if (item.id === "dailyTask") {
        common_vendor.index.navigateTo({
          url: "/pages/user/dailyTask"
        });
      } else if (item.id === "cardCode") {
        this.$refs.cardCodeDialog.open();
      }
    }
  }
};
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_popup_dialog2 = common_vendor.resolveComponent("uni-popup-dialog");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  (_easycom_uni_icons2 + _easycom_uni_popup_dialog2 + _easycom_uni_popup2)();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_popup_dialog = () => "../../uni_modules/uni-popup/components/uni-popup-dialog/uni-popup-dialog.js";
const _easycom_uni_popup = () => "../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
if (!Math) {
  (_easycom_uni_icons + _easycom_uni_popup_dialog + _easycom_uni_popup)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.avatarUrl,
    b: common_vendor.o((...args) => $options.changeImage && $options.changeImage(...args)),
    c: $data.dialogValidTimeShow
  }, $data.dialogValidTimeShow ? {
    d: common_vendor.t($data.nickName),
    e: common_vendor.t($data.dialogValidTime),
    f: common_vendor.t($data.drawCount)
  } : {
    g: common_vendor.t($data.nickName)
  }, {
    h: $data.platform === "mp-weixin"
  }, $data.platform === "mp-weixin" ? {
    i: common_vendor.o($options.changeImage),
    j: common_vendor.p({
      type: "right",
      size: "22"
    })
  } : {}, {
    k: common_vendor.o((...args) => $options.buyVip && $options.buyVip(...args)),
    l: common_vendor.t($data.dialogCount),
    m: common_vendor.o((...args) => $options.buyVip && $options.buyVip(...args)),
    n: common_vendor.t($data.dialogPlusCount),
    o: common_vendor.o((...args) => $options.buyVip && $options.buyVip(...args)),
    p: common_vendor.t($data.drawCount),
    q: common_vendor.o((...args) => $options.buyVip && $options.buyVip(...args)),
    r: common_vendor.f($data.list, (item, index, i0) => {
      return common_vendor.e({
        a: "70beefa0-1-" + i0,
        b: common_vendor.p({
          type: item.icon,
          size: "24",
          color: "#757575"
        }),
        c: item.showType == 0
      }, item.showType == 0 ? {
        d: common_vendor.t(item.name),
        e: common_vendor.s("color: " + item.textColor)
      } : {}, {
        f: item.showType == 1
      }, item.showType == 1 ? {
        g: common_vendor.t(item.name)
      } : {}, {
        h: item.showType == 2
      }, item.showType == 2 ? {
        i: common_vendor.t(item.name)
      } : {}, {
        j: item.showArrow
      }, item.showArrow ? {
        k: "70beefa0-2-" + i0,
        l: common_vendor.p({
          type: "right",
          size: "22"
        })
      } : {}, {
        m: index,
        n: common_vendor.o(($event) => $options.onClick(item), index)
      });
    }),
    s: common_vendor.sr("inputClose", "70beefa0-4,70beefa0-3"),
    t: common_vendor.o($options.cardCodeDialogConfirm),
    v: common_vendor.o($options.cardCodeDialogClose),
    w: common_vendor.p({
      ["before-close"]: true,
      mode: "input",
      title: "请输入兑换码",
      value: "",
      placeholder: "请输入兑换码"
    }),
    x: common_vendor.sr("cardCodeDialog", "70beefa0-3"),
    y: common_vendor.p({
      type: "dialog"
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/Users/ken/Documents/HBuilderProjects/chatgpt-uniapp/pages/index/my.vue"]]);
_sfc_main.__runtimeHooks = 2;
wx.createPage(MiniProgramPage);
