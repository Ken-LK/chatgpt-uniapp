"use strict";
const common_vendor = require("../vendor.js");
function showLoadingHttp() {
  common_vendor.index.showLoading({
    title: "加载中",
    mask: true
  });
}
function hideLoadingHttp() {
  common_vendor.index.hideLoading();
}
function updateNameAndImg(requestData, sucessCallBack) {
  const appId = getApp().globalData.appId;
  common_vendor.index.request({
    url: getApp().globalData.url + "wtall-ai/updateNameAndImg",
    method: "POST",
    header: {
      "content-type": "application/json",
      "authU": common_vendor.index.getStorageSync(getApp().globalData.openIdCacheName),
      "auth": appId
    },
    data: {
      ...requestData,
      appId
    },
    success: (res) => {
      if (checkHttpOk(res)) {
        console.log("login_req_success", res);
        common_vendor.index.setStorageSync(getApp().globalData.openIdCacheName, res.data.data.openId);
        common_vendor.index.setStorageSync(getApp().globalData.avatarUrlCacheName, res.data.data.imgUrl);
        common_vendor.index.setStorageSync(getApp().globalData.nickNameCacheName, res.data.data.name);
        common_vendor.index.showModal({
          title: "提示",
          content: "操作成功",
          showCancel: false,
          success: function(res2) {
            if (res2.confirm) {
              sucessCallBack();
            }
          }
        });
      } else {
        common_vendor.index.showModal({
          content: res.data.msg,
          showCancel: false
        });
      }
    },
    fail: (res) => {
      console.log("login_req_fail", res);
      common_vendor.index.showModal({
        content: res.errMsg,
        showCancel: false
      });
    }
  });
}
function streamWx(that, requestData, successCallBack, failCallBack, completeCallBack, onHeadersReceivedCallBack, onChunkReceivedCallBack) {
  const appId = getApp().globalData.appId;
  const temperatureObj = common_vendor.index.getStorageSync(getApp().globalData.temperatureNameCacheName);
  const modelObj = common_vendor.index.getStorageSync(getApp().globalData.modeNameCacheName);
  const requestTask = common_vendor.index.request({
    url: getApp().globalData.url + "wtall-ai/stream",
    responseType: "arraybuffer",
    method: "POST",
    enableChunked: true,
    header: {
      "sslVerify": false,
      "content-type": "application/json",
      "authU": common_vendor.index.getStorageSync(getApp().globalData.openIdCacheName),
      "auth": appId
    },
    data: {
      ...requestData,
      appId: getApp().globalData.appId,
      openId: common_vendor.index.getStorageSync(getApp().globalData.openIdCacheName),
      temperatureStr: getApp().globalData.isBlank(temperatureObj) ? "" : temperatureObj.value,
      model: getApp().globalData.isBlank(modelObj) ? "" : modelObj.model
    },
    success: (res) => {
      successCallBack(res);
    },
    complete: (res) => {
      completeCallBack(res);
    },
    fail: (err) => {
      failCallBack(err);
    }
  });
  requestTask.onHeadersReceived(function(r) {
    onHeadersReceivedCallBack(r);
  });
  requestTask.onChunkReceived(function(r) {
    onChunkReceivedCallBack(r);
  });
  return requestTask;
}
function streamDy(that, requestData, successCallBack, failCallBack, completeCallBack) {
  const appId = getApp().globalData.appId;
  const requestTask = common_vendor.index.request({
    url: getApp().globalData.url + "wtall-ai/stream",
    responseType: "text",
    method: "POST",
    header: {
      "content-type": "application/json",
      "authU": common_vendor.index.getStorageSync(getApp().globalData.openIdCacheName),
      "auth": appId
    },
    data: {
      ...requestData,
      "appId": getApp().globalData.appId
    },
    success: (res) => {
      successCallBack(res);
    },
    complete: (res) => {
      completeCallBack(res);
    },
    fail: (err) => {
      failCallBack(err);
    }
  });
  return requestTask;
}
function userLogin(requestData, successCallback, failCallBack) {
  const appId = getApp().globalData.appId;
  common_vendor.index.request({
    url: getApp().globalData.url + "wtall-ai/login",
    method: "POST",
    header: {
      "content-type": "application/json",
      "auth": appId
    },
    data: {
      openId: common_vendor.index.getStorageSync(getApp().globalData.openIdCacheName),
      appId,
      ...requestData
    },
    success: (res) => {
      if (checkHttpOk(res)) {
        successCallback(res);
      } else {
        failCallBack(res);
      }
    },
    fail: (res) => {
      failCallBack(res);
    },
    complete: () => {
    }
  });
}
function cardCodeChange(requestData, successCallback, failCallBack) {
  const appId = getApp().globalData.appId;
  showLoadingHttp();
  common_vendor.index.request({
    url: getApp().globalData.url + "wtall-ai/card-code",
    method: "POST",
    header: {
      "content-type": "application/json",
      "authU": common_vendor.index.getStorageSync(getApp().globalData.openIdCacheName),
      "auth": appId
    },
    data: {
      openId: common_vendor.index.getStorageSync(getApp().globalData.openIdCacheName),
      appId,
      appType: getApp().globalData.appType,
      ...requestData
    },
    success: (res) => {
      if (checkHttpOk(res)) {
        successCallback(res);
      } else {
        common_vendor.index.showModal({
          content: res.data.msg,
          showCancel: false
        });
      }
    },
    fail: (res) => {
      console.log("login_fail", res);
      common_vendor.index.showModal({
        content: "网络异常，请稍后重试",
        showCancel: false
      });
    },
    complete: () => {
      hideLoadingHttp();
    }
  });
}
function guide(infoId, callback) {
  const appId = getApp().globalData.appId;
  common_vendor.index.request({
    url: getApp().globalData.url + "wtall-ai/guide",
    method: "POST",
    header: {
      "content-type": "application/json",
      "authU": common_vendor.index.getStorageSync(getApp().globalData.openIdCacheName),
      "auth": appId
    },
    data: {
      openId: common_vendor.index.getStorageSync(getApp().globalData.openIdCacheName),
      appId,
      categoryInfoId: infoId
    },
    success: (res) => {
      if (checkHttpOk(res)) {
        callback(res);
      }
    },
    fail: (res) => {
    },
    complete: () => {
    }
  });
}
function getProduceCategory(openId, appId, callback) {
  common_vendor.index.request({
    url: getApp().globalData.url + "wtall-ai/produceCategory",
    method: "POST",
    header: {
      "content-type": "application/json",
      "authU": common_vendor.index.getStorageSync(getApp().globalData.openIdCacheName),
      "auth": appId
    },
    data: {
      openId,
      appId
    },
    success: (res) => {
      callback(res, checkHttpOk(res));
    },
    fail: (res) => {
    },
    complete: () => {
    }
  });
}
function getUserValidTime(callback) {
  const appId = getApp().globalData.appId;
  common_vendor.index.request({
    url: getApp().globalData.url + "wtall-ai/validTime",
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
      callback(res, checkHttpOk(res));
    },
    fail: (res) => {
    }
  });
}
function addValidTime(callback) {
  const adType = getApp().globalData.adTypePlay;
  const appId = getApp().globalData.appId;
  common_vendor.index.request({
    url: getApp().globalData.url + "wtall-ai/addValidTime",
    method: "POST",
    header: {
      "content-type": "application/json",
      "authU": common_vendor.index.getStorageSync(getApp().globalData.openIdCacheName),
      "auth": appId
    },
    data: {
      openId: common_vendor.index.getStorageSync(getApp().globalData.openIdCacheName),
      appId,
      adType
    },
    success: (res) => {
      if (checkHttpOk(res)) {
        const title = "您成功获得" + res.data.data.timeStr;
        console.log("addValidTime", title);
        common_vendor.index.showToast({
          title,
          icon: "none",
          position: "top",
          duration: 2e3
        });
        callback(res, checkHttpOk(res));
      } else {
        common_vendor.index.showToast({
          title: res.data,
          icon: "error",
          position: "top",
          duration: 2e3
        });
      }
    },
    fail: (res) => {
    }
  });
}
function checkHttpOk(res) {
  if (res.data.code == "000000") {
    return true;
  }
  return false;
}
function adShowBefore(callBack) {
  setTimeout(() => {
    common_vendor.index.showModal({
      title: "提示",
      content: "每观看一次视频可以获取1小时的无限次使用，每天第三次观看视频可以获取1整天的无限次使用哦。",
      success: function(res) {
        if (res.confirm) {
          callBack();
        } else if (res.cancel) {
          console.log("用户点击取消");
        }
      }
    });
  }, 10);
}
function number(a, b) {
  return a * b;
}
const http = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  adShowBefore,
  addValidTime,
  cardCodeChange,
  getProduceCategory,
  getUserValidTime,
  guide,
  number,
  streamDy,
  streamWx,
  updateNameAndImg,
  userLogin
}, Symbol.toStringTag, { value: "Module" }));
exports.http = http;
