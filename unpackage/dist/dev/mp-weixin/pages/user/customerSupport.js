"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      qqNum: "1063883771",
      wxUrl: "https://cy.wtianyu.com/ai/wtall_ai_user.jpg"
    };
  },
  methods: {
    regCode: function() {
      common_vendor.wx$1.previewImage({
        urls: [this.wxUrl],
        //当前图片地址
        success: function(res) {
          console.log("预览图片成功！");
        },
        fail: function(res) {
          console.log("预览图片失败！");
        }
      });
    },
    copy: function(msg) {
      const that = this;
      common_vendor.index.setClipboardData({
        data: that.qqNum
      });
      common_vendor.index.showToast({
        title: "已复制到剪贴板",
        duration: 2e3
      });
    },
    saveImage() {
      common_vendor.index.downloadFile({
        url: this.wxUrl,
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
          console.log(err);
        }
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.t($data.qqNum),
    b: common_vendor.o((...args) => $options.copy && $options.copy(...args)),
    c: common_vendor.o((...args) => $options.regCode && $options.regCode(...args)),
    d: $data.wxUrl
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/Users/ken/Documents/HBuilderProjects/chatgpt-uniapp/pages/user/customerSupport.vue"]]);
wx.createPage(MiniProgramPage);
