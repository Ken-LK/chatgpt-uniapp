"use strict";
const common_vendor = require("../common/vendor.js");
const _sfc_main = {
  name: "chat-input",
  data() {
    return {
      inputValue: "",
      textAreaMinHeight: "34px",
      voiceOpen: getApp().globalData.isBlank(common_vendor.index.getStorageSync(getApp().globalData.audioSwitchName)) ? false : common_vendor.index.getStorageSync(getApp().globalData.audioSwitchName),
      voiceOpenIng: false,
      //传输给后端的录音base64信息
      audioBase64Array: []
    };
  },
  methods: {
    voiceOpenIngChange: function(res) {
      this.voiceOpenIng = !this.voiceOpenIng;
    },
    audioToTextFrame: function(res) {
      console.log("audioToTextFrame", res);
    },
    audioToTextCancel: function() {
      console.log("audioToTextCancel");
    },
    audioToTextStop: function(res) {
      console.log("audioToTextStop", res);
      if (res.duration < 1e3) {
        common_vendor.index.showModal({
          content: "录制时间太短，请重试",
          showCancel: false
        });
        return;
      }
      const audioBase64Com = common_vendor.index.getFileSystemManager().readFileSync(res.tempFilePath, "base64");
      common_vendor.index.audio.audioToText({
        audioBase64Com
      }, (res2) => {
        console.log("audioToText", res2);
        if (res2.data.data.audioText === "") {
          common_vendor.index.showModal({
            content: "未识别出语音内容，请重试",
            showCancel: false
          });
          return;
        }
        this.$emit("send-message", {
          type: "text",
          content: res2.data.data.audioText
        });
      }, () => {
      });
    },
    audioToTextStart: function() {
      this.audioBase64Array = [];
      console.log("audioToTextStart");
    },
    updateUi: function() {
      this.voiceOpen = getApp().globalData.isBlank(common_vendor.index.getStorageSync(getApp().globalData.audioSwitchName)) ? false : common_vendor.index.getStorageSync(getApp().globalData.audioSwitchName);
    },
    inputHeightChange: function(e) {
      console.log(e);
      this.textAreaMinHeight = e.detail.height + 18 + "px";
    },
    setInputValue: function(value) {
      this.inputValue = value;
    },
    sendMessge: function(event) {
      var that = this;
      if (that.inputValue.trim() == "") {
        that.inputValue = "";
      } else {
        console.log("chatInput", "send", that.inputValue);
        this.$emit("send-message", {
          type: "text",
          content: that.inputValue
        });
        that.inputValue = "";
      }
    }
  }
};
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_nb_voice_record2 = common_vendor.resolveComponent("nb-voice-record");
  (_easycom_uni_icons2 + _easycom_nb_voice_record2)();
}
const _easycom_uni_icons = () => "../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_nb_voice_record = () => "./nb-voice-record/nb-voice-record.js";
if (!Math) {
  (_easycom_uni_icons + _easycom_nb_voice_record)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.voiceOpen
  }, $data.voiceOpen ? {
    b: common_vendor.p({
      type: "mic",
      size: "32"
    }),
    c: common_vendor.o((...args) => $options.voiceOpenIngChange && $options.voiceOpenIngChange(...args))
  } : {}, {
    d: $data.voiceOpen && $data.voiceOpenIng
  }, $data.voiceOpen && $data.voiceOpenIng ? {
    e: common_vendor.o($options.audioToTextStart),
    f: common_vendor.o($options.audioToTextStop),
    g: common_vendor.o($options.audioToTextCancel),
    h: common_vendor.o($options.audioToTextFrame)
  } : {}, {
    i: !$data.voiceOpenIng
  }, !$data.voiceOpenIng ? {
    j: common_vendor.s("height:" + $data.textAreaMinHeight),
    k: common_vendor.o((...args) => $options.inputHeightChange && $options.inputHeightChange(...args)),
    l: common_vendor.o((...args) => $options.sendMessge && $options.sendMessge(...args)),
    m: $data.inputValue,
    n: common_vendor.o(($event) => $data.inputValue = $event.detail.value),
    o: common_vendor.o($options.sendMessge),
    p: common_vendor.p({
      type: "paperplane-filled",
      size: "24",
      color: "#757575"
    })
  } : {}, {
    q: common_vendor.n(`${$data.voiceOpen ? "footer" : "footer1"}`)
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/Users/ken/Documents/HBuilderProjects/chatgpt-uniapp/components/chatinput.vue"]]);
wx.createComponent(Component);
