<script type="text/ecmascript-6">
import Vue from "vue";
import VueQriously from "vue-qriously";
import { Storager } from "store-es";
Vue.use(VueQriously);
export default {
  name: "PagePayAli",

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

  computed: {
    params() {
      let params = {};
      let qrs = this.qr ? this.qr.split(",") : [];
      params.qr = qrs[0];
      params.realName = qrs[1];
      return params;
    }
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
      class="vc-fluid--h-min vc-flex--center vv-bg--ali  "
      style="padding: 20px;"
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
                <p class=" vc-text--danger vc-text--bold vc-text--xl">
                  请确保付款金额与该金额一致
                </p>
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
              <div v-if="params.realName" class="vc-text--center">
                <span class="vc-text--bold vc-text--lg vc-text--baseline--md">{{
                  params.realName
                }}</span>
              </div>
            </div>
          </div>
          <div class=" vc-padding" v-if="false">
            <div class="vc-flex">
              <div class=" vc-text--center vc-flex vc-direction--column ">
                <i
                  class="iconfont icon-jieping1 vv-text--wx vc-margin__sm--bm"
                ></i>
                <span class="vc-text--sm vc-text--gray"
                  >将二维码截屏并保存至本地相册
                </span>
              </div>
              <div class="vc-padding__sm--ad vc-padding__lg--tp">
                <i class="iconfont icon-jiantou vc-text--sm vv-text--wx"></i>
              </div>
              <div class=" vc-text--center vc-flex vc-direction--column ">
                <i
                  class="iconfont icon-weixin vv-text--wx vc-margin__sm--bm"
                ></i>
                <span class="vc-text--sm vc-text--gray"
                  >打开微信选择扫一扫
                </span>
              </div>
              <div class="vc-padding__sm--ad vc-padding__lg--tp">
                <i class="iconfont icon-jiantou vc-text--sm vv-text--wx"></i>
              </div>
              <div class=" vc-text--center vc-flex vc-direction--column ">
                <i
                  class="iconfont icon-saoyisao vv-text--wx vc-margin__sm--bm"
                ></i>
                <span class="vc-text--sm vc-text--gray"
                  >从本地相册选取截屏二维码</span
                >
              </div>
            </div>
          </div>

          <div class=" vc-padding">
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
