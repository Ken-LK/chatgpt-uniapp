"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      productList: []
    };
  },
  onLoad() {
    console.log("初始化产品信息");
    common_vendor.index.wxPay.queryProductList((res) => {
      console.log("queryProductList", res);
      this.productList = res.data.data;
    });
  },
  onShow() {
  },
  methods: {
    sendParentUser(user) {
    },
    buyProduct(code) {
      console.log("buyProduct", code);
      const that = this;
      if (common_vendor.index.getSystemInfoSync().osName === "ios") {
        common_vendor.index.showModal({
          title: "提示",
          content: "由于相关规范，ios充值功能暂不可用。是否前去联系客服充值？",
          success: function(res) {
            if (res.confirm) {
              common_vendor.index.navigateTo({
                url: "/pages/user/customerSupport"
              });
            } else if (res.cancel) {
              console.log("用户点击取消");
            }
          }
        });
        return;
      }
      const requestData = {
        appType: "WXXCX",
        payType: "WXPAY",
        productCode: code
      };
      common_vendor.index.wxPay.createPayOrder(requestData, (res) => {
        console.log("createPayOrder", res);
        common_vendor.index.requestPayment({
          "timeStamp": res.data.data.wxPayCreateOrderResp.timestamp,
          "nonceStr": res.data.data.wxPayCreateOrderResp.nonceStr,
          "package": res.data.data.wxPayCreateOrderResp.packageVal,
          "signType": res.data.data.wxPayCreateOrderResp.signType,
          "paySign": res.data.data.wxPayCreateOrderResp.paySign,
          "success": function(succ) {
            console.log("paysuccess", succ);
            const queryRequestData = {
              orderNo: res.data.data.orderNo,
              payType: "WXPAY"
            };
            common_vendor.index.wxPay.queryOrder(queryRequestData, (res2) => {
              if (res2.data.data.orderStatus === "S") {
                that.$refs.showVipInfoChild.showUserCount();
                common_vendor.index.showModal({
                  title: "系统提示",
                  content: "支付成功",
                  showCancel: false
                });
              }
            });
          },
          "fail": function(err) {
            console.log("payfail", err);
            common_vendor.index.showModal({
              title: "系统提示",
              content: "支付失败，请重试",
              showCancel: false
            });
            common_vendor.index.wxPay.cancelOrder(res.data.data.orderNo);
          },
          "complete": function(com) {
            console.log("paycomplete", com);
          }
        });
      });
    }
  }
};
if (!Array) {
  const _easycom_showVipInfo2 = common_vendor.resolveComponent("showVipInfo");
  _easycom_showVipInfo2();
}
const _easycom_showVipInfo = () => "../../components/showVipInfo/showVipInfo.js";
if (!Math) {
  _easycom_showVipInfo();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.sr("showVipInfoChild", "7dac6bb4-0"),
    b: common_vendor.f($data.productList, (product, index, i0) => {
      return {
        a: common_vendor.t(product.productName),
        b: common_vendor.t(product.productDesc),
        c: common_vendor.t(product.chatPlusCount),
        d: common_vendor.t(product.drawCount),
        e: common_vendor.t(product.price),
        f: common_vendor.o(($event) => $options.buyProduct(product.productCode), index),
        g: index
      };
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/Users/ken/Documents/HBuilderProjects/chatgpt-uniapp/pages/user/vipBuy.vue"]]);
wx.createPage(MiniProgramPage);
