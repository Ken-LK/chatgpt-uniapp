"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  props: {
    options: {
      type: Object,
      default: function(e) {
        return {};
      }
    },
    columnCount: {
      type: Object,
      default: function(e) {
        return 3;
      }
    },
    showItem: {
      type: Boolean,
      default: function(e) {
        return false;
      }
    },
    defaultSelect: {
      type: Object,
      default: function(e) {
        return "";
      }
    }
  },
  data() {
    return {
      items: this.options,
      selectedData: ""
    };
  },
  created() {
    console.log("created");
    this.updateDefaultSelect(this.defaultSelect);
  },
  updated() {
    console.log("updated");
  },
  methods: {
    updateDefaultSelect(a) {
      this.selectedData = a;
      if (this.selectedData === "" || this.selectedData === null) {
        this.click(this.options, this.options[0]);
      } else {
        for (let i in this.options) {
          if (this.options[i].code === this.selectedData) {
            this.click(this.options, this.options[i]);
          }
        }
      }
    },
    click(items, itemData) {
      console.log("click");
      if (items.length === 0) {
        return;
      }
      for (let i in items) {
        if (items[i].code !== itemData.code) {
          items[i].active = false;
        }
      }
      itemData.active = true;
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
        a: item.imgUrl,
        b: common_vendor.n(item.active ? "grid-item-box item-active" : "grid-item-box"),
        c: common_vendor.o(($event) => $options.click($props.options, item), index),
        d: index,
        e: "100e71bc-2-" + i0 + ",100e71bc-1",
        f: common_vendor.p({
          index
        })
      };
    }),
    b: common_vendor.p({
      column: $props.columnCount,
      ["show-border"]: false,
      square: false
    }),
    c: common_vendor.p({
      title: "",
      type: "line"
    })
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/Users/ken/Documents/HBuilderProjects/chatgpt-uniapp/components/draw-style-bigItem/draw-style-bigItem.vue"]]);
wx.createComponent(Component);
