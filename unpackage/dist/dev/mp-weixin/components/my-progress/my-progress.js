"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  props: ["min", "max"],
  data() {
    return {
      slideBarWidth: 0,
      minScore: this.min ? this.min : 0,
      maxScore: this.max ? this.max : 100,
      x: 0,
      y: 0,
      score: 35,
      initFlag: false
    };
  },
  created() {
    console.log("created2");
    var that = this;
    this.$nextTick(() => {
      common_vendor.index.createSelectorQuery().in(this).select(".slider-box").boundingClientRect(function(res) {
        if (res !== null) {
          that.slideBarWidth = res.width;
        }
        console.log("that.slideBarWidth", that.slideBarWidth);
      }).exec();
    });
  },
  mounted() {
    this.getScreenWidth();
  },
  methods: {
    getScreenWidth() {
      this.x = common_vendor.index.getSystemInfoSync().windowWidth * 0.7 * this.score / 100;
      setTimeout(() => {
        this.initFlag = true;
      }, 500);
    },
    setProgress(event) {
    },
    onChange: function(e) {
      if (!this.initFlag)
        return;
      this.x = e.detail.x;
      this.score = parseInt(e.detail.x / this.slideBarWidth * 100) + parseInt(this.minScore);
      this.$emit("change", this.score);
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.x + "px",
    b: $data.x,
    c: $data.y,
    d: common_vendor.o((...args) => $options.onChange && $options.onChange(...args)),
    e: common_vendor.o(($event) => $options.setProgress($event)),
    f: 100 - $data.maxScore + "%",
    g: common_vendor.t($data.score)
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/Users/ken/Documents/HBuilderProjects/chatgpt-uniapp/components/my-progress/my-progress.vue"]]);
wx.createComponent(Component);
