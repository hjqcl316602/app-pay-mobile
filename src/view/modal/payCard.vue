<script type="text/ecmascript-6">
import Vue from "vue";
import VueClipboards from "vue-clipboards";
Vue.use(VueClipboards);
export default {
  name: "PagePayCard",
  data() {
    return {
      payTime: {
        timeLimit: 10 * 60 * 1000,
        countDownStatus: false, // 倒计时是否开始
        timer: null
      }
    };
  },
  computed: {
    params() {
      let qrs = this.qr ? this.qr.split(",") : [];
      return {
        cardNo: qrs[0] || "",
        cardType: qrs[1] || "",
        cardName: qrs[2] || ""
      };
    }
  },
  methods: {
    handleSuccess(e) {
      this.$Toast("复制成功！" + e.text);
    },
    handleError(e) {
      this.$Toast("复制失败！");
    }
  },
  props: {
    backTime: { type: [Number, String] },
    qr: { type: String },
    sn: { type: String },
    fee: { type: [String, Number] }
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
      style="padding: 20px;"
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
              <div class="vc-text--center   vc-text--center vc-margin--bm">
                <p>
                  <span style="font-size: 40px;">￥</span>
                  <span style="font-size: 1rem;">{{ fee | strMoney }}</span>
                  <!-- <span style="font-size: 1rem;">{{ fee | strMoney }}</span> -->
                </p>
                <p class=" vc-text--danger vc-text--bold vc-text--xl">
                  请确保付款金额与该金额一致
                </p>
              </div>

              <div class="vc-margin--bm  vc-flex vc-flex--between-center ">
                <div class="vc-text--bold vc-text--gray">
                  卡号
                </div>
                <div class=" vc-text--left">
                  <button
                    class="copy-btn vp-btn vc-text--bold  vc-padding"
                    v-clipboard="params.cardNo"
                    @success="handleSuccess"
                    @error="handleError"
                  >
                    {{ params.cardNo | strCard }}
                  </button>
                </div>
              </div>

              <div class="  vc-margin--bm  vc-flex vc-flex--between-center">
                <div class="vc-text--bold vc-text--gray ">
                  开户行
                </div>
                <div class=" vc-text--right">
                  <button
                    class="copy-btn vp-btn vc-text--bold  vc-padding"
                    v-clipboard="params.cardType"
                    @success="handleSuccess"
                    @error="handleError"
                  >
                    {{ params.cardType }}
                  </button>
                </div>
              </div>

              <div class="vc-flex vc-flex--between-center">
                <div class="vc-text--bold vc-text--gray   ">
                  户主
                </div>
                <div class=" vc-text--right">
                  <button
                    class="copy-btn vp-btn vc-text--bold  vc-padding"
                    v-clipboard="params.cardName"
                    @success="handleSuccess"
                    @error="handleError"
                  >
                    {{ params.cardName }}
                  </button>
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
                  >单击卡号、开户行、户主均可进行复制</span
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
