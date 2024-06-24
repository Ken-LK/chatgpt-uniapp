"use strict";
const common_vendor = require("../../common/vendor.js");
const drawRecordItem = () => "../../components/draw-record-item/draw-record-item.js";
const _sfc_main = {
  components: {
    drawRecordItem
  },
  data() {
    return {
      activeColor: "#000000",
      styleType: "text",
      popupMessage: "",
      items: ["记录", "任务"],
      current: 0,
      imageTaskList: [],
      imageRecordList: [],
      timer: null
    };
  },
  onShow() {
    const that = this;
    this.drawTask();
    this.drawRecord();
    if (this.timer === null) {
      this.timer = setInterval(() => {
        if (that.imageTaskList.length > 0) {
          that.drawTask();
          that.drawRecord();
        }
      }, 1e4);
    }
  },
  onLoad(option) {
    if (option.current) {
      this.current = parseInt(option.current);
    }
  },
  methods: {
    popupMaskClick() {
      console.log("popupMaskClick");
      this.$refs.message.close();
    },
    drawImgInfo(info) {
      console.log("drawImgInfo", info);
      common_vendor.index.navigateTo({
        url: "/pages/user/drawTaskItem?task=" + JSON.stringify(info)
      });
    },
    onClickItem(e) {
      console.log("onClickItem");
      if (this.current !== e.currentIndex) {
        if (e.currentIndex === 0) {
          this.drawTask();
        } else if (e.currentIndex === 1) {
          this.drawRecord();
        }
        this.current = e.currentIndex;
      }
    },
    drawTask() {
      const req = {
        drawStatus: ["0", "2"]
      };
      common_vendor.index.draw.drawTaskRecord(this, req, (res) => {
        this.imageTaskList = res.data.data;
      });
    },
    drawRecord() {
      const req = {
        drawStatus: ["1", "3", "4"]
      };
      common_vendor.index.draw.drawTaskRecord(this, req, (res) => {
        this.imageRecordList = res.data.data;
      });
    }
  }
};
if (!Array) {
  const _easycom_uni_segmented_control2 = common_vendor.resolveComponent("uni-segmented-control");
  const _component_uni_section = common_vendor.resolveComponent("uni-section");
  const _easycom_draw_record_item2 = common_vendor.resolveComponent("draw-record-item");
  const _easycom_uni_popup_message2 = common_vendor.resolveComponent("uni-popup-message");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  (_easycom_uni_segmented_control2 + _component_uni_section + _easycom_draw_record_item2 + _easycom_uni_popup_message2 + _easycom_uni_popup2)();
}
const _easycom_uni_segmented_control = () => "../../uni_modules/uni-segmented-control/components/uni-segmented-control/uni-segmented-control.js";
const _easycom_draw_record_item = () => "../../components/draw-record-item/draw-record-item.js";
const _easycom_uni_popup_message = () => "../../uni_modules/uni-popup/components/uni-popup-message/uni-popup-message.js";
const _easycom_uni_popup = () => "../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
if (!Math) {
  (_easycom_uni_segmented_control + _easycom_draw_record_item + _easycom_uni_popup_message + _easycom_uni_popup)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o($options.onClickItem),
    b: common_vendor.p({
      current: $data.current,
      values: $data.items,
      ["style-type"]: $data.styleType,
      ["active-color"]: $data.activeColor
    }),
    c: common_vendor.p({
      type: "line"
    }),
    d: $data.current === 0
  }, $data.current === 0 ? {
    e: common_vendor.o($options.drawImgInfo),
    f: common_vendor.p({
      options: $data.imageRecordList
    })
  } : {}, {
    g: $data.current === 1
  }, $data.current === 1 ? {
    h: common_vendor.o($options.drawImgInfo),
    i: common_vendor.p({
      options: $data.imageTaskList
    })
  } : {}, {
    j: common_vendor.p({
      type: "error",
      ["before-close"]: "false",
      message: $data.popupMessage,
      duration: "2000"
    }),
    k: common_vendor.sr("message", "4cb0eca6-4"),
    l: common_vendor.p({
      type: "message",
      ["mask-click"]: true
    }),
    m: common_vendor.o((...args) => $options.popupMaskClick && $options.popupMaskClick(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/Users/ken/Documents/HBuilderProjects/chatgpt-uniapp/pages/user/drawTask.vue"]]);
wx.createPage(MiniProgramPage);
