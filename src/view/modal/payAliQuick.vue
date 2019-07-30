<script type="text/ecmascript-6">
import { Urler, Queryer } from "store-es";
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
  name: "payAliQuick",

  data() {
    return {
      params: {
        type: "toAccount",
        qr: "",
        realName: "",
        userId: "",
        isMemo: "",
        memo: "",
        money: ""
      }
    };
  },

  mounted() {
    this.$nextTick(() => {
      let qrs = this.qr ? this.qr.split(",") : [];
      this.params["realName"] = qrs[1] || "";
      this.params["userId"] = qrs[2] || "";
      this.params["money"] = (Number(this.fee) / 100).toString();
      this.params["memo"] = this.payRemark;
      setTimeout(() => {
        window.location.href = getAlipayUrl("/alipay", this.params);
      }, 1000);
    });
  },
  methods: {},

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
      class="vc-fluid--h-min vc-flex--center vv-bg--ali  "
      style="padding: 20px;"
    >
      <div class="vv-pay__body--outer" style="">
        <div class="vv-pay__body--inner ali vp-bg">
          <div class="vv-pay__content ali vc-padding__lg ">
            <div class="vc-margin--bm   vc-text--center ">
              <span class="vc-text--gray ">订单号:{{ sn }}</span>
            </div>

            <div>
              <div class="vc-text--center  vc-margin--bm">
                <p class="vc-margin--bm">
                  <span style="font-size: 40px;">￥</span>
                  <span style="font-size: 1rem;">{{ params["money"] }}</span>
                </p>
              </div>

              <div class="vc-row vc-margin--bm">
                <div class="vc-text--center">
                  <span class="vc-text--bold vc-text--lg vc-text--baseline--md">
                    {{ params["realName"] }}
                  </span>
                </div>
                <div class="vc-text--center">
                  <span class="vc-text--gray vc-text--sm">
                    （收款人真实姓名）
                  </span>
                </div>
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
