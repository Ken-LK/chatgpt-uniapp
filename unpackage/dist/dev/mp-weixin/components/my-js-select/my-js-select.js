"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {};
  },
  props: ["showHidden", "selectDatas"],
  methods: {
    clickSelect(item) {
      this.$emit("selectModel", item);
    }
  },
  mounted() {
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $props.showHidden
  }, $props.showHidden ? {
    b: common_vendor.f($props.selectDatas, (item, index, i0) => {
      return {
        a: common_vendor.t(item.name),
        b: index,
        c: index,
        d: common_vendor.o(($event) => $options.clickSelect(item), index)
      };
    })
  } : {});
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/Users/ken/Documents/HBuilderProjects/chatgpt-uniapp/components/my-js-select/my-js-select.vue"]]);
wx.createComponent(Component);
