<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-07-29 10:02:13
 * @LastEditTime: 2019-08-17 14:18:00
 * @LastEditors: Please set LastEditors
 -->
<script type="text/ecmascript-6">
import Vue from "vue";
import VueClipboards from "vue-clipboards";
import { Queryer, Urler } from "store-es";
Vue.use(VueClipboards);

const APPID_TO_ALIPAY = "20000067";
/**
 * 跳转到支付宝内部，指定的路径和参数的传递
 */
function getAlipayUrl(path, params) {
  let query = new Queryer();
  let urler = new Urler();
  let href = window.location.href;
  let index = href.indexOf("#");
  let url = urler.encodeURIComponent(
    href.substring(0, index + 1) + path + query.stringify(params)
  );
  return `alipays://platformapi/startapp?appId=${APPID_TO_ALIPAY}&url=${url}`;
}
export default {
  name: "PagePayCard",
  data() {
    return {
      params: {
        type: "toCard",
        cardNo: "",
        bankAccount: "",
        bankMark: "",
        bankName: "",
        money: ""
      }
    };
  },
  mounted() {
    this.initialize(); 
  },
  methods: {
    initialize() {
      let qrs = this.qr ? this.qr.split(",") : [];
      this.params.cardNo = qrs[0] || "";
      this.params.bankName = qrs[1] || "";
      this.params.bankAccount = qrs[2] || "";
      this.params.bankMark = qrs[3] || "";
      this.params.money = (Number(this.fee) / 100).toString();
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
    payType: { type: [String, Number] }
  }
};
</script>
<template>
  <div class="vv-page">
    <div class="vc-flex--center vv-mask" v-if="backTime === 0">
      <div>
        <div class="vc-text--center vc-text--white" style="font-size: 40px">
          已过期
        </div>
      </div>
    </div>
    <div
      class="vc-fluid--h-min vc-flex--center vv-bg--card  "
      style="padding: 20px 20px 70px"
    >
      <div class="vv-pay__body--outer">
        <div class="vv-pay__body--inner  card vp-bg vp-pos">
          <div
            class="vv-pay__content card vc-padding--ad vc-padding__md-lg--ud"
          >
            <div class="  vc-text--center vc-margin--bm">
              <span class="vc-text--gray ">订单号:{{ sn }}</span>
            </div>
            <div class=" " style="">
              <div class="vc-text--center   vc-text--center vc-margin__lg--bm">
                <p
                  v-clipboard="Number(fee) / 100"
                  @success="handleSuccess"
                  @error="handleError"
                >
                  <span style="font-size: 40px;">￥</span>
                  <span style="font-size: 1rem;">{{ fee | strMoney }}</span>
                  <!-- <span style="font-size: 1rem;">{{ fee | strMoney }}</span> -->
                </p>
                <p class=" vc-text--danger vc-text--bold vc-text--xl">
                  请确保付款金额与该金额一致
                </p>
                <div v-if="payRemark">
                  <p class=" ">
                    <span class="vc-text--bold vc-text--danger   vc-text--xl">
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
              </div>

              <div
                v-clipboard="params.cardNo"
                @success="handleSuccess"
                @error="handleError"
                class="vc-margin__lg--bm vc-flex"
              >
                <div class="vc-text--right vc-padding--rt" style="width:30%">
                  <span
                    class="vc-text--bold vc-text--light vc-text--lg vc-text--baseline--md"
                    >卡号</span
                  >
                </div>
                <div class="">
                  <span
                    class="vc-text--bold vc-text--lg vc-text--baseline--md"
                    >{{ params.cardNo }}</span
                  >
                </div>
              </div>

              <div
                v-clipboard="params.bankAccount"
                @success="handleSuccess"
                @error="handleError"
                class="vc-margin__lg--bm vc-flex"
              >
                <div class="vc-text--right vc-padding--rt" style="width:30%">
                  <span
                    class="vc-text--bold vc-text--light vc-text--lg vc-text--baseline--md"
                    >户主</span
                  >
                </div>
                <div class="">
                  <span
                    class="vc-text--bold vc-text--lg vc-text--baseline--md"
                    >{{ params.bankAccount }}</span
                  >
                </div>
              </div>

              <div
                v-clipboard="params.bankName"
                @success="handleSuccess"
                @error="handleError"
                class=" vc-flex"
              >
                <div class="vc-text--right vc-padding--rt" style="width:30%">
                  <span
                    class="vc-text--bold vc-text--light vc-text--lg vc-text--baseline--md"
                    >开户行</span
                  >
                </div>
                <div class="">
                  <span
                    class="vc-text--bold vc-text--lg vc-text--baseline--md"
                    >{{ params.bankName }}</span
                  >
                </div>
              </div>
            </div>
          </div>
          <div class="vc-padding--ad vc-padding__md-lg--ud vc-text--center  ">
            <div>
              <p class="vc-margin--bm">
                <span class="vc-text--lg vc-text--bold vv-text--card"
                  >通过银行卡转账支付</span
                >
              </p>
              <p>
                <span class="vc-text--gray"
                  >轻触卡号、开户行、户主均可进行复制</span
                >
              </p>
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
<style scoped></style>
