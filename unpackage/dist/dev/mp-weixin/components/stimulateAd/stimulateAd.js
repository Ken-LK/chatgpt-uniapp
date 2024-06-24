"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  name: "stimulate-ad",
  data() {
    return {
      isLoading: false,
      successBack: null
    };
  },
  onReady() {
    this.isLoading = true;
    this.$refs.adRewardedVideo.load();
  },
  methods: {
    showAd(callBack) {
      this.successBack = callBack;
      if (this.isLoading) {
        return;
      }
      console.log("adRewardedVideo", this.$refs.adRewardedVideo);
      this.$refs.adRewardedVideo.show();
    },
    onadload(e) {
      this.isLoading = false;
      console.log("广告数据加载成功");
    },
    onadclose(e) {
      const detail = e.detail;
      const that = this;
      if (detail && detail.isEnded) {
        console.log("onClose " + detail.isEnded);
        common_vendor.index.http.addValidTime((res, success) => {
          if (success) {
            that.successBack();
          }
        });
      } else {
        console.log("onClose " + detail.isEnded);
      }
    },
    onaderror(e) {
      console.log(e.detail);
      this.isLoading = false;
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {};
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/Users/ken/Documents/HBuilderProjects/chatgpt-uniapp/components/stimulateAd/stimulateAd.vue"]]);
wx.createComponent(Component);
