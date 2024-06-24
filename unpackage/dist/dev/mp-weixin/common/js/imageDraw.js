"use strict";
const common_vendor = require("../vendor.js");
function drawQueryStyle(that, callback) {
  const appId = getApp().globalData.appId;
  showLoadingHttp();
  common_vendor.index.request({
    url: getApp().globalData.url + "wtall-ai/imageDrawQueryStyle",
    method: "POST",
    header: {
      "content-type": "application/json",
      "authU": common_vendor.index.getStorageSync(getApp().globalData.openIdCacheName),
      "auth": appId
    },
    data: {
      openId: common_vendor.index.getStorageSync(getApp().globalData.openIdCacheName),
      appId
    },
    success: (res) => {
      if (checkHttpOk(res)) {
        callback(res);
      } else {
        popupShow(that, res.data);
      }
    },
    fail: (res) => {
      popupShow(that, res.errMsg);
    },
    complete: (res) => {
      hideLoadingHttp();
    }
  });
}
function drawCreateTask(that, requestData, callback) {
  const appId = getApp().globalData.appId;
  showLoadingHttp();
  common_vendor.index.request({
    url: getApp().globalData.url + "wtall-ai/imageDrawCreateTask",
    method: "POST",
    header: {
      "content-type": "application/json",
      "authU": common_vendor.index.getStorageSync(getApp().globalData.openIdCacheName),
      "auth": appId
    },
    data: {
      openId: common_vendor.index.getStorageSync(getApp().globalData.openIdCacheName),
      appId,
      security: getApp().globalData.platform === "mp-toutiao" ? true : false,
      appType: getApp().globalData.appType,
      ...requestData
    },
    success: (res) => {
      if (checkHttpOk(res)) {
        callback(res);
      } else {
        popupShow(that, res.data);
      }
    },
    fail: (res) => {
      popupShow(that, res.errMsg);
    },
    complete: (res) => {
      hideLoadingHttp();
      that.doubleClick = false;
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
function popupShow(that, msg) {
  that.popupMessage = JSON.stringify(msg);
  that.$refs.message.open();
  setTimeout(() => {
    that.$refs.message.close();
  }, 2e3);
}
const imageDraw = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  drawCreateTask,
  drawQueryStyle
}, Symbol.toStringTag, { value: "Module" }));
exports.imageDraw = imageDraw;
