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
  methods: {
    click(item) {
      console.log("click", item);
      this.$emit("click", item);
    },
    close(e) {
      this.$emit("close");
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
        a: common_vendor.t(item.title),
        b: item.imgUrl,
        c: common_vendor.o(($event) => $options.click(item), index),
        d: index,
        e: "9c555cbc-2-" + i0 + ",9c555cbc-1",
        f: common_vendor.p({
          index
        })
      };
    }),
    b: common_vendor.p({
      column: 2,
      ["show-border"]: false,
      square: false
    }),
    c: common_vendor.p({
      title: "无边框带角标（3列）",
      type: "line"
    })
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/Users/ken/Documents/HBuilderProjects/chatgpt-uniapp/components/produce-item/produce-item.vue"]]);
wx.createComponent(Component);
