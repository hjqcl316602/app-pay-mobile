<script >
import Vue from "vue";

import Radio from "../components/Radio";
import Icon from "../components/Icon";
import configs from "../config";
import {
  uploadImage,
  uploadImageSpot,
  createDraw,
  getCardType
} from "../request";
import { Checker, funer, Hexer } from "store-es";
import { Accordion, Input, Upload, Confirm } from "store-vue-ui";
console.log(Confirm);
Vue.use(Accordion)
  .use(Accordion.Item)
  .use(Input)
  .use(Upload)
  .use(Confirm);

const CODE_TIME = 60 * 1000;
export default {
  name: "PageDraw",
  components: { Radio, Icon },
  data() {
    return {
      resource: {
        select: require("../images/icon-select.png"),
        selected: require("../images/icon-selected.png"),
        card: require("../images/icon-card.png"),
        wx: require("../images/icon-wx.png"),
        ali: require("../images/icon-ali.png"),
        union: require("../images/icon-union.png")
      },
      params: {
        type: "",
        popupSubmit: false,
        token: "",
        accessToken: "",
        fee: "",
        memId: "",
        subMemId: "",
        mobile: ""
      },
      wx: {
        wechat: "",
        wechatUrl: "",
        qrWeCodeUrl: ""
      },
      ali: {
        alipay: "",
        alipayUrl: "",
        alipayCodeUrl: "",
        alipayRealName: ""
      },
      card: {
        cardNo: "",
        bank: "",
        bankLogo: "",
        bankRealName: ""
      },
      union: {
        unionpay: "",
        unionpayUrl: "",
        unionpayCodeUrl: ""
      },
      message: {}
    };
  },
  mounted() {
    //console.log(this.$message.danger('cuo'));
  },
  activated() {},
  created() {
    this.initialize();
  },

  beforeRouteLeave(to, from, next) {
    if (this.params.popupSubmit) {
      this.params.popupSubmit = false;
      next(false);
    } else {
      next();
    }
  },
  methods: {
    async initialize() {
      // 得到上次的提现方式
      this.params.type = localStorage.getItem("app/draw/type") || "1";
      //console.log(this.params.type);

      this.params = Object.assign(this.params, this.$route.params);

      this.getMessage(this.analysisToken());
    },
    /**
     * 解析数据
     */

    analysisToken() {
      try {
        let hex = new Hexer();
        let hexToString = hex.decodeComponent(this.params.token);
        let message = JSON.parse(hexToString);
        return message;
      } catch (e) {
        this.$router.replace({
          name: "Error",
          query: { msg: "异常，请重试或联系客服！" }
        });
      }
    },

    /**
     * 参数的获取及整理
     */

    getMessage(params) {
      console.log(params);
      this.message = params || "";
      this.params.fee = params.fee || "";
      this.params.memId = params.memId || "";
      this.params.subMemId = params.subMemId || "";

      //手机号
      this.params.mobile = params.mobile || "";

      //微信
      this.wx.wechat = params.wechat || "";
      this.wx.wechatUrl = params.wechatUrl || "";
      this.wx.qrWeCodeUrl = params.qrWeCodeUrl || "";

      // 支付宝
      this.ali.alipay = params.alipay || "";
      this.ali.alipayUrl = params.alipayUrl || "";
      this.ali.alipayCodeUrl = params.alipayCodeUrl || "";
      this.ali.alipayRealName = params.alipayRealName || "";

      // 银行卡
      this.card.cardNo = params.cardNo || "";
      this.card.bank = params.bank || "";
      this.card.bankRealName = params.bankRealName || "";

      // 云闪付
      this.union.unionpay = params.unionpay || "";
      this.union.unionpayUrl = params.unionpayUrl || "";
      this.union.unionpayCodeUrl = params.unionpayCodeUrl || "";
      return this;
    },

    /**
     * 选择图片并上传
     */

    async selectImage(fromdata) {
      let type = this.params.type;
      let res = await uploadImageSpot(fromdata);
      if (!res["url"]) {
        this.$message.danger("二维码上传失败，请重试！");
        return;
      }
      if (!res["qr"]) {
        this.$message.warning("二维码识别失败，请重试！");
      }
      if (type === "2") {
        if (res["qr"] && !this.jageQrType(configs["QR"]["WX"], res["qr"])) {
          this.$message.danger("您上传的不是微信收款二维码，请重试");
          return;
        }
        this.wx.qrWeCodeUrl = res["url"];
        this.wx.wechatUrl = res["qr"];
      }
      if (type === "3") {
        if (res["qr"] && !this.jageQrType(configs["QR"]["ALI"], res["qr"])) {
          this.$message.danger("您上传的不是支付宝收款二维码，请重试");
          return;
        }
        this.ali.alipayCodeUrl = res["url"];
        this.ali.alipayUrl = res["qr"];
      }
      if (type === "4") {
        this.union.unionpayCodeUrl = res["url"];
        this.union.unionpayUrl = "";
      }
    },

    /**
     * 判断识别出来的二维码是否合法
     * arr 是指 需要判断的数组 url 是指判断的路径
     */
    jageQrType(arr, url) {
      if (!url) return false;
      for (let n = 0; n < arr.length; n++) {
        if (
          url.indexOf(arr[n]) > -1 ||
          url.indexOf(arr[n].toUpperCase()) > -1
        ) {
          return false;
        }
      }
      return true;
    },

    /**
     * 提现前验证
     */

    submitDraw() {
      let check = new Checker();
      if (this.params.type == 1) {
        check
          .set(
            this.card.bankRealName,
            true,
            "请输入您的真实姓名，确保和银行卡姓名一致"
          )
          .set(this.card.cardNo, true, "请输入您的银行卡号")
          .check("卡号格式错误，由15-19位数字组成", value => {
            return /^[0-9]{15,19}$/.test(value);
          })
          .set(
            this.card.bank,
            true,
            "开户行信息获取失败，更换其他的银行或重试"
          );
        if (check.pass) {
          this.params.popupSubmit = true;
        } else {
          this.$message.danger(check.message);
        }
      } else if (this.params.type == 2) {
        check
          .set(this.wx.wechat, true, "请输入您的微信账号")
          .set(this.wx.qrWeCodeUrl, true, "请上传您的微信收款二维码");
        if (check.pass) {
          this.params.popupSubmit = true;
        } else {
          this.$message.danger(check.message);
        }
      } else if (this.params.type == 3) {
        check
          .set(this.ali.alipay, true, "请输入您的支付宝账号")
          .set(this.ali.alipayRealName, true, "请输入您的支付宝真实姓名")
          .set(this.ali.alipayCodeUrl, true, "请上传您的支付宝收款二维码");
        if (check.pass) {
          this.params.popupSubmit = true;
        } else {
          this.$message.danger(check.message);
        }
      } else if (this.params.type == 4) {
        check
          .set(this.union.unionpay, true, "请输入您的云闪付账号")
          .set(this.union.unionpayCodeUrl, true, "请上传您的云闪付收款二维码");
        if (check.pass) {
          this.params.popupSubmit = true;
        } else {
          this.$message.danger(check.message);
        }
      } else {
        //this.$Toast("请您选择一种提现方式！");
      }
    },

    /***
     *
     * 提现提交
     */

    async confirmPopupSubmit() {
      let obj = (() => {
        let obj = {};
        obj["accessToken"] = this.params.accessToken;
        obj["mobile"] = this.message.mobile;
        obj["channelId"] = this.params.type;

        obj["cardNo"] = this.card.cardNo;
        obj["bank"] = this.card.bank;
        obj["bankRealName"] = this.card.bankRealName;

        obj["wechat"] = this.wx.wechat;
        obj["wechatUrl"] = this.wx.wechatUrl;
        obj["qrWeCodeUrl"] = this.wx.qrWeCodeUrl;

        obj["alipay"] = this.ali.alipay;
        obj["alipayUrl"] = this.ali.alipayUrl;
        obj["alipayCodeUrl"] = this.ali.alipayCodeUrl;
        obj["alipayRealName"] = this.ali.alipayRealName;

        obj["unionpay"] = this.union.unionpay;
        obj["unionpayUrl"] = this.union.unionpayUrl;
        obj["unionpayCodeUrl"] = this.union.unionpayCodeUrl;
        return obj;
      })();

      let res = await createDraw(obj);

      let leave = (() => {
        localStorage.setItem("app/draw/type", this.params.type);
        this.$router.replace({
          name: "DrawStatus",
          params: { accessToken: this.params.accessToken }
        });
      })();
    },

    getCardType: funer.debouncer(function() {
      getCardType({ cardNo: this.card.cardNo })
        .then(res => {
          this.card.bank = res["bankName"];
          this.card.bankLogo = res["bankLogo"];
        })
        .catch(res => {
          this.card.bank = "";
          this.card.bankLogo = "";
        });
    }, 1000)
  },
  watch: {
    ["card.cardNo"]: {
      handler(val) {
        this.getCardType();
      }
    }
  },
  beforeDestroy() {}
};
</script>
<template>
  <div class="vv-page ">
    <vui-confirm
      v-model="params.popupSubmit"
      title="提现信息确认"
      @ok="confirmPopupSubmit"
    >
      <template v-if="params.type == 1">
        <div class="vc-padding">
          <div class="vc-flex vc-margin--bm">
            <div
              style="width:60px;flex:none"
              class="vc-text--right vc-text--light vc-padding--rt"
            >
              金额
            </div>
            <div class="vc-flex--fit">
              <span class="">￥ {{ params.fee | strMoney }}</span>
            </div>
          </div>
          <div class="vc-flex vc-margin--bm">
            <div
              style="width:60px;flex:none"
              class="vc-text--right vc-text--light vc-padding--rt"
            >
              方式
            </div>
            <div class="vc-flex--fit">
              <span class="">银行卡</span>
            </div>
          </div>
          <div class="vc-flex vc-margin--bm">
            <div
              style="width:60px;flex:none"
              class="vc-text--right vc-text--light vc-padding--rt"
            >
              姓名
            </div>
            <div class="vc-flex--fit">
              <span class="">{{ card.bankRealName }}</span>
            </div>
          </div>
          <div class="vc-flex vc-margin--bm">
            <div
              style="width:60px;flex:none"
              class="vc-text--right vc-text--light vc-padding--rt"
            >
              卡号
            </div>
            <div class="vc-flex--fit">
              <span class="">{{ card.cardNo }}</span>
            </div>
          </div>
          <div class="vc-flex vc-margin--bm">
            <div
              style="width:60px;flex:none"
              class="vc-text--right vc-text--light vc-padding--rt"
            >
              开户行
            </div>
            <div class="vc-flex--fit">
              <span class="">{{ card.bank }}</span>
            </div>
          </div>
          <div class="vc-flex vc-margin--bm">
            <div
              style="width:60px;flex:none"
              class="vc-text--right vc-text--light vc-padding--rt vc-text--danger"
            >
              温馨提示
            </div>
            <div class="vc-flex--fit">
              <span class=" vc-text--danger"
                >请确保您输入的银行卡号、真实姓名是真实有效，否则会导致提现失败</span
              >
            </div>
          </div>
        </div>
      </template> 
      <template v-if="params.type == 2">
        <div class="vc-padding">
          <div class="vc-flex vc-margin--bm">
            <div
              style="width:60px;flex:none"
              class="vc-text--right vc-text--light vc-padding--rt"
            >
              金额
            </div>
            <div class="vc-flex--fit">
              <span class="">￥ {{ params.fee | strMoney }}</span>
            </div>
          </div>
          <div class="vc-flex vc-margin--bm">
            <div
              style="width:60px;flex:none"
              class="vc-text--right vc-text--light vc-padding--rt"
            >
              方式
            </div>
            <div class="vc-flex--fit">
              <span class="">微信</span>
            </div>
          </div>
          <div class="vc-flex vc-margin--bm">
            <div
              style="width:60px;flex:none"
              class="vc-text--right vc-text--light vc-padding--rt"
            >
              账号
            </div>
            <div class="vc-flex--fit">
              <span class="">{{ wx.wechat }}</span>
            </div>
          </div>
          <div class="vc-flex vc-margin--bm">
            <div
              style="width:60px;flex:none"
              class="vc-text--right vc-text--light vc-padding--rt"
            >
              二维码
            </div>
            <div class="vc-flex--fit">
              <img
                :src="wx.qrWeCodeUrl"
                v-css="{ height: '200px', width: 'auto' }"
              />
            </div>
          </div>
          <div class="vc-flex vc-margin--bm" v-if="wx['wechatUrl']">
            <div
              style="width:60px;flex:none"
              class="vc-text--right vc-text--light vc-padding--rt vc-text--danger"
            >
              温馨提示
            </div>
            <div class="vc-flex--fit">
              <span class=" vc-text--danger"
                >请确保您上传的微信收款二维码、微信账号真实有效，否则会导致提现失败</span
              >
            </div>
          </div>
          <div class="vc-flex vc-margin--bm" v-else>
            <div
              style="width:60px;flex:none"
              class="vc-text--right vc-text--light vc-padding--rt vc-text--danger"
            >
              提示
            </div>
            <div class="vc-flex--fit">
              <p>
                <span class="vc-text--danger">
                  您上传的微信收款二维码未识别成功！</span
                >
              </p>
              <p>
                <span class=" vc-text--danger"
                  >您是否确认您上传的收款二维码能正常收款? 否则请重试</span
                >
              </p>
            </div>
          </div>
        </div>
      </template>
      <template v-if="params.type == 3">
        <div class="vc-padding">
          <div class="vc-flex vc-margin--bm">
            <div
              style="width:60px;flex:none"
              class="vc-text--right vc-text--light vc-padding--rt"
            >
              金额
            </div>
            <div class="vc-flex--fit">
              <span class="">￥ {{ params.fee | strMoney }}</span>
            </div>
          </div>
          <div class="vc-flex vc-margin--bm">
            <div
              style="width:60px;flex:none"
              class="vc-text--right vc-text--light vc-padding--rt"
            >
              方式
            </div>
            <div class="vc-flex--fit">
              <span class="">支付宝</span>
            </div>
          </div>
          <div class="vc-flex vc-margin--bm">
            <div
              style="width:60px;flex:none"
              class="vc-text--right vc-text--light vc-padding--rt"
            >
              姓名
            </div>
            <div class="vc-flex--fit">
              <span class="">{{ ali.alipayRealName }}</span>
            </div>
          </div>
          <div class="vc-flex vc-margin--bm">
            <div
              style="width:60px;flex:none"
              class="vc-text--right vc-text--light vc-padding--rt"
            >
              账号
            </div>
            <div class="vc-flex--fit">
              <span class="">{{ ali.alipay }}</span>
            </div>
          </div>
          <div class="vc-flex vc-margin--bm">
            <div
              style="width:60px;flex:none"
              class="vc-text--right vc-text--light vc-padding--rt"
            >
              二维码
            </div>
            <div class="vc-flex--fit">
              <img
                :src="ali.alipayCodeUrl"
                v-css="{ height: '200px', width: 'auto' }"
              />
            </div>
          </div>
          <div class="vc-flex vc-margin--bm" v-if="ali['alipayUrl']">
            <div
              style="width:60px;flex:none"
              class="vc-text--right vc-text--light vc-padding--rt vc-text--danger"
            >
              温馨提示
            </div>
            <div class="vc-flex--fit">
              <span class=" vc-text--danger"
                >请确保您上传的支付宝收款二维码、支付宝姓名、支付宝账号真实有效，否则会导致提现失败</span
              >
            </div>
          </div>
          <div class="vc-flex vc-margin--bm" v-else>
            <div
              style="width:60px;flex:none"
              class="vc-text--right vc-text--light vc-padding--rt vc-text--danger"
            >
              提示
            </div>
            <div class="vc-flex--fit">
              <p>
                <span class="vc-text--danger">
                  您上传的支付宝收款二维码未识别成功！</span
                >
              </p>
              <p>
                <span class=" vc-text--danger"
                  >您是否确认您上传的收款二维码能正常收款? 否则请重试</span
                >
              </p>
            </div>
          </div>
        </div>
      </template>
      <template v-if="params.type == 4">
        <div class="vc-padding">
          <div class="vc-flex vc-margin--bm">
            <div
              style="width:60px;flex:none"
              class="vc-text--right vc-text--light vc-padding--rt"
            >
              金额
            </div>
            <div class="vc-flex--fit">
              <span class="">￥ {{ params.fee | strMoney }}</span>
            </div>
          </div>
          <div class="vc-flex vc-margin--bm">
            <div
              style="width:60px;flex:none"
              class="vc-text--right vc-text--light vc-padding--rt"
            >
              方式
            </div>
            <div class="vc-flex--fit">
              <span class="">云闪付</span>
            </div>
          </div>
          <div class="vc-flex vc-margin--bm">
            <div
              style="width:60px;flex:none"
              class="vc-text--right vc-text--light vc-padding--rt"
            >
              账号
            </div>
            <div class="vc-flex--fit">
              <span class="">{{ union.unionpay }}</span>
            </div>
          </div>
          <div class="vc-flex vc-margin--bm">
            <div
              style="width:60px;flex:none"
              class="vc-text--right vc-text--light vc-padding--rt"
            >
              二维码
            </div>
            <div class="vc-flex--fit">
              <img
                :src="union.unionpayCodeUrl"
                v-css="{ height: '200px', width: 'auto' }"
              />
            </div>
          </div>
          <div class="vc-flex vc-margin--bm" v-if="unionpay['unionpayUrl']">
            <div
              style="width:60px;flex:none"
              class="vc-text--right vc-text--light vc-padding--rt vc-text--danger"
            >
              温馨提示
            </div>
            <div class="vc-flex--fit">
              <span class=" vc-text--danger"
                >请确保您上传的云闪付收款二维码、云闪付账号真实有效，否则会导致提现失败</span
              >
            </div>
          </div>
          <div class="vc-flex vc-margin--bm" v-else>
            <div
              style="width:60px;flex:none"
              class="vc-text--right vc-text--light vc-padding--rt vc-text--danger"
            >
              提示
            </div>
            <div class="vc-flex--fit">
              <p>
                <span class="vc-text--danger">
                  您上传的云闪付收款二维码未识别成功！</span
                >
              </p>
              <p>
                <span class=" vc-text--danger"
                  >您是否确认您上传的收款二维码能正常收款? 否则请重试</span
                >
              </p>
            </div>
          </div>
        </div>
      </template>
    </vui-confirm>

    <div class="vc-fluid--h-min vp-bg vc-padding__lg">
      <div class="vc-margin__lg--bm" v-if="false">
        <span class="vc-text--bold vc-text--light">账号 </span>
        <span class="">{{ params.subMemId }}</span>
      </div>
      <div class="vc-margin__lg--bm">
        <div class="vc-margin--bm" v-if="false">
          <span class="vc-text--bold   vc-text--light">金额</span>
        </div>
        <div class="vc-text--center">
          <span class="vv-icon vv-icon--money"></span
          ><span style="font-size: 40px;line-height:60px">
            {{ params.fee | strMoney }}</span
          >
        </div>
      </div>

      <div class="vc-margin__lg--bm">
        <vui-accordion v-model="params.type">
          <vui-accordion-item name="1" :max-height="300">
            <div
              slot="header"
              class="vc-flex--between-center vc-border--bm vc-padding--ud"
            >
              <div class="vc-flex vc-items--center">
                <vui-image
                  width="24px"
                  height="24px"
                  fill-type="cover"
                  :src="resource.card"
                  alignType="center"
                  :lazy="false"
                ></vui-image>
                <span class="vc-margin--lt">银行卡</span>
              </div>
              <div>
                <Icon
                  v-if="params.type == 1"
                  name="icon-radio-button-on"
                  color="#118eea"
                  :size="20"
                ></Icon>
                <Icon
                  v-else
                  name="icon-radio-button-off-out"
                  color="#dedede"
                  :size="20"
                ></Icon>
              </div>
            </div>
            <div slot="panel">
              <div class="vc-padding--ud vc-border--bm">
                <div class="vc-margin--bm">
                  <vui-input
                    border-type="bottom"
                    border-weight-type="thin"
                    align="right"
                    v-model="card.bankRealName"
                    placeholder="请输入您的银行卡真实姓名"
                  >
                    <div slot="prepend" style="line-height:36px">
                      <span class="vc-text--danger">*</span>
                      <span class="vc-text--bold vc-text--sm  vc-text--light"
                        >姓名</span
                      >
                    </div>
                  </vui-input>
                </div>
                <div class="vc-margin--bm">
                  <vui-input
                    border-type="bottom"
                    border-weight-type="thin"
                    align="right"
                    v-model="card.cardNo"
                    placeholder="请输入您的银行卡号"
                  >
                    <div slot="prepend" style="line-height:36px">
                      <span class="vc-text--danger">*</span>
                      <span class="vc-text--bold vc-text--sm  vc-text--light"
                        >卡号</span
                      >
                    </div>
                  </vui-input>
                </div>
                <div class="vc-flex--between-center">
                  <div style="line-height:36px">
                    <span class="vc-text--danger">*</span>
                    <span class="vc-text--bold vc-text--sm  vc-text--light"
                      >开户行</span
                    >
                  </div>
                  <div v-if="card.bankLogo" class="vc-flex--fit">
                    <vui-image
                      width="100%"
                      height="36px"
                      fill-type="height"
                      :src="card.bankLogo"
                      alignType="right"
                      :lazy="false"
                    ></vui-image>
                  </div>
                </div>
              </div>
            </div>
          </vui-accordion-item>
          <vui-accordion-item name="2" :max-height="300">
            <div
              slot="header"
              class="vc-flex--between-center vc-border--bm vc-padding--ud"
            >
              <div class="vc-flex vc-items--center">
                <vui-image
                  width="24px"
                  height="24px"
                  fill-type="cover"
                  :src="resource.wx"
                  alignType="center"
                  :lazy="false"
                ></vui-image>
                <span class="vc-margin--lt">微信</span>
              </div>
              <div>
                <Icon
                  v-if="params.type == 2"
                  name="icon-radio-button-on"
                  color="#118eea"
                  :size="20"
                ></Icon>
                <Icon
                  v-else
                  name="icon-radio-button-off-out"
                  color="#dedede"
                  :size="20"
                ></Icon>
              </div>
            </div>
            <div slot="panel">
              <div class="vc-padding--ud vc-border--bm">
                <div class="vc-margin--bm">
                  <vui-input
                    border-type="bottom"
                    border-weight-type="thin"
                    align="right"
                    v-model="wx.wechat"
                    placeholder="请输入您的微信账号"
                  >
                    <div slot="prepend" style="line-height:36px">
                      <span class="vc-text--danger">*</span>
                      <span class="vc-text--bold vc-text--sm  vc-text--light"
                        >微信账号</span
                      >
                    </div>
                  </vui-input>
                </div>

                <div class="vc-flex vc-content--between">
                  <div style="line-height:36px">
                    <span class="vc-text--danger">*</span>
                    <span class="vc-text--bold vc-text--sm  vc-text--light"
                      >收款二维码</span
                    >
                  </div>

                  <div>
                    <vui-upload @change="selectImage($event, 'wx')">
                      <div
                        style="width:36px;height:36px"
                        v-if="!wx.qrWeCodeUrl"
                      >
                        <svg
                          viewBox="0 0 1024 1024"
                          version="1.1"
                          p-id="1903"
                          height="100%"
                          width="100%"
                        >
                          <path
                            xmlns="http://www.w3.org/2000/svg"
                            d="M610.133333 912.213333h70.4v28.586667H610.133333zM224 83.626667H294.4v28.586666H224zM736.426667 83.626667h70.4v28.586666h-70.4zM911.786667 736.853333h28.586666v70.4h-28.586666zM911.786667 905.386667a6.826667 6.826667 0 0 1-6.826667 6.826666h-42.666667V938.666667h56.32a21.333333 21.333333 0 0 0 21.333334-21.333334v-54.186666h-28.586667zM350.293333 912.213333h77.653334v28.586667H350.293333zM483.84 912.213333h70.4v28.586667h-70.4zM610.133333 83.626667h70.4v28.586666H610.133333zM919.04 85.333333h-56.32v28.586667h42.666667a6.4 6.4 0 0 1 4.693333 0 6.4 6.4 0 0 1 0 4.693333v49.92H938.666667V104.96a21.333333 21.333333 0 0 0-19.626667-19.626667zM911.786667 224.426667h28.586666v70.4h-28.586666zM911.786667 350.72h28.586666v77.653333h-28.586666zM911.786667 610.133333h28.586666v70.4h-28.586666zM911.786667 483.84h28.586666v70.4h-28.586666zM736.426667 912.213333h70.4v28.586667h-70.4zM83.626667 350.72h28.586666v77.653333h-28.586666zM83.626667 224.426667h28.586666v70.4h-28.586666zM83.626667 483.84h28.586666v70.4h-28.586666zM350.293333 83.626667h77.653334v28.586666H350.293333zM483.84 83.626667h70.4v28.586666h-70.4zM224 912.213333H294.4v28.586667H224zM83.626667 610.133333h28.586666v70.4h-28.586666zM83.626667 736.853333h28.586666v70.4h-28.586666zM111.786667 905.386667v-42.666667H85.333333v56.32a21.333333 21.333333 0 0 0 21.333334 21.333333h61.44v-28.586666H118.613333a6.826667 6.826667 0 0 1-6.826666-6.4zM85.333333 104.96v63.573333h28.586667V119.04a6.826667 6.826667 0 0 1 6.826667-6.826667h47.36V85.333333H104.96a21.333333 21.333333 0 0 0-19.626667 19.626667zM682.666667 499.2h-157.44V341.333333a13.226667 13.226667 0 1 0-26.026667 0v157.866667H341.333333a13.226667 13.226667 0 1 0 0 26.026667h157.44V682.666667a13.226667 13.226667 0 1 0 26.026667 0v-157.44H682.666667a13.226667 13.226667 0 0 0 0-26.026667z"
                            fill="#707070"
                            p-id="6095"
                          />
                        </svg>
                      </div>
                      <div>
                        <img
                          :src="wx.qrWeCodeUrl"
                          alt=""
                          style="height:100px;width:auto"
                        />
                      </div>
                    </vui-upload>
                  </div>
                </div>
              </div>
            </div>
          </vui-accordion-item>
          <vui-accordion-item name="3" :max-height="300">
            <div
              slot="header"
              class="vc-flex--between-center vc-border--bm vc-padding--ud"
            >
              <div class="vc-flex vc-items--center">
                <vui-image
                  width="24px"
                  height="24px"
                  fill-type="cover"
                  :src="resource.ali"
                  alignType="center"
                  :lazy="false"
                ></vui-image>
                <span class="vc-margin--lt">支付宝</span>
              </div>
              <div>
                <Icon
                  v-if="params.type == 3"
                  name="icon-radio-button-on"
                  color="#118eea"
                  :size="20"
                ></Icon>
                <Icon
                  v-else
                  name="icon-radio-button-off-out"
                  color="#dedede"
                  :size="20"
                ></Icon>
              </div>
            </div>
            <div slot="panel">
              <div class="  vc-padding--ud  vc-border--bm">
                <div class="vc-margin--bm">
                  <vui-input
                    border-type="bottom"
                    border-weight-type="thin"
                    align="right"
                    v-model="ali.alipay"
                    placeholder="请输入您的支付宝账号"
                  >
                    <div slot="prepend" style="line-height:36px">
                      <span class="vc-text--danger">*</span>
                      <span class="vc-text--bold vc-text--sm  vc-text--light"
                        >支付宝账号</span
                      >
                    </div>
                  </vui-input>
                </div>

                <div class="vc-margin--bm">
                  <vui-input
                    border-type="bottom"
                    border-weight-type="thin"
                    align="right"
                    v-model="ali.alipayRealName"
                    placeholder="请输入您的支付宝真实姓名"
                  >
                    <div slot="prepend" style="line-height:36px">
                      <span class="vc-text--danger">*</span>
                      <span class="vc-text--bold vc-text--sm  vc-text--light"
                        >支付宝姓名</span
                      >
                    </div>
                  </vui-input>
                </div>

                <div class="vc-flex vc-content--between">
                  <div style="line-height:36px">
                    <span class="vc-text--danger">*</span>
                    <span class="vc-text--bold vc-text--sm  vc-text--light"
                      >收款二维码</span
                    >
                  </div>

                  <div>
                    <vui-upload @change="selectImage($event, 'ali')">
                      <div
                        style="width:36px;height:36px"
                        v-if="!ali.alipayCodeUrl"
                      >
                        <svg
                          viewBox="0 0 1024 1024"
                          version="1.1"
                          p-id="1903"
                          height="100%"
                          width="100%"
                        >
                          <path
                            xmlns="http://www.w3.org/2000/svg"
                            d="M610.133333 912.213333h70.4v28.586667H610.133333zM224 83.626667H294.4v28.586666H224zM736.426667 83.626667h70.4v28.586666h-70.4zM911.786667 736.853333h28.586666v70.4h-28.586666zM911.786667 905.386667a6.826667 6.826667 0 0 1-6.826667 6.826666h-42.666667V938.666667h56.32a21.333333 21.333333 0 0 0 21.333334-21.333334v-54.186666h-28.586667zM350.293333 912.213333h77.653334v28.586667H350.293333zM483.84 912.213333h70.4v28.586667h-70.4zM610.133333 83.626667h70.4v28.586666H610.133333zM919.04 85.333333h-56.32v28.586667h42.666667a6.4 6.4 0 0 1 4.693333 0 6.4 6.4 0 0 1 0 4.693333v49.92H938.666667V104.96a21.333333 21.333333 0 0 0-19.626667-19.626667zM911.786667 224.426667h28.586666v70.4h-28.586666zM911.786667 350.72h28.586666v77.653333h-28.586666zM911.786667 610.133333h28.586666v70.4h-28.586666zM911.786667 483.84h28.586666v70.4h-28.586666zM736.426667 912.213333h70.4v28.586667h-70.4zM83.626667 350.72h28.586666v77.653333h-28.586666zM83.626667 224.426667h28.586666v70.4h-28.586666zM83.626667 483.84h28.586666v70.4h-28.586666zM350.293333 83.626667h77.653334v28.586666H350.293333zM483.84 83.626667h70.4v28.586666h-70.4zM224 912.213333H294.4v28.586667H224zM83.626667 610.133333h28.586666v70.4h-28.586666zM83.626667 736.853333h28.586666v70.4h-28.586666zM111.786667 905.386667v-42.666667H85.333333v56.32a21.333333 21.333333 0 0 0 21.333334 21.333333h61.44v-28.586666H118.613333a6.826667 6.826667 0 0 1-6.826666-6.4zM85.333333 104.96v63.573333h28.586667V119.04a6.826667 6.826667 0 0 1 6.826667-6.826667h47.36V85.333333H104.96a21.333333 21.333333 0 0 0-19.626667 19.626667zM682.666667 499.2h-157.44V341.333333a13.226667 13.226667 0 1 0-26.026667 0v157.866667H341.333333a13.226667 13.226667 0 1 0 0 26.026667h157.44V682.666667a13.226667 13.226667 0 1 0 26.026667 0v-157.44H682.666667a13.226667 13.226667 0 0 0 0-26.026667z"
                            fill="#707070"
                            p-id="6095"
                          />
                        </svg>
                      </div>
                      <div>
                        <img
                          :src="ali.alipayCodeUrl"
                          alt=""
                          style="height:100px;width:auto"
                        />
                      </div>
                    </vui-upload>
                  </div>
                </div>
              </div>
            </div>
          </vui-accordion-item>

          <vui-accordion-item name="4" :max-height="300">
            <div
              slot="header"
              class="vc-flex--between-center vc-border--bm vc-padding--ud"
            >
              <div class="vc-flex vc-items--center">
                <vui-image
                  width="24px"
                  height="24px"
                  fill-type="cover"
                  :src="resource.union"
                  alignType="center"
                  :lazy="false"
                ></vui-image>
                <span class="vc-margin--lt">云闪付</span>
              </div>
              <div>
                <Icon
                  v-if="params.type == 4"
                  name="icon-radio-button-on"
                  color="#118eea"
                  :size="20"
                ></Icon>
                <Icon
                  v-else
                  name="icon-radio-button-off-out"
                  color="#dedede"
                  :size="20"
                ></Icon>
              </div>
            </div>

            <div slot="panel">
              <div class="vc-padding--ud vc-border--bm">
                <div class="vc-margin--bm">
                  <vui-input
                    border-type="bottom"
                    border-weight-type="thin"
                    align="right"
                    v-model="union.unionpay"
                    placeholder="请输入您的云闪付账号"
                  >
                    <div slot="prepend" style="line-height:36px">
                      <span class="vc-text--danger">*</span>
                      <span class="vc-text--bold vc-text--sm  vc-text--light"
                        >云闪付账号</span
                      >
                    </div>
                  </vui-input>
                </div>

                <div class="vc-flex vc-content--between">
                  <div style="line-height:36px">
                    <span class="vc-text--danger">*</span>
                    <span class="vc-text--bold vc-text--sm  vc-text--light"
                      >收款二维码</span
                    >
                  </div>

                  <div>
                    <vui-upload @change="selectImage($event, 'union')">
                      <div
                        style="width:36px;height:36px"
                        v-if="!union.unionpayCodeUrl"
                      >
                        <svg
                          viewBox="0 0 1024 1024"
                          version="1.1"
                          p-id="1903"
                          height="100%"
                          width="100%"
                        >
                          <path
                            xmlns="http://www.w3.org/2000/svg"
                            d="M610.133333 912.213333h70.4v28.586667H610.133333zM224 83.626667H294.4v28.586666H224zM736.426667 83.626667h70.4v28.586666h-70.4zM911.786667 736.853333h28.586666v70.4h-28.586666zM911.786667 905.386667a6.826667 6.826667 0 0 1-6.826667 6.826666h-42.666667V938.666667h56.32a21.333333 21.333333 0 0 0 21.333334-21.333334v-54.186666h-28.586667zM350.293333 912.213333h77.653334v28.586667H350.293333zM483.84 912.213333h70.4v28.586667h-70.4zM610.133333 83.626667h70.4v28.586666H610.133333zM919.04 85.333333h-56.32v28.586667h42.666667a6.4 6.4 0 0 1 4.693333 0 6.4 6.4 0 0 1 0 4.693333v49.92H938.666667V104.96a21.333333 21.333333 0 0 0-19.626667-19.626667zM911.786667 224.426667h28.586666v70.4h-28.586666zM911.786667 350.72h28.586666v77.653333h-28.586666zM911.786667 610.133333h28.586666v70.4h-28.586666zM911.786667 483.84h28.586666v70.4h-28.586666zM736.426667 912.213333h70.4v28.586667h-70.4zM83.626667 350.72h28.586666v77.653333h-28.586666zM83.626667 224.426667h28.586666v70.4h-28.586666zM83.626667 483.84h28.586666v70.4h-28.586666zM350.293333 83.626667h77.653334v28.586666H350.293333zM483.84 83.626667h70.4v28.586666h-70.4zM224 912.213333H294.4v28.586667H224zM83.626667 610.133333h28.586666v70.4h-28.586666zM83.626667 736.853333h28.586666v70.4h-28.586666zM111.786667 905.386667v-42.666667H85.333333v56.32a21.333333 21.333333 0 0 0 21.333334 21.333333h61.44v-28.586666H118.613333a6.826667 6.826667 0 0 1-6.826666-6.4zM85.333333 104.96v63.573333h28.586667V119.04a6.826667 6.826667 0 0 1 6.826667-6.826667h47.36V85.333333H104.96a21.333333 21.333333 0 0 0-19.626667 19.626667zM682.666667 499.2h-157.44V341.333333a13.226667 13.226667 0 1 0-26.026667 0v157.866667H341.333333a13.226667 13.226667 0 1 0 0 26.026667h157.44V682.666667a13.226667 13.226667 0 1 0 26.026667 0v-157.44H682.666667a13.226667 13.226667 0 0 0 0-26.026667z"
                            fill="#707070"
                            p-id="6095"
                          />
                        </svg>
                      </div>
                      <div>
                        <img
                          :src="union.unionpayCodeUrl"
                          alt=""
                          style="height:100px;width:auto"
                        />
                      </div>
                    </vui-upload>
                  </div>
                </div>
              </div>
            </div>
          </vui-accordion-item>
        </vui-accordion>
      </div>

      <div class="">
        <div class="vp-btn vp-btn__submit" @click="submitDraw">提现</div>
      </div>
    </div>
  </div>
</template>
<style scoped>
</style>
