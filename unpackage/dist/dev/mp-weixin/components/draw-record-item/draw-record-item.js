"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  props: {
    options: {
      type: Object,
      default: function(e) {
        return {};
      }
    }
  },
  created() {
  },
  methods: {
    click(itemData) {
      this.$emit("click", itemData);
    }
  }
};
if (!Array) {
  const _easycom_uni_grid_item2 = common_vendor.resolveComponent("uni-grid-item");
  const _easycom_uni_grid2 = common_vendor.resolveComponent("uni-grid");
  const _component_uni_section = common_vendor.resolveComponent("uni-section");
  (_easycom_uni_grid_item2 + _easycom_uni_grid2 + _component_uni_section)();
}
const _easycom_uni_grid_item = () => "../../uni_modules/uni-grid/components/uni-grid-item/uni-grid-item.js";
const _easycom_uni_grid = () => "../../uni_modules/uni-grid/components/uni-grid/uni-grid.js";
if (!Math) {
  (_easycom_uni_grid_item + _easycom_uni_grid)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($props.options, (item, index, i0) => {
      return {
        a: common_vendor.t(item.drawStatus == "0" ? "排队中" : item.drawStatus == "2" ? "绘制中" : ""),
        b: item.tmpImageUrl,
        c: common_vendor.o(($event) => $options.click(item)),
        d: "61a4b7e2-2-" + i0 + ",61a4b7e2-1"
      };
    }),
    b: common_vendor.p({
      column: 2,
      ["show-border"]: false,
      square: false
    }),
    c: common_vendor.p({
      title: "",
      type: "line"
    })
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/Users/ken/Documents/HBuilderProjects/chatgpt-uniapp/components/draw-record-item/draw-record-item.vue"]]);
wx.createComponent(Component);
