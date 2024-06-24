"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {};
  },
  props: ["play", "getVoiceData"],
  methods: {
    upx2px(upx) {
      return common_vendor.index.upx2px(upx) + "px";
    }
  }
};
if (!Array) {
  const _easycom_loading_dots2 = common_vendor.resolveComponent("loading-dots");
  _easycom_loading_dots2();
}
const _easycom_loading_dots = () => "../loading-dots/loading-dots.js";
if (!Math) {
  _easycom_loading_dots();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $props.play && $props.getVoiceData
  }, $props.play && $props.getVoiceData ? {
    b: $options.upx2px(50)
  } : {}, {
    c: $props.play && !$props.getVoiceData
  }, $props.play && !$props.getVoiceData ? {} : {});
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/Users/ken/Documents/HBuilderProjects/chatgpt-uniapp/components/wave-animation-up/wave-animation-up.vue"]]);
wx.createComponent(Component);
