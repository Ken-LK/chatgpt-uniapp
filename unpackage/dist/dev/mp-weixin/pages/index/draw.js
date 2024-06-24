"use strict";
const common_vendor = require("../../common/vendor.js");
const drawStyleItem = () => "../../components/draw-style-item/draw-style-item.js";
const _sfc_main = {
  components: {
    drawStyleItem
  },
  data() {
    return {
      swiperHeight: "120vh",
      defaultMsg: "1个美女,黑头发,穿着白裙子,大眼睛,上身特写,蓝天白云,青山绿水",
      items: ["文字绘图", "一键二次元"],
      imageList: [],
      imageSizeSelect: null,
      typeInfoList: [],
      typeInfoSelect: null,
      current: 0,
      activeColor: "#000000",
      styleType: "text",
      paramsMap: null,
      prompt: "",
      popupMessage: "",
      image: {
        prompt: "超清,轮廓分明,极其详细的CG,人物动漫化,背景动漫化,极致细节,最好的质量,动态角度",
        tmpImgUrl: "",
        imageList: [],
        paramsMap: null,
        imageSizeSelect: null,
        typeInfoList: [],
        typeInfoSelect: null,
        //和原图的相似度
        similarity: 0.35
      },
      doubleClick: false,
      myCanvas: null,
      myCanvasShow: false
    };
  },
  onShow() {
    const task = getApp().globalData.reDrawTask;
    console.log(111);
    if (task !== null) {
      this.imageSizeSelect = task.imageSizeSelect;
      this.typeInfoSelect = task.typeInfoSelect;
      if (task.drawType === "TEXT_TO_IMAGE") {
        this.prompt = task.prompt;
        this.current = 0;
      } else {
        this.current = 1;
      }
      this.$nextTick(() => {
        const childInstances = this.$refs;
        console.log("childInstances", childInstances);
        console.log("drawStyleItemType", childInstances.drawStyleItemType);
        if (childInstances.drawStyleItemType === void 0) {
          return;
        }
        childInstances.drawStyleItemType.forEach((item) => {
          item.updateDefaultSelect(this.typeInfoSelect);
        });
        childInstances.drawStyleItemImage.forEach((item) => {
          item.updateDefaultSelect(this.imageSizeSelect);
        });
      });
      getApp().globalData.reDrawTask = null;
    }
    if (this.imageList.length <= 0) {
      common_vendor.index.draw.drawQueryStyle(this, (res) => {
        this.imageList = res.data.data.styleResp.imageList;
        this.typeInfoList = res.data.data.styleResp.typeInfoList;
      });
    }
    if (this.image.imageList.length <= 0) {
      common_vendor.index.imageDraw.drawQueryStyle(this, (res) => {
        this.image.imageList = res.data.data.styleResp.imageList;
        this.image.typeInfoList = res.data.data.styleResp.typeInfoList;
      });
    }
  },
  onLoad() {
    this.myCanvas = common_vendor.index.createCanvasContext("myCanvas", this);
  },
  methods: {
    scroll() {
      console.log("scroll");
    },
    clearImage() {
      this.image.tmpImgUrl = "";
    },
    chooseImage() {
      const that = this;
      console.log("chooseImage");
      common_vendor.index.chooseImage({
        count: 1,
        //默认9
        sizeType: ["compressed"],
        //可以指定是原图还是压缩图，默认二者都有
        // sourceType: ['album'], //从相册选择
        success: function(res) {
          console.log("chooseImage", res.tempFilePaths[0]);
          that.image.tmpImgUrl = res.tempFilePaths[0];
          common_vendor.index.getImageInfo({
            src: that.image.tmpImgUrl,
            success: function(image) {
              console.log("image", image);
              if (image.height / image.width >= 1.33) {
                that.image.imageSizeSelect = "vertical";
              } else if (image.height / image.width <= 0.75) {
                that.image.imageSizeSelect = "horizontal";
              } else {
                that.image.imageSizeSelect = "square";
              }
            }
          });
        }
      });
    },
    ontabtap(e) {
      let index = e.target.dataset.current || e.currentTarget.dataset.current;
      this.current = index;
    },
    ontabchange(e) {
      let index = e.target.current || e.detail.current;
      this.current = index;
    },
    popupMaskClick() {
      console.log("popupMaskClick");
      this.$refs.message.close();
    },
    intputSData() {
      this.prompt = this.defaultMsg;
    },
    intputFData() {
      this.prompt = "最好的质量，超细节，插图，极其详细的CG，晶体纹理头发，玻璃头发，晶体纹理身体，身体的宝石，晶体纹理皮肤，晶体衣服，闪光，镜头光晕，光漏，细节长裙，仙女，凌乱的头发，动态角度，美丽的宝石天空，美丽细致的眼睛，过度曝光，水晶质地的花";
    },
    clearImagePrompt() {
      this.image.prompt = "";
    },
    clearPrompt() {
      this.prompt = "";
    },
    onClickItem(e) {
      if (this.current !== e.currentIndex) {
        this.current = e.currentIndex;
      }
    },
    selectImageSize(item) {
      if (item.code) {
        console.log("selectImageSize", item);
        this.imageSizeSelect = item.code;
      }
    },
    imageSelectImageSize(item) {
      if (item.code) {
        console.log("imageSelectImageSize", item);
        this.image.imageSizeSelect = item.code;
      }
    },
    changeProgress(progress) {
      this.image.similarity = progress / 100;
    },
    imageSelectTypeInfo(item) {
      if (item.code) {
        console.log("imageSelectTypeInfo", item);
        this.image.typeInfoSelect = item.code;
      }
    },
    selectTypeInfo(item) {
      if (item.code) {
        console.log("selectTypeInfo", item);
        this.typeInfoSelect = item.code;
      }
    },
    imageDrawStart() {
      const that = this;
      setTimeout(() => {
        this.doubleClick = false;
      }, 1e3);
      if (this.doubleClick) {
        return;
      }
      this.doubleClick = true;
      if (that.image.tmpImgUrl == "") {
        this.popupMessage = "请先上传图片";
        this.$refs.message.open();
        this.closepopupMessage();
        return;
      }
      const res = common_vendor.index.getFileSystemManager().readFileSync(that.image.tmpImgUrl, "base64");
      const requestData = {
        "imageSizeSelect": this.image.imageSizeSelect,
        "typeInfoSelect": this.image.typeInfoSelect,
        "paramsMap": this.image.paramsMap,
        "prompt": this.image.prompt,
        "imgBase64": res,
        "similarity": this.image.similarity
      };
      common_vendor.index.imageDraw.drawCreateTask(that, requestData, (res2) => {
        common_vendor.index.navigateTo({
          url: "/pages/user/drawTask?current=1"
        });
      });
    },
    drawStart() {
      setTimeout(() => {
        this.doubleClick = false;
      }, 1e3);
      if (this.doubleClick) {
        return;
      }
      this.doubleClick = true;
      const requestData = {
        "imageSizeSelect": this.imageSizeSelect,
        "typeInfoSelect": this.typeInfoSelect,
        "paramsMap": this.paramsMap,
        "prompt": this.prompt
      };
      if (this.prompt == "") {
        this.popupMessage = "请输入描述内容";
        this.$refs.message.open();
        this.closepopupMessage();
        return;
      }
      common_vendor.index.draw.drawCreateTask(this, requestData, (res) => {
        common_vendor.index.navigateTo({
          url: "/pages/user/drawTask?current=1"
        });
      });
    },
    closepopupMessage() {
      setTimeout(() => {
        this.$refs.message.close();
      }, 2e3);
    }
  }
};
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_draw_style_item2 = common_vendor.resolveComponent("draw-style-item");
  const _easycom_draw_style_bigItem2 = common_vendor.resolveComponent("draw-style-bigItem");
  const _easycom_my_progress2 = common_vendor.resolveComponent("my-progress");
  const _easycom_uni_popup_message2 = common_vendor.resolveComponent("uni-popup-message");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  (_easycom_uni_icons2 + _easycom_draw_style_item2 + _easycom_draw_style_bigItem2 + _easycom_my_progress2 + _easycom_uni_popup_message2 + _easycom_uni_popup2)();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_draw_style_item = () => "../../components/draw-style-item/draw-style-item.js";
const _easycom_draw_style_bigItem = () => "../../components/draw-style-bigItem/draw-style-bigItem.js";
const _easycom_my_progress = () => "../../components/my-progress/my-progress.js";
const _easycom_uni_popup_message = () => "../../uni_modules/uni-popup/components/uni-popup-message/uni-popup-message.js";
const _easycom_uni_popup = () => "../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
if (!Math) {
  (_easycom_uni_icons + _easycom_draw_style_item + _easycom_draw_style_bigItem + _easycom_my_progress + _easycom_uni_popup_message + _easycom_uni_popup)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.f($data.items, (tab, index, i0) => {
      return {
        a: common_vendor.t(tab),
        b: common_vendor.n($data.current == index ? "uni-tab-item-title-active" : ""),
        c: index
      };
    }),
    b: common_vendor.o((...args) => $options.ontabtap && $options.ontabtap(...args)),
    c: $data.current === 0
  }, $data.current === 0 ? common_vendor.e({
    d: "请输入画面关键字，尽量使用词组，用逗号分隔，例如：" + $data.defaultMsg,
    e: $data.prompt,
    f: common_vendor.o(($event) => $data.prompt = $event.detail.value),
    g: common_vendor.o($options.clearPrompt),
    h: common_vendor.p({
      type: "clear",
      size: "24",
      color: "#757575"
    }),
    i: common_vendor.o((...args) => $options.intputSData && $options.intputSData(...args)),
    j: common_vendor.o((...args) => $options.intputFData && $options.intputFData(...args)),
    k: $data.typeInfoList.length > 0
  }, $data.typeInfoList.length > 0 ? {
    l: common_vendor.sr("drawStyleItemType", "7a809c38-1"),
    m: common_vendor.o($options.selectTypeInfo),
    n: common_vendor.p({
      options: $data.typeInfoList,
      showItem: true,
      defaultSelect: $data.typeInfoSelect
    })
  } : {}, {
    o: $data.imageList.length > 0
  }, $data.imageList.length > 0 ? {
    p: common_vendor.sr("drawStyleItemImage", "7a809c38-2"),
    q: common_vendor.o($options.selectImageSize),
    r: common_vendor.p({
      options: $data.imageList,
      showItem: true,
      defaultSelect: $data.imageSizeSelect
    })
  } : {}) : {}, {
    s: $data.current === 1
  }, $data.current === 1 ? common_vendor.e({
    t: $data.image.typeInfoList.length > 0
  }, $data.image.typeInfoList.length > 0 ? {
    v: common_vendor.sr("imageDrawStyleItemType", "7a809c38-3"),
    w: common_vendor.o($options.imageSelectTypeInfo),
    x: common_vendor.p({
      columnCount: 2,
      options: $data.image.typeInfoList,
      showItem: true,
      defaultSelect: $data.image.typeInfoSelect
    })
  } : {}, {
    y: $data.image.tmpImgUrl == "",
    z: common_vendor.o((...args) => $options.chooseImage && $options.chooseImage(...args)),
    A: $data.image.tmpImgUrl != "",
    B: common_vendor.o($options.clearImage),
    C: common_vendor.p({
      type: "clear",
      size: "30",
      color: "#757575"
    }),
    D: $data.image.tmpImgUrl != "",
    E: $data.image.tmpImgUrl,
    F: $data.image.tmpImgUrl == "",
    G: common_vendor.o($options.changeProgress)
  }) : {}, {
    H: common_vendor.o((...args) => $options.scroll && $options.scroll(...args)),
    I: $data.current == 0,
    J: common_vendor.o(($event) => $options.drawStart()),
    K: $data.current == 1,
    L: common_vendor.o(($event) => $options.imageDrawStart()),
    M: common_vendor.p({
      type: "error",
      ["before-close"]: "false",
      message: $data.popupMessage,
      duration: "2000"
    }),
    N: common_vendor.sr("message", "7a809c38-6"),
    O: common_vendor.p({
      type: "message",
      ["mask-click"]: true
    }),
    P: common_vendor.o((...args) => $options.popupMaskClick && $options.popupMaskClick(...args)),
    Q: $data.myCanvasShow
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/Users/ken/Documents/HBuilderProjects/chatgpt-uniapp/pages/index/draw.vue"]]);
wx.createPage(MiniProgramPage);
