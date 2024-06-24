"use strict";
const common_vendor = require("../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      robatIcon: "",
      myIcon: getApp().globalData.isBlank(common_vendor.index.getStorageSync(getApp().globalData.avatarUrlCacheName)) ? "../static/img/my_ask.jpg" : common_vendor.index.getStorageSync(getApp().globalData.avatarUrlCacheName),
      guideInfo: null
    };
  },
  props: ["message", "id", "currentMax"],
  computed: common_vendor.mapState(["user"]),
  beforeUpdate() {
    console.log("beforeUpdate");
    this.initGuideInfo();
  },
  created() {
    console.log("beforeUpdate_created");
    this.initGuideInfo();
  },
  methods: {
    initGuideInfo: function() {
      if (this.id + 1 === this.currentMax && this.guideInfo === null) {
        common_vendor.index.http.guide(this.message.infoId, (res) => {
          console.log("查询到数据", res);
          this.guideInfo = res.data.data;
          this.$parent.forceScrollBottom();
        });
      }
    },
    inputSelect: function(selectValue) {
      console.log("inputSelect");
      this.$parent.getInputMessage({
        type: "text",
        content: selectValue
      });
    },
    getDomByClass: function(classNameSelect) {
      return common_vendor.index.createSelectorQuery().in(this).select(classNameSelect);
    },
    copy: function(msg) {
      const that = this;
      console.log(this.message);
      common_vendor.index.setClipboardData({
        data: that.message.content
      });
      common_vendor.index.showToast({
        title: "已复制到剪贴板",
        duration: 2e3
      });
    }
  }
};
if (!Array) {
  const _easycom_loading_dots2 = common_vendor.resolveComponent("loading-dots");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  (_easycom_loading_dots2 + _easycom_uni_icons2)();
}
const _easycom_loading_dots = () => "./loading-dots/loading-dots.js";
const _easycom_uni_icons = () => "../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  (_easycom_loading_dots + _easycom_uni_icons)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $props.message.user == "home"
  }, $props.message.user == "home" ? {
    b: $props.message.imgUrl
  } : {}, {
    c: !$props.message.loading
  }, !$props.message.loading ? {
    d: common_vendor.t($props.message.content),
    e: common_vendor.n("m-content-head-" + $props.message.user),
    f: common_vendor.o(($event) => $options.copy($props.message.user)),
    g: $props.message.user == "customer" ? 1 : ""
  } : {}, {
    h: !$props.message.loading
  }, !$props.message.loading ? common_vendor.e({
    i: $props.message.user == "customer"
  }, $props.message.user == "customer" ? {
    j: $data.myIcon
  } : {}, {
    k: $props.message.user == "home"
  }, $props.message.user == "home" ? {} : {}) : {}, {
    l: $props.message.loading
  }, $props.message.loading ? {} : {}, {
    m: "message" + $props.id,
    n: $props.currentMax === $props.id + 1 && $data.guideInfo !== null
  }, $props.currentMax === $props.id + 1 && $data.guideInfo !== null ? common_vendor.e({
    o: $data.guideInfo.title !== ""
  }, $data.guideInfo.title !== "" ? {
    p: common_vendor.t($data.guideInfo.title)
  } : {}, {
    q: $data.guideInfo.content !== ""
  }, $data.guideInfo.content !== "" ? {
    r: common_vendor.t($data.guideInfo.content)
  } : {}, {
    s: common_vendor.f($data.guideInfo.selectList, (item, index, i0) => {
      return {
        a: common_vendor.t(item),
        b: "63433cfc-1-" + i0,
        c: common_vendor.o(($event) => $options.inputSelect(item), index),
        d: index
      };
    }),
    t: common_vendor.p({
      type: "right",
      size: "14"
    })
  }) : {});
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/Users/ken/Documents/HBuilderProjects/chatgpt-uniapp/components/messageshow-role.vue"]]);
wx.createComponent(Component);
