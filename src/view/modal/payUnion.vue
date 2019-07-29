<script type="text/ecmascript-6">
import Vue from "vue";
import VueQriously from "vue-qriously";
import { Storager } from "store-es";

Vue.use(VueQriously);

export default {
  name: "payUnion",

  data() {
    return {
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
  },
  methods: {
    /**
     * 设置二维码的宽度
     */
    setCode() {
      this.$nextTick(() => {
        let codeBox = this.$refs["codeBox"];
        this.payCode.size = codeBox ? codeBox.offsetWidth : 0;
      });
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
        <div class="vc-text--center vc-text--white" style="font-size: 50px">
          已过期
        </div>
      </div>
    </div>
    <div
      class="vc-fluid--h-min vc-flex--center vv-bg--union  "
      style="padding: 20px;"
    >
      <div class="vv-pay__body--outer" style="">
        <div class="vv-pay__body--inner union vp-bg">
          <div class="vv-pay__content union vc-padding__lg ">
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
                <p class=" vc-text--danger vc-text--bold vc-text--xl">
                  请确保付款金额与该金额一致
                </p>
              </div>
              <div class="vp-ratio">
                <div class="vp-ratio__outer" data-ratio="100%">
                  <div
                    class="vp-ratio__inner vp-bg vp-br  vp-pos"
                    ref="codeBox"
                    v-if="!!qr"
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
                        <!-- <i
                          class="iconfont icon-zhifubaozhifu vv-text--union"
                          style="font-size: 0.6rem;"
                        ></i> -->
                        <vui-image
                          width="0.6rem"
                          height="0.6rem"
                          fill-type="height"
                          :src="require('../../images/icon-union.png')"
                          alignType="center"
                          class="vc-margin__sm--bm"
                        ></vui-image>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class=" vc-padding">
            <div class="vc-flex">
              <div class=" vc-text--center vc-flex vc-direction--column ">
                <i
                  class="iconfont icon-jieping1 vv-text--union vc-margin__sm--bm"
                ></i>
                <span class="vc-text--sm vc-text--gray"
                  >将二维码截屏并保存至本地相册
                </span>
              </div>
              <div class="vc-padding__sm--ad vc-padding__lg--tp">
                <i class="iconfont icon-jiantou vc-text--sm vv-text--union"></i>
              </div>
              <div class=" vc-text--center vc-flex vc-direction--column ">
                <vui-image
                  width="100%"
                  height="16px"
                  fill-type="height"
                  :src="require('../../images/icon-union.png')"
                  alignType="center"
                  class="vc-margin__sm--bm"
                ></vui-image>
                <span class="vc-text--sm vc-text--gray">
                  打开云闪付选择扫一扫
                </span>
              </div>
              <div class="vc-padding__sm--ad vc-padding__lg--tp">
                <i class="iconfont icon-jiantou vc-text--sm vv-text--union"></i>
              </div>
              <div class=" vc-text--center vc-flex vc-direction--column ">
                <i
                  class="iconfont icon-saoyisao vv-text--union vc-margin__sm--bm"
                ></i>

                <span class="vc-text--sm vc-text--gray"
                  >从本地相册选取截屏二维码</span
                >
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
