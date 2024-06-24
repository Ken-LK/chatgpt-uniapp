"use strict";
let rewardedVideoAd = null;
let currentPage = null;
const createRewardedVideoAd = (page) => {
  currentPage = page;
  if (rewardedVideoAd == null) {
    rewardedVideoAd = tt.createRewardedVideoAd({
      "adUnitId": "b0v4flecu2o55i0h38"
    });
    if (rewardedVideoAd == null) {
      return;
    }
    rewardedVideoAd.onError((res) => {
      console.log("onError:", res);
    });
    rewardedVideoAd.onClose((res) => {
      console.log("onclose:", res);
      if (res.isEnded) {
        currentPage.rewardSuccess();
      } else {
        currentPage.rewardFaile();
      }
    });
  }
};
const showRewardedVideoAd = () => {
  if (rewardedVideoAd == null) {
    currentPage.checkAnswer();
    return;
  }
  rewardedVideoAd.show().then(() => {
    console.log("广告显示成功");
  }).catch((err) => {
    console.log("广告组件出现问题", err);
    rewardedVideoAd.load().then(() => {
      console.log("手动加载成功");
      rewardedVideoAd.show();
    }).catch((err2) => {
      console.log("手动加载失败", err2);
      currentPage.rewardSuccess();
    });
  });
};
const dyAd = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  createRewardedVideoAd,
  showRewardedVideoAd
}, Symbol.toStringTag, { value: "Module" }));
exports.dyAd = dyAd;
