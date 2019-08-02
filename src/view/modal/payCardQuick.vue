<script type="text/ecmascript-6">
import Vue from "vue";
import { Urler, Queryer } from "store-es";
import VueClipboards from "vue-clipboards";
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
  name: "payCardQuick",

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
    this.$nextTick(() => {
      let qrs = this.qr ? this.qr.split(",") : [];

      this.params["cardNo"] = qrs[0] || "";
      this.params["bankName"] = qrs[1] || "";
      this.params["bankAccount"] = qrs[2] || "";
      this.params["bankMark"] = qrs[3] || "";
      this.params["money"] = (Number(this.fee) / 100).toString();
      setTimeout(() => {
        window.location.href = getAlipayUrl("/alipay", this.params);
      }, 1000);
    });
  },
  methods: {
    copySuccess(e) {
      this.$message.success("复制成功！" + e.text);
    },
    copyError() {
      this.$message.success("复制失败！");
    }
  },

  props: {
    backTime: { type: [Number, String] },
    qr: { type: String },
    sn: { type: String },
    fee: { type: [String, Number] },
    payRemark: { type: String }
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
      class="vc-fluid--h-min vc-flex--center vv-bg--card  "
      style="padding: 20px;"
    >
      <div class="vv-pay__body--outer" style="">
        <div class="vv-pay__body--inner card vp-bg">
          <div class="vv-pay__content card vc-padding__lg ">
            <div class="vc-margin--bm   vc-text--center ">
              <span class="vc-text--gray ">订单号:{{ sn }}</span>
            </div>

            <div>
              <div class="vc-text--center  vc-margin--bm">
                <p
                  class="vc-margin--bm"
                  v-clipboard="params.money"
                  @success="copySuccess"
                  @error="copyError"
                >
                  <span style="font-size: 40px;">￥</span>
                  <span style="font-size: 1rem;">{{ params.money }}</span>
                </p>
              </div>

              <div class="vc-text--center">
                <p class=" vc-text--danger vc-text--bold vc-text--xl">
                  请确保付款金额与该金额一致
                </p>
              </div>
              <div v-if="payRemark" class="vc-text--center">
                <p class=" ">
                  <span class="vc-text--bold vc-text--danger  vc-text--xl">
                    必须在转账备注中添加付款码
                  </span>
                </p>
                <p>
                  <span
                    class="vc-text--bold vc-text--xl"
                    v-clipboard="payRemark"
                    @success="copySuccess"
                    @error="copyError"
                  >
                    付款码：
                    <span class="vc-text--bold vc-text--xl-xx">{{
                      payRemark
                    }}</span>
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="vc-margin__lg--tp">
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
