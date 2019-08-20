<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-07-29 10:02:13
 * @LastEditTime: 2019-08-20 10:49:48
 * @LastEditors: Please set LastEditors
 -->
<script type="text/ecmascript-6">
import Vue from "vue";
import VueQriously from "vue-qriously";
import { Storager, Queryer, Urler } from "store-es";
import VueClipboards from "vue-clipboards";
Vue.use(VueClipboards);
Vue.use(VueQriously);

export default {
  name: "PagePayAli",

  data() {
    return {
      params: {
        qr: "",
        realName: "",
        userId: "",
        memo: "",
        money: ""
      },
      payCode: {
        value: "",
        size: 300,
        backgroundAlpha: 1,
        background: "white",
        foreground: "black",
        level: "L"
      }
    };
  },

  mounted() {
    this.initialize();
    this.setCode();
    //this.goAplipay();
  },
  methods: {
    initialize() {
      let qrs = this.qr ? this.qr.split(",") : [];
      this.params.qr = qrs[0] || "";
      if (this.payType === 3) {
        this.params.realName = qrs[1] || "";
      }
    },
    goAplipay(isAlipay = true, quick = false) {
      // if (isAlipay) {
      //   if (quick) {
      //     window.location.href = getAlipayUrl("/alipay/" + this.token);
      //   } else {
      //     setTimeout(() => {
      //       window.location.href = getAlipayUrl("/alipay/" + this.token);
      //     }, 1000);
      //   }
      // } else {
      //   this.$router.push("/alipay/" + this.token);
      // }
      // let qrs = this.qr ? this.qr.split(",") : [];
      // this.params.qr = qrs[0] || "";
      // this.params.realName = qrs[1] || "";
      // this.params.userId = qrs[2] || "";
      // this.params.memo = this.payRemark;
      // this.params.money = (Number(this.fee) / 100).toString();
      // if (this.payType == 6) {
      //   let params = {
      //     type: "toAccount",
      //     userId: this.params.userId,
      //     memo: this.params.memo,
      //     money: this.params.money
      //   };
      //   if (quick) {
      //     window.location.href = getAlipayUrl("/alipay", params);
      //   } else {
      //     setTimeout(() => {
      //       window.location.href = getAlipayUrl("/alipay", params);
      //     }, 1000);
      //   }
      // }
    },

    /**
     * 设置二维码的宽度
     */
    setCode() {
      this.$nextTick(() => {
        let codeBox = this.$refs["codeBox"];
        this.payCode.size = codeBox ? codeBox.offsetWidth : 0;
      });
    },
    handleSuccess(e) {
      this.$message.success("复制成功！" + e.text);
    },
    handleError(e) {
      this.$message.success("复制失败！");
    }
  },

  props: {
    backTime: { type: [Number, String] },
    qr: { type: String },
    sn: { type: String },
    fee: { type: [String, Number] },
    payRemark: { type: String },
    payType: { type: [String, Number] },
    token: { type: [String] }
  }
};
</script>
<template>
  <div class="vv-page">
    <div class="vc-flex--center vv-mask" v-if="backTime === 0">
      <div>
        <div class="vc-text--center vc-text--white" style="font-size: 50px">
          已过期
        </div>
      </div>
    </div>
    <div
      class="vc-fluid--h-min vc-flex--center vv-bg--ali  "
      style="padding: 20px 20px 70px"
    >
      <div class="vv-pay__body--outer" style="">
        <div class="vv-pay__body--inner ali vp-bg">
          <div class="vv-pay__content ali vc-padding__lg ">
            <div class="vc-margin--bm   vc-text--center ">
              <span class="vc-text--gray ">订单号:{{ sn }}</span>
            </div>

            <div class=" " style=" ">
              <div class="vc-text--center  vc-margin--bm">
                <p>
                  <span style="font-size: 40px;">￥</span>
                  <span style="font-size: 1rem;">{{ fee | strMoney }}</span>
                  <!-- <FormatMoney
                    :money='fee'
                    money-type='branch'
                  ></FormatMoney> -->
                </p>

                <template v-if="payType == 3">
                  <div v-if="!payRemark || payRemark.length === 4">
                    <span class="vc-text--bold vc-text--danger vc-text--xl">
                      请勿修改付款信息
                    </span>
                  </div>
                </template>
                <template v-if="payType == 6">
                  <div>
                    <span class="vc-text--bold vc-text--danger vc-text--xl"
                      >请勿修改转账信息</span
                    >
                  </div>
                </template>
                <template v-if="false">
                  <div>
                    <span class="vc-text--bold vc-text--danger vc-text--xl">
                      请确保付款金额与该金额一致
                    </span>
                  </div>
                  <div v-if="payRemark.length === 4">
                    <p class="">
                      <span class="vc-text--bold vc-text--danger vc-text--xl">
                        必须在转账备注中添加付款码
                      </span>
                    </p>
                    <p>
                      <span
                        class="vc-text--bold vc-text--xl"
                        v-clipboard="payRemark"
                        @success="handleSuccess"
                        @error="handleError"
                      >
                        付款码：
                        <span class="vc-text--bold vc-text--xl-xx">{{
                          payRemark
                        }}</span>
                      </span>
                    </p>
                  </div>
                </template>
              </div>
              <div class="vp-ratio">
                <div class="vp-ratio__outer" data-ratio="100%">
                  <div
                    class="vp-ratio__inner vp-bg vp-br  vp-pos"
                    ref="codeBox"
                    v-if="params.qr"
                  >
                    <qriously
                      :value="params.qr"
                      :size="payCode.size"
                      :level="payCode.level"
                      :background="payCode.background"
                      :foreground="payCode.foreground"
                      :backgroundAlpha="payCode.backgroundAlpha"
                    />

                    <div
                      style=""
                      class=" vp-bg vp-pos--inner vp-pos--center vp-br vc-padding__sm"
                    >
                      <div class="vc-cover vp-img__inner">
                        <!--<img src="../images/icon-head-normal.png" alt="" class="vp-img&#45;&#45;cover">-->
                        <i
                          class="iconfont icon-zhifubaozhifu vv-text--ali"
                          style="font-size: 0.6rem;"
                        ></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                v-clipboard="params.realName"
                @success="handleSuccess"
                @error="handleError"
                class=""
                v-if="!!params.realName"
              >
                <div class="vc-text--center">
                  <span
                    class="vc-text--bold vc-text--lg vc-text--baseline--md"
                    >{{ params.realName }}</span
                  >
                </div>
                <div class="vc-text--center">
                  <span class="vc-text--gray vc-text--mi"
                    >(收款人真实姓名)</span
                  >
                </div>
              </div>

              <div
                v-clipboard="payRemark"
                @success="handleSuccess"
                @error="handleError"
                class=""
                v-if="false"
              >
                <div class="vc-text--center">
                  <span
                    class="vc-text--bold vc-text--lg vc-text--baseline--md"
                    >{{ payRemark }}</span
                  >
                </div>
                <div class="vc-text--center">
                  <span class="vc-text--gray vc-text--mi"
                    >(转账时请务必添加上该备注，否则充值不成功，轻触可复制)</span
                  >
                </div>
              </div>
            </div>
          </div>

          <div class=" vc-padding">
            <div v-if="false">
              <p
                class="vc-text--bold vc-text--danger vc-text--baseline--md vc-text--sm"
              >
                支付方式：
              </p>
              <p
                class="vc-text--danger vc-text--baseline--md vc-text--sm"
                style="text-indent:20px"
              >
                ①单击下方支付宝按钮，进入支付宝app，长按页面中二维码识别支付
              </p>
              <p
                class="vc-text--danger vc-text--baseline--md vc-text--sm"
                style="text-indent:20px"
              >
                ②如若不能直接进入支付宝app，则将二维码截屏并保存至本地相册，打开支付宝选择扫一扫，从本地相册选取截屏二维码
              </p>
            </div>
            <div class="vc-flex" v-if="true">
              <div class=" vc-text--center vc-flex vc-direction--column ">
                <i
                  class="iconfont icon-jieping1 vv-text--ali vc-margin__sm--bm"
                ></i>
                <span class="vc-text--sm vc-text--gray"
                  >将二维码截屏并保存至本地相册
                </span>
              </div>
              <div class="vc-padding__sm--ad vc-padding__lg--tp">
                <i class="iconfont icon-jiantou vc-text--sm vv-text--ali"></i>
              </div>
              <div class=" vc-text--center vc-flex vc-direction--column ">
                <i
                  class="iconfont icon-changyonglogo30 vv-text--ali vc-margin__sm--bm"
                ></i>
                <span class="vc-text--sm vc-text--gray">
                  打开支付宝选择扫一扫
                </span>
              </div>
              <div class="vc-padding__sm--ad vc-padding__lg--tp">
                <i class="iconfont icon-jiantou vc-text--sm vv-text--ali"></i>
              </div>
              <div class=" vc-text--center vc-flex vc-direction--column ">
                <i
                  class="iconfont icon-saoyisao vv-text--ali vc-margin__sm--bm"
                ></i>
                <span class="vc-text--sm vc-text--gray"
                  >从本地相册选取截屏二维码</span
                >
              </div>
            </div>
          </div>
        </div>
        <!-- <div class="vc-margin__lg--tp">
          <div class="vc-text--center">
            <span class="vc-text--white-light  ">
              过期时间
            </span>
          </div>
          <div class="vc-text--white vc-text--bold vc-text--center vc-margin--tp">
            <span class="vc-text--white vc-text--bold  ">{{ backTime | strTime }}</span>
          </div>
        </div> -->
        <div class="vc-margin__lg--tp">
          <!-- <div class="vc-text--center">
            <span class="vc-text--white-light  ">
              过期时间
            </span>
          </div> -->
          <div
            class="vc-text--white vc-text--bold vc-text--center vc-margin--tp"
          >
            <span class="vc-text--white vc-text--bold  ">
              <span class="vc-text--white-light">倒计时：</span>
              {{ backTime | strTime }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
</style>
