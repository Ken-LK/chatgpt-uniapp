"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      drawCount: "",
      dialogCount: "",
      dialogPlusCount: "",
      user: null
    };
  },
  created() {
    console.log("showVipInfo");
    this.showUserCount();
  },
  methods: {
    showUserCount() {
      common_vendor.index.http.getUserValidTime((res, success) => {
        if (success) {
          this.drawCount = res.data.data.drawCount;
          this.dialogCount = res.data.data.dialogCount;
          this.dialogPlusCount = res.data.data.dialogPlusCount;
          this.user = res.data.data;
          this.$parent.sendParentUser(this.user);
        }
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.t($data.dialogCount),
    b: common_vendor.t($data.dialogPlusCount),
    c: common_vendor.t($data.drawCount)
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/Users/ken/Documents/HBuilderProjects/chatgpt-uniapp/components/showVipInfo/showVipInfo.vue"]]);
wx.createComponent(Component);
