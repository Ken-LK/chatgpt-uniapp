"use strict";
const common_vendor = require("../../common/vendor.js");
var that;
const recorderManager = common_vendor.index.getRecorderManager();
const _sfc_main = {
  name: "nbVoiceRecord",
  /**
   * 录音交互动效组件
   * @property {Object} recordOptions 录音配置
   * @property {Object} btnStyle 按钮样式
   * @property {Object} btnHoverFontcolor 按钮长按时字体颜色
   * @property {String} btnHoverBgcolor 按钮长按时背景颜色
   * @property {String} btnDefaultText 按钮初始文字
   * @property {String} btnRecordingText 录制时按钮文字
   * @property {Boolean} vibrate 弹窗时是否震动
   * @property {String} popupTitle 弹窗顶部文字
   * @property {String} popupDefaultTips 录制时弹窗底部提示
   * @property {String} popupCancelTips 滑动取消时弹窗底部提示
   * @property {String} popupMaxWidth 弹窗展开后宽度
   * @property {String} popupMaxHeight 弹窗展开后高度
   * @property {String} popupFixBottom 弹窗展开后距底部高度
   * @property {String} popupBgColor 弹窗背景颜色
   * @property {String} lineHeight 声波高度
   * @property {String} lineStartColor 声波波谷时颜色色值
   * @property {String} lineEndColor 声波波峰时颜色色值
   * @event {Function} startRecord 开始录音回调
   * @event {Function} endRecord 结束录音回调
   * @event {Function} cancelRecord 滑动取消录音回调
   * @event {Function} stopRecord 主动停止录音
   */
  props: {
    recordOptions: {
      type: Object,
      default() {
        return {
          duration: 6e4,
          // frameSize: 20,
          format: "mp3"
        };
      }
    },
    btnStyle: {
      type: Object,
      default() {
        return {
          width: "100%",
          height: "80rpx",
          borderRadius: "20rpx",
          backgroundColor: "#fff",
          border: "1rpx solid whitesmoke",
          permisionState: false
        };
      }
    },
    btnHoverFontcolor: {
      type: String,
      default: "#000"
      // 颜色名称或16进制色值
    },
    btnHoverBgcolor: {
      type: String,
      default: "whitesmoke"
      // 颜色名称或16进制色值
    },
    btnDefaultText: {
      type: String,
      default: "长按开始录音"
    },
    btnRecordingText: {
      type: String,
      default: "录音中"
    },
    vibrate: {
      type: Boolean,
      default: true
    },
    popupTitle: {
      type: String,
      default: "正在录制音频"
    },
    popupDefaultTips: {
      type: String,
      default: "松手完成录音，上滑取消录音"
    },
    popupCancelTips: {
      type: String,
      default: "松手取消录音"
    },
    popupMaxWidth: {
      type: Number,
      default: 600
      // 单位为rpx
    },
    popupMaxHeight: {
      type: Number,
      default: 300
      // 单位为rpx
    },
    popupFixBottom: {
      type: Number,
      default: 200
      // 单位为rpx
    },
    popupBgColor: {
      type: String,
      default: "whitesmoke"
    },
    lineHeight: {
      type: Number,
      default: 50
      // 单位为rpx
    },
    lineStartColor: {
      type: String,
      default: "royalblue"
      // 颜色名称或16进制色值
    },
    lineEndColor: {
      type: String,
      default: "indianred"
      // 颜色名称或16进制色值
    }
  },
  data() {
    return {
      stopStatus: false,
      // 是否已被父页面通知主动结束录音
      btnTextContent: this.btnDefaultText,
      startTouchData: {},
      popupHeight: "0px",
      // 这是初始的高度
      recording: true,
      // 录音中
      recordPopupShow: false,
      recordTimeout: null
      // 录音定时器
    };
  },
  created() {
    that = this;
    this.checkPermission();
    recorderManager.onFrameRecorded((res) => {
      that.$emit("frameRecorded", res);
    });
    recorderManager.onStop((res) => {
      if (that.recordTimeout !== null) {
        clearTimeout(that.recordTimeout);
        that.recordTimeout = null;
      }
      if (that.recording) {
        that.$emit("endRecord", res);
      } else {
        that.recording = true;
        that.$emit("cancelRecord");
      }
    });
    recorderManager.onError((err) => {
      console.log("err:", err);
    });
  },
  computed: {},
  methods: {
    upx2px(upx) {
      return common_vendor.index.upx2px(upx) + "px";
    },
    async checkPermission() {
      common_vendor.index.authorize({
        scope: "scope.record",
        success: () => {
          this.permisionState = true;
        },
        fail() {
          common_vendor.index.showToast({
            title: "请授权使用录音",
            icon: "none"
          });
        }
      });
    },
    startRecord() {
      if (!this.permisionState) {
        this.checkPermission();
        return;
      }
      this.stopStatus = false;
      setTimeout(() => {
        this.popupHeight = this.upx2px(this.popupMaxHeight);
        setTimeout(() => {
          this.recordPopupShow = true;
          this.btnTextContent = this.btnRecordingText;
          if (this.vibrate) {
            common_vendor.index.vibrateShort();
          }
          recorderManager.start(this.recordOptions);
          this.recordTimeout = setTimeout(
            () => {
              this.stopRecord();
              this.recordTimeout = null;
            },
            this.recordOptions.duration ? this.recordOptions.duration : 6e5
          );
          this.$emit("startRecord");
        }, 100);
      }, 200);
    },
    endRecord() {
      if (this.stopStatus) {
        return;
      }
      this.popupHeight = "0px";
      this.recordPopupShow = false;
      this.btnTextContent = this.btnDefaultText;
      recorderManager.stop();
    },
    stopRecord() {
      this.endRecord();
      this.stopStatus = true;
    },
    touchStart(e) {
      this.startTouchData.clientX = e.changedTouches[0].clientX;
      this.startTouchData.clientY = e.changedTouches[0].clientY;
    },
    touchMove(e) {
      let touchData = e.touches[0];
      touchData.clientX - this.startTouchData.clientX;
      let moveY = touchData.clientY - this.startTouchData.clientY;
      if (moveY < -50) {
        if (this.vibrate && this.recording) {
          common_vendor.index.vibrateShort();
        }
        this.recording = false;
      } else {
        this.recording = true;
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t($data.btnTextContent),
    b: common_vendor.o((...args) => $options.startRecord && $options.startRecord(...args)),
    c: common_vendor.o((...args) => $options.touchStart && $options.touchStart(...args)),
    d: common_vendor.o((...args) => $options.touchMove && $options.touchMove(...args)),
    e: common_vendor.o((...args) => $options.endRecord && $options.endRecord(...args)),
    f: common_vendor.s($props.btnStyle),
    g: common_vendor.s({
      "--btn-hover-fontcolor": $props.btnHoverFontcolor,
      "--btn-hover-bgcolor": $props.btnHoverBgcolor
    }),
    h: $data.recordPopupShow
  }, $data.recordPopupShow ? common_vendor.e({
    i: common_vendor.t($props.popupTitle),
    j: $data.recording
  }, $data.recording ? {
    k: $options.upx2px($props.lineHeight),
    l: $props.lineStartColor,
    m: $props.lineEndColor
  } : {}, {
    n: !$data.recording
  }, !$data.recording ? {} : {}, {
    o: common_vendor.t($data.recording ? $props.popupDefaultTips : $props.popupCancelTips)
  }) : {}, {
    p: $data.popupHeight,
    q: $options.upx2px($props.popupMaxWidth),
    r: $options.upx2px($props.popupFixBottom),
    s: $props.popupBgColor
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/Users/ken/Documents/HBuilderProjects/chatgpt-uniapp/components/nb-voice-record/nb-voice-record.vue"]]);
wx.createComponent(Component);
