"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      popupMessage: "",
      imgUrl: "",
      task: {},
      timer: null,
      drawStatus: "",
      drawType: "",
      progress: 0
    };
  },
  onShow() {
    const that = this;
    if (this.timer !== null) {
      this.timer.clearInterval();
    }
    this.timer = setInterval(() => {
      that.queryDrawTask(that);
    }, 2e3);
  },
  onHide() {
    this.timer.clearInterval();
  },
  onLoad(option) {
    this.task = JSON.parse(option.task);
    console.log("option.task", this.task);
    this.imgUrl = this.task.imageUrl;
    this.drawStatus = this.task.drawStatus;
    this.drawType = this.task.drawType;
  },
  methods: {
    popupMaskClick() {
      console.log("popupMaskClick");
      this.$refs.message.close();
    },
    deleteTask() {
      const that = this;
      common_vendor.index.showModal({
        title: "提示",
        content: "删除后不可恢复，确定要删除图片吗？",
        success: function(res) {
          if (res.confirm) {
            const req = {
              uuid: that.task.uuid
            };
            common_vendor.index.draw.deleteDrawTask(that, req, (res2) => {
              console.log(123);
              common_vendor.index.showToast({
                title: "操作成功",
                duration: 1500,
                mask: false,
                success() {
                  setTimeout(() => {
                    common_vendor.index.navigateBack({
                      delta: 1
                    });
                  }, 1500);
                }
              });
            });
          } else if (res.cancel) {
            console.log("用户点击取消");
          }
        }
      });
    },
    saveImage() {
      const that = this;
      common_vendor.index.downloadFile({
        url: this.imgUrl,
        success(res) {
          if (res.statusCode === 200) {
            common_vendor.index.saveImageToPhotosAlbum({
              filePath: res.tempFilePath,
              success() {
                common_vendor.index.showToast({
                  title: "已保存到相册"
                });
              },
              fail() {
                common_vendor.index.showToast({
                  title: "保存失败"
                });
              }
            });
          } else {
            common_vendor.index.showToast({
              title: "下载失败"
            });
          }
        },
        fail(err) {
          that.popupMessage = JSON.stringify(err);
          that.$refs.message.open();
        }
      });
    },
    reDraw() {
      console.log("reDraw");
      getApp().globalData.reDrawTask = this.task;
      common_vendor.index.switchTab({
        url: "../index/draw"
      });
    },
    queryDrawTask(that) {
      if (that.drawStatus !== "0" && that.drawStatus !== "2") {
        clearInterval(that.timer);
        return;
      }
      const req = {
        uuid: that.task.uuid
      };
      common_vendor.index.draw.drawQueryTask(that, req, (res) => {
        that.imgUrl = res.data.data.taskInfo.imgUrl;
        that.drawStatus = res.data.data.taskInfo.drawStatus;
        that.progress = res.data.data.taskInfo.progress;
        that.task.errorMsg = res.data.data.taskInfo.errorMsg;
        that.task.drawStatus = res.data.data.taskInfo.drawStatus;
      });
    }
  }
};
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_popup_message2 = common_vendor.resolveComponent("uni-popup-message");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  (_easycom_uni_icons2 + _easycom_uni_popup_message2 + _easycom_uni_popup2)();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_popup_message = () => "../../uni_modules/uni-popup/components/uni-popup-message/uni-popup-message.js";
const _easycom_uni_popup = () => "../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
if (!Math) {
  (_easycom_uni_icons + _easycom_uni_popup_message + _easycom_uni_popup)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.imgUrl,
    b: $data.drawStatus == "2"
  }, $data.drawStatus == "2" ? {
    c: common_vendor.t($data.progress)
  } : {}, {
    d: common_vendor.o($options.deleteTask),
    e: common_vendor.p({
      type: "trash-filled",
      size: "24",
      color: "#757575"
    }),
    f: $data.task.errorMsg !== "" && $data.task.errorMsg !== null
  }, $data.task.errorMsg !== "" && $data.task.errorMsg !== null ? {
    g: common_vendor.t($data.task.errorMsg),
    h: common_vendor.t($data.task.drawStatus === "4" ? "(已自动退回绘画次数)" : "")
  } : {}, {
    i: $data.task.drawType === "TEXT_TO_IMAGE"
  }, $data.task.drawType === "TEXT_TO_IMAGE" ? {
    j: common_vendor.t($data.task.prompt === "" ? "   " : $data.task.prompt)
  } : {}, {
    k: common_vendor.t($data.task.imageSizeSelectName),
    l: common_vendor.t($data.task.typeInfoSelectName),
    m: common_vendor.t($data.task.createTimeStr),
    n: common_vendor.o((...args) => $options.reDraw && $options.reDraw(...args)),
    o: common_vendor.o((...args) => $options.saveImage && $options.saveImage(...args)),
    p: common_vendor.p({
      type: "error",
      ["before-close"]: "false",
      message: $data.popupMessage,
      duration: "2000"
    }),
    q: common_vendor.sr("message", "28a9594e-1"),
    r: common_vendor.p({
      type: "message",
      ["mask-click"]: true
    }),
    s: common_vendor.o((...args) => $options.popupMaskClick && $options.popupMaskClick(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/Users/ken/Documents/HBuilderProjects/chatgpt-uniapp/pages/user/drawTaskItem.vue"]]);
wx.createPage(MiniProgramPage);
