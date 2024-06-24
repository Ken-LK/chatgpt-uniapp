"use strict";
const common_vendor = require("../../common/vendor.js");
const produceItem = () => "../../components/produce-item/produce-item.js";
const _sfc_main = {
  components: {
    produceItem
  },
  data() {
    return {
      tabIndex: 0,
      tabBars: [],
      initDataMaxCount: 10
    };
  },
  onShow() {
    console.log("onShow", this.tabBars.length);
    this.initData();
  },
  onLoad() {
  },
  methods: {
    initData() {
      if (this.tabBars === null || this.tabBars.length === 0) {
        common_vendor.index.http.getProduceCategory(
          common_vendor.index.getStorageSync(getApp().globalData.openIdCacheName),
          getApp().globalData.appId,
          (res, success) => {
            if (success) {
              this.tabBars = res.data.data.dataList;
            } else {
              if (this.initDataMaxCount-- > 0) {
                setTimeout(() => {
                  this.initData();
                }, 2e3);
              }
            }
          }
        );
      }
    },
    goDetail(e) {
      console.log("roleDialog", e);
      common_vendor.index.navigateTo({
        url: "/pages/user/roleDialog?info=" + JSON.stringify(e)
      });
    },
    loadMore(e) {
      console.log("loadMore", "不用分页加载");
    },
    ontabtap(e) {
      let index = e.target.dataset.current || e.currentTarget.dataset.current;
      this.switchTab(index);
    },
    ontabchange(e) {
      let index = e.target.current || e.detail.current;
      this.switchTab(index);
    },
    switchTab(index) {
      this.tabIndex = index;
    }
  }
};
if (!Array) {
  const _easycom_produce_item2 = common_vendor.resolveComponent("produce-item");
  _easycom_produce_item2();
}
const _easycom_produce_item = () => "../../components/produce-item/produce-item.js";
if (!Math) {
  _easycom_produce_item();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($data.tabBars, (tab, index, i0) => {
      return {
        a: common_vendor.t(tab.name),
        b: common_vendor.n($data.tabIndex == index ? "uni-tab-item-title-active" : ""),
        c: tab.id,
        d: tab.id,
        e: index,
        f: common_vendor.o((...args) => $options.ontabtap && $options.ontabtap(...args), tab.id)
      };
    }),
    b: common_vendor.f($data.tabBars, (tab, index1, i0) => {
      return {
        a: common_vendor.o($options.goDetail, index1),
        b: "4f67b302-0-" + i0,
        c: common_vendor.p({
          options: tab.data
        }),
        d: common_vendor.o(($event) => $options.loadMore(index1), index1),
        e: index1
      };
    }),
    c: $data.tabIndex,
    d: common_vendor.o((...args) => $options.ontabchange && $options.ontabchange(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/Users/ken/Documents/HBuilderProjects/chatgpt-uniapp/pages/index/produce.nvue"]]);
wx.createPage(MiniProgramPage);
