"use strict";
const common_vendor = require("../vendor.js");
function audioToText(requestData, callBackSuccess, callBackFail) {
  const appId = getApp().globalData.appId;
  showLoadingHttp();
  common_vendor.index.request({
    url: getApp().globalData.url + "wtall-ai/audio/audioToText",
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
        showNetError();
        callBackFail(res);
      }
    },
    fail: (res) => {
      showNetError();
      callBackFail(res);
    },
    complete: () => {
      hideLoadingHttp();
    }
  });
}
function textToAudio(requestData, callBackSuccess, callBackFail) {
  const appId = getApp().globalData.appId;
  common_vendor.index.request({
    url: getApp().globalData.url + "wtall-ai/audio/textToAudio",
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
        showNetError();
        callBackFail(res);
      }
    },
    fail: (res) => {
      showNetError();
      callBackFail(res);
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
function showLoadingHttp() {
  common_vendor.index.showLoading({
    title: "处理中",
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
const audio = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  audioToText,
  textToAudio
}, Symbol.toStringTag, { value: "Module" }));
exports.audio = audio;
