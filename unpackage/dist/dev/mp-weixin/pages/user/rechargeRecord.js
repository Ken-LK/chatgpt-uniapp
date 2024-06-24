"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      loading: false,
      noMoreData: false,
      rechargeList: [
        // 初始为空数组，用于存放后端返回的充值记录数据
      ],
      pageCurrent: 1,
      pageSize: 20
    };
  },
  onLoad() {
    this.loadData(true);
  },
  methods: {
    loadData(init) {
      this.loading = true;
      const queryReq = {
        page: {
          current: this.pageCurrent,
          size: this.pageSize
        }
      };
      common_vendor.index.wxPay.orderRecord(queryReq, (success) => {
        common_vendor.index.stopPullDownRefresh();
        this.loading = false;
        this.pageCurrent++;
        console.log("success", success);
        if (success.data.data.records.length > 0) {
          if (init) {
            this.rechargeList = success.data.data.records;
          } else {
            this.rechargeList = this.rechargeList.concat(success.data.data.records);
          }
        } else {
          this.noMoreData = true;
        }
      }, (fail) => {
        common_vendor.index.stopPullDownRefresh();
        this.loading = false;
      });
    },
    loadMore(init) {
      if (this.loading || this.noMoreData) {
        return;
      }
      this.loadData(init);
    }
  },
  onReachBottom() {
    console.log("onReachBottom");
    this.loadMore(false);
  },
  onPullDownRefresh() {
    this.pageCurrent = 1;
    this.loadMore(true);
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.f($data.rechargeList, (item, index, i0) => {
      return {
        a: common_vendor.t(item.productName),
        b: common_vendor.t(item.amount.toFixed(2)),
        c: common_vendor.t(item.orderStatusName),
        d: common_vendor.t(item.dateStr),
        e: index
      };
    }),
    b: $data.loading
  }, $data.loading ? {} : $data.noMoreData ? {} : {}, {
    c: $data.noMoreData
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/Users/ken/Documents/HBuilderProjects/chatgpt-uniapp/pages/user/rechargeRecord.vue"]]);
wx.createPage(MiniProgramPage);
