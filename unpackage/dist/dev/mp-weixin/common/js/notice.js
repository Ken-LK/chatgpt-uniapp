"use strict";
const common_vendor = require("../vendor.js");
function mainNotice(sucessCallBack) {
  getApp().globalData.appId;
  common_vendor.index.request({
    url: "https://cy.wtianyu.com/notice.json",
    method: "GET",
    success: (res) => {
      console.log(8888);
      if (checkTimeWithNow(res.data.showTime.split(";")[0]) <= 0 && checkTimeWithNow(res.data.showTime.split(";")[1]) >= 0) {
        sucessCallBack(res.data.content);
      }
    },
    fail: (res) => {
    }
  });
}
function checkTimeWithNow(dateString) {
  const currentDate = /* @__PURE__ */ new Date();
  const currentTimestamp = currentDate.getTime();
  const year = parseInt(dateString.substring(0, 4), 10);
  const month = parseInt(dateString.substring(4, 6), 10) - 1;
  const day = parseInt(dateString.substring(6, 8), 10);
  const hour = parseInt(dateString.substring(8, 10), 10);
  const minute = parseInt(dateString.substring(10, 12), 10);
  const second = parseInt(dateString.substring(12, 14), 10);
  const dateObject = new Date(year, month, day, hour, minute, second);
  const dateTimestamp = dateObject.getTime();
  if (dateTimestamp > currentTimestamp) {
    return 1;
  } else if (dateTimestamp < currentTimestamp) {
    return -1;
  } else {
    return 0;
  }
}
const notice = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  mainNotice
}, Symbol.toStringTag, { value: "Module" }));
exports.notice = notice;
