"use strict";
const common_vendor = require("../../common/vendor.js");
let rewardedVideoAd = null;
const _sfc_main = {
  data() {
    return {
      drawCount: "",
      dialogCount: "",
      dialogPlusCount: "",
      //今日分享次数
      shareTodayCount: "",
      //今日签到次数
      signInTodayCount: "",
      //看广告获取plus对话次数
      plusAdTodayCount: "",
      dailyTaskArray: [
        // {
        // 	countId: 1,
        // 	icon: 'checkbox',
        // 	title1_0: '签到(今日',
        // 	title1_1: '/1次)',
        // 	title2: '20基础对话/次',
        // 	btnName: '签到',
        // 	showSystem: false,
        // },
        {
          countId: 2,
          icon: "paperplane",
          title1_0: "分享到群聊(今日",
          title1_1: "/3次)",
          title2: "1绘画/次",
          btnName: "去转发",
          showSystem: true
        },
        {
          countId: 3,
          icon: "paperplane",
          title1_0: "获取plus对话(今日",
          title1_1: "/3次)",
          title2: "1plus对话/次",
          btnName: "看广告",
          showSystem: false
        }
      ]
    };
  },
  created() {
    this.showUserCount();
  },
  onLoad() {
    const that = this;
    if (common_vendor.wx$1.createRewardedVideoAd) {
      rewardedVideoAd = common_vendor.wx$1.createRewardedVideoAd({
        adUnitId: "adunit-86379ddd9364d117"
      });
      rewardedVideoAd.onLoad(() => {
        console.log("onLoad event emit");
      });
      rewardedVideoAd.onError((err) => {
        console.log("onError event emit", err);
      });
      rewardedVideoAd.onClose((res) => {
        console.log("onClose event emit", res);
        if (res && res.isEnded) {
          getApp().globalData.adTypePlay = "plusStimulateAd";
          common_vendor.index.http.addValidTime((res2, success) => {
            that.$refs.showVipInfoChild.showUserCount();
          });
        }
      });
    }
  },
  computed: {
    arrayTaskComputed() {
      return (t10, t11, count) => t10 + count + t11;
    },
    countIdComputed() {
      return (countId) => {
        switch (countId) {
          case 1:
            return this.signInTodayCount;
          case 2:
            return this.shareTodayCount;
          case 3:
            return this.plusAdTodayCount;
        }
      };
    }
  },
  onShareAppMessage() {
    const that = this;
    if (getApp().globalData.platform === "mp-toutiao") {
      if (that.shareTodayCount < 3) {
        getApp().globalData.adTypePlay = "stimulateShareAd";
        common_vendor.index.http.addValidTime((res, success) => {
          that.$refs.showVipInfoChild.showUserCount();
        });
      } else {
        common_vendor.index.showModal({
          content: "分享次数已达上限",
          showCancel: false
        });
      }
    } else if (getApp().globalData.platform === "mp-weixin") {
      if (that.shareTodayCount < 3) {
        getApp().globalData.adTypePlay = "stimulateShareAd";
        common_vendor.index.http.addValidTime((res, success) => {
          that.$refs.showVipInfoChild.showUserCount();
        });
      } else {
        common_vendor.index.showModal({
          content: "分享次数已达上限",
          showCancel: false
        });
      }
    }
    (/* @__PURE__ */ new Date()).getTime();
    return {
      title: "超强AI4.0来袭，免费体验",
      path: "/pages/index/dialog",
      imageUrl: "https://wx.wtianyu.com/ai/static/share/share.jpg"
    };
  },
  methods: {
    clickTaskBtn(task) {
      console.log("clickTaskBtn", task);
      const that = this;
      if (task.countId === 1) {
        if (that.signInTodayCount < 1) {
          getApp().globalData.adTypePlay = "signIn";
          common_vendor.index.http.addValidTime((res, success) => {
            that.$refs.showVipInfoChild.showUserCount();
          });
        } else {
          common_vendor.index.showModal({
            content: "您今天已经签到了",
            showCancel: false
          });
        }
      } else if (task.countId === 3) {
        if (rewardedVideoAd) {
          rewardedVideoAd.show();
        }
      }
    },
    showUserCount() {
      common_vendor.index.http.getUserValidTime((res, success) => {
        if (success) {
          this.drawCount = res.data.data.drawCount;
          this.dialogCount = res.data.data.dialogCount;
          this.dialogPlusCount = res.data.data.dialogPlusCount;
          this.plusAdTodayCount = res.data.data.plusAdTodayCount;
        }
      });
    },
    sendParentUser(user) {
      console.log("sendParentUser", user);
      this.shareTodayCount = user.shareDrawTodayCount;
      this.signInTodayCount = user.signInTodayCount;
      this.plusAdTodayCount = user.plusAdTodayCount;
    }
  }
};
if (!Array) {
  const _easycom_showVipInfo2 = common_vendor.resolveComponent("showVipInfo");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  (_easycom_showVipInfo2 + _easycom_uni_icons2)();
}
const _easycom_showVipInfo = () => "../../components/showVipInfo/showVipInfo.js";
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  (_easycom_showVipInfo + _easycom_uni_icons)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.sr("showVipInfoChild", "6ec4a9d1-0"),
    b: common_vendor.f($data.dailyTaskArray, (item, index, i0) => {
      return common_vendor.e({
        a: "6ec4a9d1-1-" + i0,
        b: common_vendor.p({
          type: item.icon,
          size: "24",
          color: "#757575"
        }),
        c: common_vendor.t($options.arrayTaskComputed(item.title1_0, item.title1_1, $options.countIdComputed(item.countId))),
        d: common_vendor.t(item.title2),
        e: item.showSystem
      }, item.showSystem ? {
        f: common_vendor.t(item.btnName)
      } : {}, {
        g: !item.showSystem
      }, !item.showSystem ? {
        h: common_vendor.t(item.btnName),
        i: common_vendor.o(($event) => $options.clickTaskBtn(item), index)
      } : {}, {
        j: index
      });
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/Users/ken/Documents/HBuilderProjects/chatgpt-uniapp/pages/user/dailyTask.vue"]]);
_sfc_main.__runtimeHooks = 2;
wx.createPage(MiniProgramPage);
