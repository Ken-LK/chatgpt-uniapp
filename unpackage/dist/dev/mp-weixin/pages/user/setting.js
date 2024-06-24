"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      modeArray: [{
        index: 0,
        name: "3.5基础模型",
        model: "base"
      }, {
        index: 1,
        name: "4.0plus模型",
        model: "plus"
      }],
      currentMode: getApp().globalData.isBlank(common_vendor.index.getStorageSync(getApp().globalData.modeNameCacheName)) ? "3.5基础模型" : common_vendor.index.getStorageSync(getApp().globalData.modeNameCacheName).name,
      currentModeIndex: getApp().globalData.isBlank(common_vendor.index.getStorageSync(getApp().globalData.modeNameCacheName)) ? 0 : common_vendor.index.getStorageSync(getApp().globalData.modeNameCacheName).index,
      currentAudio: getApp().globalData.isBlank(common_vendor.index.getStorageSync(getApp().globalData.audioSwitchName)) ? false : common_vendor.index.getStorageSync(getApp().globalData.audioSwitchName),
      sexChecked: getApp().globalData.isBlank(common_vendor.index.getStorageSync(getApp().globalData.audioSexName)) ? "M" : common_vendor.index.getStorageSync(getApp().globalData.audioSexName),
      sexArray: [
        {
          text: "男",
          value: "M"
        },
        {
          text: "女",
          value: "FM"
        }
      ],
      //对话大师
      temperatureArray: [{
        index: 0,
        name: "专业",
        value: "0.1"
      }, {
        index: 1,
        name: "平衡",
        value: "0.7"
      }, {
        index: 2,
        name: "荒诞",
        value: "1.3"
      }],
      currentTemperature: getApp().globalData.isBlank(common_vendor.index.getStorageSync(getApp().globalData.temperatureNameCacheName)) ? "平衡" : common_vendor.index.getStorageSync(getApp().globalData.temperatureNameCacheName).name,
      currentTemperatureIndex: getApp().globalData.isBlank(common_vendor.index.getStorageSync(getApp().globalData.temperatureNameCacheName)) ? 1 : common_vendor.index.getStorageSync(getApp().globalData.temperatureNameCacheName).index
    };
  },
  computed: {
    audioOpenText() {
      return this.currentAudio ? "开启中" : "已关闭";
    }
  },
  onLoad() {
    console.log("onLoad");
  },
  methods: {
    audioSexChange: function(e) {
      common_vendor.index.setStorageSync(getApp().globalData.audioSexName, e.detail.value);
      this.sexChecked = e.detail.value;
    },
    audioChange: function(e) {
      common_vendor.index.setStorageSync(getApp().globalData.audioSwitchName, e.detail.value);
      this.currentAudio = e.detail.value;
    },
    bindModelChange: function(e) {
      console.log("picker发送选择改变，携带值为：", e);
      common_vendor.index.setStorageSync(getApp().globalData.modeNameCacheName, this.modeArray[e.detail.value]);
      this.currentMode = this.modeArray[e.detail.value].name;
    },
    bindTemperatureChange: function(e) {
      console.log("picker发送选择改变，携带值为：", e);
      common_vendor.index.setStorageSync(getApp().globalData.temperatureNameCacheName, this.temperatureArray[e.detail.value]);
      this.currentTemperature = this.temperatureArray[e.detail.value].name;
    }
  }
};
if (!Array) {
  const _easycom_uni_data_checkbox2 = common_vendor.resolveComponent("uni-data-checkbox");
  _easycom_uni_data_checkbox2();
}
const _easycom_uni_data_checkbox = () => "../../uni_modules/uni-data-checkbox/components/uni-data-checkbox/uni-data-checkbox.js";
if (!Math) {
  _easycom_uni_data_checkbox();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.t($data.currentMode),
    b: common_vendor.o((...args) => $options.bindModelChange && $options.bindModelChange(...args)),
    c: $data.currentModeIndex,
    d: $data.modeArray,
    e: common_vendor.t($data.currentTemperature),
    f: common_vendor.o((...args) => $options.bindTemperatureChange && $options.bindTemperatureChange(...args)),
    g: $data.currentTemperatureIndex,
    h: $data.temperatureArray,
    i: common_vendor.t($options.audioOpenText),
    j: $data.currentAudio,
    k: common_vendor.o((...args) => $options.audioChange && $options.audioChange(...args)),
    l: common_vendor.o($options.audioSexChange),
    m: common_vendor.o(($event) => $data.sexChecked = $event),
    n: common_vendor.p({
      localdata: $data.sexArray,
      modelValue: $data.sexChecked
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/Users/ken/Documents/HBuilderProjects/chatgpt-uniapp/pages/user/setting.vue"]]);
wx.createPage(MiniProgramPage);
