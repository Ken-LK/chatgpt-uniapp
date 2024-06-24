"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      // 头像
      avatarUrl: common_vendor.index.getStorageSync("avatarUrl"),
      // 用户名
      nickName: common_vendor.index.getStorageSync("nickName"),
      // 登录 code
      logCode: "",
      // 登录
      disabled: true
    };
  },
  computed: {
    explainName() {
      let name = "";
      if (this.avatarUrl == "") {
        name = "请授权用户头像";
        return name;
      }
      if (this.nickName == "") {
        name = "请输入用户名";
        return name;
      }
      return name;
    }
  },
  onLoad() {
    this.userCode();
  },
  methods: {
    avatarUrlToBase64() {
      const that = this;
      common_vendor.index.getFileSystemManager().readFile({
        filePath: that.avatarUrl,
        encoding: "base64",
        success(res) {
          that.avatarUrl = "data:image/jpeg;base64," + res.data;
        }
      });
    },
    wxLogin() {
      const that = this;
      that.avatarUrlToBase64();
      common_vendor.index.login({
        success(res) {
          const requestData = {
            token: res.code,
            "imgUrl": that.avatarUrl,
            "name": that.nickName,
            appType: "WXXCX"
          };
          common_vendor.index.http.updateNameAndImg(requestData, () => {
            common_vendor.index.navigateBack({
              delta: 1
              // 返回的页面数，1表示返回上一个页面
            });
          });
        }
      });
    },
    // 获取code
    userCode() {
      let that = this;
      common_vendor.index.login({
        provider: "weixin",
        success(res) {
          console.log("登录code", res);
          that.logCode = res.code;
        }
      });
    },
    //获取用户头像
    onChooseAvatar(e) {
      this.avatarUrl = e.detail.avatarUrl;
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.n($data.avatarUrl == "" ? "avatar-img" : ""),
    b: $data.avatarUrl,
    c: common_vendor.o((...args) => $options.onChooseAvatar && $options.onChooseAvatar(...args)),
    d: $data.nickName,
    e: common_vendor.o(($event) => $data.nickName = $event.detail.value),
    f: common_vendor.o((...args) => $options.wxLogin && $options.wxLogin(...args)),
    g: common_vendor.s($options.explainName == "" ? "color:black;" : "color:darkgrey;"),
    h: $options.explainName == "" ? false : true,
    i: common_vendor.t($options.explainName)
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-e7d0e47a"], ["__file", "/Users/ken/Documents/HBuilderProjects/chatgpt-uniapp/pages/user/wx-login.vue"]]);
wx.createPage(MiniProgramPage);
