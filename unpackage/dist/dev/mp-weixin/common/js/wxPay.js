"use strict";
const common_vendor = require("../vendor.js");
function queryProductList(callBackSuccess) {
  const appId = getApp().globalData.appId;
  showLoadingHttp();
  common_vendor.index.request({
    url: getApp().globalData.url + "wtall-ai/pay/queryProductList",
    method: "POST",
    header: {
      "content-type": "application/json",
      "authU": common_vendor.index.getStorageSync(getApp().globalData.openIdCacheName),
      "auth": appId
    },
    data: {},
    success: (res) => {
      if (checkHttpOk(res)) {
        callBackSuccess(res);
      } else {
        common_vendor.index.showModal({
          content: res.data.msg,
          showCancel: false
        });
      }
    },
    fail: (res) => {
      showNetError();
    },
    complete: () => {
      hideLoadingHttp();
    }
  });
}
function createPayOrder(requestData, callBackSuccess) {
  const appId = getApp().globalData.appId;
  showLoadingHttp();
  common_vendor.index.request({
    url: getApp().globalData.url + "wtall-ai/pay/createOrder",
    method: "POST",
    header: {
      "content-type": "application/json",
      "authU": common_vendor.index.getStorageSync(getApp().globalData.openIdCacheName),
      "auth": appId
    },
    data: {
      openId: common_vendor.index.getStorageSync(getApp().globalData.openIdCacheName),
      appId,
      ...requestData
    },
    success: (res) => {
      if (checkHttpOk(res)) {
        callBackSuccess(res);
      } else {
        common_vendor.index.showModal({
          content: res.data.msg,
          showCancel: false
        });
      }
    },
    fail: (res) => {
      showNetError();
    },
    complete: () => {
      hideLoadingHttp();
    }
  });
}
function cancelOrder(orderNo, callBackSuccess) {
  const appId = getApp().globalData.appId;
  common_vendor.index.request({
    url: getApp().globalData.url + "wtall-ai/pay/cancelOrder",
    method: "POST",
    header: {
      "content-type": "application/json",
      "authU": common_vendor.index.getStorageSync(getApp().globalData.openIdCacheName),
      "auth": appId
    },
    data: {
      openId: common_vendor.index.getStorageSync(getApp().globalData.openIdCacheName),
      appId,
      orderNo
    },
    success: (res) => {
      if (checkHttpOk(res)) {
        callBackSuccess(res);
      }
    },
    fail: (res) => {
    },
    complete: () => {
    }
  });
}
function showNetError() {
  common_vendor.index.showModal({
    content: "网络异常请稍后再试",
    showCancel: false
  });
}
function orderRecord(requestData, callBackSuccess, callBackFail) {
  const appId = getApp().globalData.appId;
  common_vendor.index.request({
    url: getApp().globalData.url + "wtall-ai/pay/orderRecord",
    method: "POST",
    header: {
      "content-type": "application/json",
      "authU": common_vendor.index.getStorageSync(getApp().globalData.openIdCacheName),
      "auth": appId
    },
    data: {
      openId: common_vendor.index.getStorageSync(getApp().globalData.openIdCacheName),
      appId,
      ...requestData
    },
    success: (res) => {
      if (checkHttpOk(res)) {
        callBackSuccess(res);
      } else {
        common_vendor.index.showModal({
          content: res.data.msg,
          showCancel: false
        });
      }
    },
    fail: (res) => {
      callBackFail(res);
    },
    complete: () => {
    }
  });
}
function queryOrder(requestData, callBackSuccess) {
  const appId = getApp().globalData.appId;
  common_vendor.index.request({
    url: getApp().globalData.url + "wtall-ai/pay/queryOrder",
    method: "POST",
    header: {
      "content-type": "application/json",
      "authU": common_vendor.index.getStorageSync(getApp().globalData.openIdCacheName),
      "auth": appId
    },
    data: {
      openId: common_vendor.index.getStorageSync(getApp().globalData.openIdCacheName),
      appId,
      ...requestData
    },
    success: (res) => {
      if (checkHttpOk(res)) {
        callBackSuccess(res);
      }
    },
    fail: (res) => {
    },
    complete: () => {
    }
  });
}
function showLoadingHttp() {
  common_vendor.index.showLoading({
    title: "加载中",
    mask: true
  });
}
function hideLoadingHttp() {
  common_vendor.index.hideLoading();
}
function checkHttpOk(res) {
  if (res.data.code == "000000") {
    return true;
  }
  return false;
}
const wxPay = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  cancelOrder,
  createPayOrder,
  orderRecord,
  queryOrder,
  queryProductList
}, Symbol.toStringTag, { value: "Module" }));
exports.wxPay = wxPay;
