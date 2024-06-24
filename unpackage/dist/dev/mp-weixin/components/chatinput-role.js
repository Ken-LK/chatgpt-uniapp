"use strict";
const common_vendor = require("../common/vendor.js");
const _sfc_main = {
  name: "chat-input",
  data() {
    return {
      inputValue: "",
      textAreaMinHeight: "42px"
    };
  },
  methods: {
    inputHeightChange: function(e) {
      console.log(e);
      this.textAreaMinHeight = e.detail.height + 24 + "px";
    },
    startRecognize: function() {
      common_vendor.index.showModal({
        content: "功能开发中",
        showCancel: false
      });
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
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.s("height:" + $data.textAreaMinHeight),
    b: common_vendor.o((...args) => $options.inputHeightChange && $options.inputHeightChange(...args)),
    c: common_vendor.o((...args) => $options.sendMessge && $options.sendMessge(...args)),
    d: $data.inputValue,
    e: common_vendor.o(($event) => $data.inputValue = $event.detail.value),
    f: common_vendor.o($options.sendMessge),
    g: common_vendor.p({
      type: "paperplane-filled",
      size: "24",
      color: "#757575"
    })
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/Users/ken/Documents/HBuilderProjects/chatgpt-uniapp/components/chatinput-role.vue"]]);
wx.createComponent(Component);
