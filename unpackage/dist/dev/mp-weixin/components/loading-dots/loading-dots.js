"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      dots: [1, 2, 3, 4]
    };
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($data.dots, (dot, index, i0) => {
      return {
        a: index,
        b: common_vendor.n(`dot-${index + 1}`)
      };
    })
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/Users/ken/Documents/HBuilderProjects/chatgpt-uniapp/components/loading-dots/loading-dots.vue"]]);
wx.createComponent(Component);
