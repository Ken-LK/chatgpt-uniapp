"use strict";
const common_vendor = require("../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      robatIcon: "",
      myIcon: getApp().globalData.isBlank(common_vendor.index.getStorageSync(getApp().globalData.avatarUrlCacheName)) ? "../static/img/my_ask.jpg" : common_vendor.index.getStorageSync(getApp().globalData.avatarUrlCacheName),
      guideInfo: null,
      voiceOpen: getApp().globalData.isBlank(common_vendor.index.getStorageSync(getApp().globalData.audioSwitchName)) ? false : common_vendor.index.getStorageSync(getApp().globalData.audioSwitchName),
      play: false,
      getVoiceData: false,
      messageContentOrigin: "",
      audioContext: null,
      //https://cy.wtianyu.com/ai/voice/hahah.mp3
      audioSrc: null,
      audioPlayTimer: null,
      audioTextTimeList: null,
      audioTextTimeListCurrent: 0,
      voiceType: null,
      //禁止语音播放快速切换，间隔1秒
      banDoubleClickPlay: false
    };
  },
  props: ["message", "id", "currentMax"],
  // computed: mapState(['user']),
  beforeUpdate() {
    this.initGuideInfo();
  },
  computed: {
    calculatedWidth() {
      return `calc(100vw - 120px)`;
    },
    leftWidthReal() {
      if (this.message.user === "customer") {
        return "50px";
      } else {
        return "60px";
      }
    },
    rightWidthReal() {
      if (this.message.user === "home") {
        return "50px";
      } else {
        return "60px";
      }
    }
  },
  created() {
    console.log("beforeUpdate_created");
    this.messageContentOrigin = this.message.content;
    this.initGuideInfo();
  },
  updated() {
  },
  methods: {
    updateUi: function() {
      this.voiceOpen = getApp().globalData.isBlank(common_vendor.index.getStorageSync(getApp().globalData.audioSwitchName)) ? false : common_vendor.index.getStorageSync(getApp().globalData.audioSwitchName);
    },
    playVoice: function() {
      console.log("playVoice", this.play);
      const that = this;
      if (!this.banDoubleClickPlay) {
        this.banDoubleClickPlay = true;
        setTimeout(() => {
          that.banDoubleClickPlay = false;
        }, 1e3);
      } else {
        return;
      }
      this.audioTextTimeListCurrent = 0;
      if (that.message.content.indexOf("```") > -1) {
        common_vendor.index.showModal({
          content: "文本中包含代码信息，不支持语音播报",
          showCancel: false
        });
        return;
      }
      if (this.messageContentOrigin === "") {
        this.messageContentOrigin = this.message.content;
      }
      const newVoiceType = getApp().globalData.isBlank(common_vendor.index.getStorageSync(getApp().globalData.audioSexName)) ? "M" : common_vendor.index.getStorageSync(getApp().globalData.audioSexName);
      if (this.voiceType === null) {
        this.voiceType = newVoiceType;
      } else if (this.voiceType !== newVoiceType) {
        this.voiceType = newVoiceType;
        common_vendor.index.audioContextMap.delete(this.audioSrc + "_" + this.id);
        this.audioSrc = null;
      }
      if (this.play) {
        const audioContext = common_vendor.index.audioContextMap.get(this.audioSrc + "_" + this.id);
        if (audioContext === null || audioContext === void 0)
          return;
        audioContext.stop();
        this.play = false;
      } else {
        common_vendor.index.audioContextMap.forEach((value, key) => {
          if (key !== that.audioSrc + "_" + that.id) {
            value.stop();
          }
        });
        this.play = true;
        this.getVoiceData = false;
        if (this.audioSrc === null) {
          const requestData = {
            text: this.messageContentOrigin,
            voiceType: this.voiceType
          };
          common_vendor.index.audio.textToAudio(requestData, (res) => {
            that.audioSrc = res.data.data.audioUrl;
            that.audioTextTimeList = res.data.data.audioTextTimeList;
            common_vendor.index.audioContextMap.set(that.audioSrc + "_" + that.id, common_vendor.index.createInnerAudioContext());
            const audioContext = common_vendor.index.audioContextMap.get(that.audioSrc + "_" + that.id);
            audioContext.src = that.audioSrc;
            that.getVoiceData = true;
            audioContext.play();
            audioContext.onEnded((res2) => {
              console.log("onEnded");
              that.play = false;
              this.message.content = this.messageContentOrigin;
            });
            audioContext.onTimeUpdate(() => {
              const audioContext2 = common_vendor.index.audioContextMap.get(that.audioSrc + "_" + that.id);
              console.log("onTimeUpdate", audioContext2.currentTime);
              that.getVoiceData = true;
              that.play = true;
              if (this.audioTextTimeList === null || this.audioTextTimeListCurrent >= this.audioTextTimeList.length) {
                return;
              }
              let objA = this.audioTextTimeList[this.audioTextTimeListCurrent];
              console.log(audioContext2.currentTime * 1e3, objA.timeStart);
              if (audioContext2.currentTime * 1e3 > objA.timeStart) {
                this.message.content = this.messageContentOrigin.replace(
                  objA.text,
                  "<span style='color: #4fbbbf;'>" + objA.text + "</span>"
                );
                this.audioTextTimeListCurrent++;
              }
            });
            audioContext.onStop((res2) => {
              console.log("onStop");
              that.play = false;
              this.message.content = this.messageContentOrigin;
            });
            audioContext.onError((res2) => {
              console.log("audio_error", res2);
              that.getVoiceData = false;
              that.play = false;
              that.audioSrc = null;
              common_vendor.index.showModal({
                content: "语音播放异常，请稍后再试",
                showCancel: false
              });
            });
          }, (error) => {
            that.play = false;
          });
        } else {
          const audioContext = common_vendor.index.audioContextMap.get(that.audioSrc + "_" + that.id);
          audioContext.src = that.audioSrc;
          that.getVoiceData = true;
          audioContext.play();
        }
      }
    },
    initGuideInfo: function() {
      if (this.id + 1 === this.currentMax && this.guideInfo === null) {
        common_vendor.index.http.guide(null, (res) => {
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
      if (this.messageContentOrigin === "") {
        this.messageContentOrigin = this.message.content;
      }
      common_vendor.index.setClipboardData({
        data: this.messageContentOrigin
      });
    }
  }
};
if (!Array) {
  const _easycom_ua_markdown2 = common_vendor.resolveComponent("ua-markdown");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_wave_animation_up2 = common_vendor.resolveComponent("wave-animation-up");
  const _easycom_loading_dots2 = common_vendor.resolveComponent("loading-dots");
  (_easycom_ua_markdown2 + _easycom_uni_icons2 + _easycom_wave_animation_up2 + _easycom_loading_dots2)();
}
const _easycom_ua_markdown = () => "./ua-markdown/ua-markdown.js";
const _easycom_uni_icons = () => "../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_wave_animation_up = () => "./wave-animation-up/wave-animation-up.js";
const _easycom_loading_dots = () => "./loading-dots/loading-dots.js";
if (!Math) {
  (_easycom_ua_markdown + _easycom_uni_icons + _easycom_wave_animation_up + _easycom_loading_dots)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $props.message.user == "home"
  }, $props.message.user == "home" ? {} : {}, {
    b: common_vendor.s(`width: ${$options.leftWidthReal}`),
    c: !$props.message.loading
  }, !$props.message.loading ? common_vendor.e({
    d: $props.message.user == "customer"
  }, $props.message.user == "customer" ? {
    e: common_vendor.t($props.message.content),
    f: common_vendor.n("m-content-head-" + $props.message.user),
    g: common_vendor.o(($event) => $options.copy($props.message.user))
  } : {}, {
    h: $props.message.user == "home"
  }, $props.message.user == "home" ? common_vendor.e({
    i: common_vendor.p({
      source: $props.message.content,
      width: $options.calculatedWidth,
      showLine: false
    }),
    j: $data.voiceOpen
  }, $data.voiceOpen ? {
    k: common_vendor.o($options.playVoice),
    l: common_vendor.p({
      type: `${$data.play ? "sound-filled" : "sound"}`,
      size: "30"
    }),
    m: common_vendor.p({
      play: $data.play,
      getVoiceData: $data.getVoiceData
    })
  } : {}, {
    n: common_vendor.n("m-content-head-" + $props.message.user),
    o: common_vendor.o(($event) => $options.copy($props.message.user)),
    p: common_vendor.s(`padding-bottom: ${$data.voiceOpen ? "10px" : ""}`)
  }) : {}, {
    q: $props.message.user == "customer" ? 1 : "",
    r: common_vendor.s(`padding-bottom: ${$props.currentMax < $props.id + 1 && $props.message.user == "home" ? "0px" : "0px"}`)
  }) : {}, {
    s: !$props.message.loading
  }, !$props.message.loading ? common_vendor.e({
    t: $props.message.user == "customer"
  }, $props.message.user == "customer" ? {
    v: $data.myIcon
  } : {}, {
    w: $props.message.user == "home"
  }, $props.message.user == "home" ? {} : {}, {
    x: common_vendor.s(`width: ${$options.rightWidthReal}`)
  }) : {}, {
    y: $props.message.loading
  }, $props.message.loading ? {} : {}, {
    z: "message" + $props.id,
    A: $props.currentMax === $props.id + 1 && $data.guideInfo !== null
  }, $props.currentMax === $props.id + 1 && $data.guideInfo !== null ? common_vendor.e({
    B: $data.guideInfo.title !== ""
  }, $data.guideInfo.title !== "" ? {
    C: common_vendor.t($data.guideInfo.title)
  } : {}, {
    D: $data.guideInfo.content !== ""
  }, $data.guideInfo.content !== "" ? {
    E: common_vendor.t($data.guideInfo.content)
  } : {}, {
    F: common_vendor.f($data.guideInfo.selectList, (item, index, i0) => {
      return {
        a: common_vendor.t(item),
        b: "3487a792-4-" + i0,
        c: common_vendor.o(($event) => $options.inputSelect(item), index),
        d: index
      };
    }),
    G: common_vendor.p({
      type: "right",
      size: "14"
    })
  }) : {});
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/Users/ken/Documents/HBuilderProjects/chatgpt-uniapp/components/messageshow.vue"]]);
wx.createComponent(Component);
