<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-07-29 10:02:13
 * @LastEditTime: 2019-08-27 11:36:17
 * @LastEditors: Please set LastEditors
 -->
<script>
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
      params: {},
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
    this.setCode();
    //this.goAplipay();
  },
  methods: {
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
    token: { type: [String] },
    alipayRealName: { type: String }
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
    <div class="vv-page-wrap vv-bg--ali  ">
      <div class="vv-pay__body--outer" style="">
        <div class="vv-pay__body--inner ali vp-bg">
          <div class="vv-pay__content ali vc-padding__lg ">
            <div class="vc-margin--bm   vc-text--center " v-if="false">
              <span class="vc-text--gray ">订单号:{{ sn }}</span>
            </div>

            <div class="vc-text--center  vc-margin--bm">
              <template v-if="payType == 6">
                <div>
                  <span class="vc-text--bold vc-text--danger vc-text--lg">
                    请勿修改转账信息
                  </span>
                </div>
              </template>

              <template v-if="payType == 3">
                <div v-if="payRemark.length != 6">
                  <span class="vc-text--bold vc-text--danger vc-text--lg">
                    请确保付款金额与该金额一致
                  </span>
                </div>
                <div v-if="payRemark.length === 4">
                  <p class="">
                    <span class="vc-text--bold vc-text--danger vc-text--lg">
                      必须在转账备注中添加付款码
                    </span>
                  </p>
                  <p>
                    <span
                      class="vc-text--bold vc-text--lg"
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

              <template v-if="payType == 6">
                <div
                  v-clipboard="alipayRealName"
                  @success="handleSuccess"
                  @error="handleError"
                  class="vc-padding--tp"
                >
                  <div class="vc-text--center">
                    <span
                      class="vc-text--bold vc-text--xl-xx vc-text--baseline--md"
                    >
                      {{ alipayRealName }}
                    </span>
                  </div>
                </div>
              </template>
            </div>

            <div class=" " style=" ">
              <div class="vp-ratio">
                <div class="vp-ratio__outer" data-ratio="100%">
                  <div
                    class="vp-ratio__inner vp-bg vp-br  vp-pos"
                    ref="codeBox"
                    v-if="qr"
                  >
                    <qriously
                      :value="qr"
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
            </div>
          </div>

          <div class=" vc-padding">
            <template v-if="payType == 6">
              <div>
                <div class=" vc-text--center vc-flex vc-direction--column ">
                  <span class="vc-text--sm vc-text--gray"
                    >单击下方按钮【支付宝】进入支付宝转账
                  </span>
                </div>
              </div>
            </template>
            <template v-if="payType == 3">
              <div class="vc-flex">
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
            </template>
          </div>
        </div>
        <div class="vc-margin__lg--tp" v-if="false">
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
<style scoped></style>
