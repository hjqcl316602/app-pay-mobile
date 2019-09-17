<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-07-29 10:02:13
 * @LastEditTime: 2019-08-27 09:37:19
 * @LastEditors: Please set LastEditors
 -->
<script>
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
      },
      message: []
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
      this.getMessage();
    },
    getMessage() {
      if (Number(this.payType) === 1) {
        this.message.push("请确保付款金额与订单金额一致");
      }
      if (Number(this.payType) === 5) {
        this.message.push("请勿修改转账信息");
      }
      this.message.push("同一订单请勿重复支付");
      this.message.push("超时请勿支付");
      if (this.payRemark) {
        this.message.push("必须在转账备注中添加付款码");
        this.message.push("付款码:" + this.payRemark);
      }
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
  <div class="vv-page-wrap ">
    <div class="vv-page-body">
      <div class="vv-page-content ">
        <div class="vc-text--center vc-margin--bm">
          <template v-if="payType == 1">
            <div class="vc-flex vc-flex--center">
              <vui-image
                width="50px"
                height="30px"
                fill-type="height"
                :src="require('../../images/icon-card.png')"
                alignType="center"
              ></vui-image>
              <span class="vc-margin__sm--lt" style="font-size:30px">
                银联
              </span>
            </div>
          </template>
          <template v-if="payType == 5">
            <div class="vc-flex vc-flex--center">
              <i
                class="iconfont icon-zhifubaozhifu vv-text--ali"
                style="font-size:30px"
              ></i>
              <span class="vc-margin__sm--lt" style="font-size:30px">
                支付宝转卡
              </span>
            </div>
          </template>

          <p class=" ">
            <span style="font-size: 30px;">￥</span>
            <span style="font-size: 50px;" class="vc-text--bold">
              {{ fee | strMoney }}
            </span>
          </p>
          <template v-if="payType == 1">
            <div class=" ">
              <span class="vc-text--bold vc-text--danger vc-text--lg">
                请确保付款金额一致，否则不到账
              </span>
            </div>
          </template>
          <template v-if="payType == 5">
            <div class="">
              <span class="vc-text--bold vc-text--danger vc-text--lg">
                请勿修改转账信息，否则不到账
              </span>
            </div>
          </template>
        </div>
        <div class="vc-margin--bm">
          <div
            v-clipboard="params.cardNo"
            @success="handleSuccess"
            @error="handleError"
            class="vc-margin--bm vc-flex"
          >
            <div class="vc-text--right vc-padding--rt" style="width:30%">
              <span class=" vc-text--light vc-text--lg vc-text--baseline--md">
                卡号
              </span>
            </div>
            <div class="">
              <span class=" vc-text--lg vc-text--baseline--md">
                {{ params.cardNo }}
              </span>
            </div>
          </div>

          <div
            v-clipboard="params.bankAccount"
            @success="handleSuccess"
            @error="handleError"
            class="vc-margin--bm vc-flex"
          >
            <div class="vc-text--right vc-padding--rt" style="width:30%">
              <span class=" vc-text--light vc-text--lg vc-text--baseline--md">
                户主
              </span>
            </div>
            <div class="">
              <span class=" vc-text--lg vc-text--baseline--md">
                {{ params.bankAccount }}
              </span>
            </div>
          </div>

          <div
            v-clipboard="params.bankName"
            @success="handleSuccess"
            @error="handleError"
            class=" vc-flex"
          >
            <div class="vc-text--right vc-padding--rt" style="width:30%">
              <span class=" vc-text--light vc-text--lg vc-text--baseline--md">
                开户行
              </span>
            </div>
            <div class="">
              <span class=" vc-text--lg vc-text--baseline--md">
                {{ params.bankName }}
              </span>
            </div>
          </div>
        </div>
        <template v-if="payType == 5">
          <div class="vc-text--center vc-margin--bm">
            <span class="vc-text--lg"
              >单击下方按钮【支付宝】进入支付宝APP支付即可</span
            >
          </div>
        </template>

        <div class="vc-text--center  ">
          <template v-if="payType == 1">
            <div class="vc-margin__sm--bm">
              <span class=" vc-text--danger ">
                轻触卡号、户主、开户行均可复制
              </span>
            </div>
          </template>
          <div class="vc-margin__sm--bm">
            <span class=" vc-text--danger ">
              付款30秒内即可到账，未到账请联系客服
            </span>
          </div>

          <div class="vc-margin__sm--bm">
            <span class=" vc-text--danger ">
              每笔订单是唯一的，请勿重复支付
            </span>
          </div>
          <div class="vc-margin__sm--bm">
            <span class=" vc-text--danger ">
              过期订单请勿支付
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!--<div class="vv-page-wrap vv-bg&#45;&#45;card  " v-if="false">
  <div class="vv-pay__body&#45;&#45;outer">
    &lt;!&ndash;订单号&ndash;&gt;
    <template v-if="false">
      <div class="  vc-text&#45;&#45;center vc-margin&#45;&#45;bm">
        <span class="vc-text&#45;&#45;white">订单号:{{ sn }}</span>
      </div>
    </template>

    <div class="vv-pay__body&#45;&#45;inner  card vp-bg vp-pos">
      <div class="vv-pay__content card vc-padding">
        &lt;!&ndash;金额&ndash;&gt;
        <div class="vc-text&#45;&#45;center vc-margin&#45;&#45;bm" v-if="false">
          <span style="font-size: 40px;">￥</span>
          <span style="font-size: 1rem;">{{ fee | strMoney }}</span>
        </div>
        &lt;!&ndash;信息&ndash;&gt;
        <div class="vc-margin&#45;&#45;bm vc-text&#45;&#45;center">
          <p v-for="(item, index) in message">
            <span class="vc-text&#45;&#45;danger vc-text&#45;&#45;bold vc-text&#45;&#45;lg">
              {{ item }}
            </span>
          </p>
        </div>

        &lt;!&ndash;充值信息&ndash;&gt;
        <div>
          <div
            v-clipboard="params.cardNo"
            @success="handleSuccess"
            @error="handleError"
            class="vc-margin__lg&#45;&#45;bm vc-flex"
          >
            <div class="vc-text&#45;&#45;right vc-padding&#45;&#45;rt" style="width:30%">
              <span
                class="vc-text&#45;&#45;bold vc-text&#45;&#45;light vc-text&#45;&#45;lg vc-text&#45;&#45;baseline&#45;&#45;md"
                >卡号</span
              >
            </div>
            <div class="">
              <span
                class="vc-text&#45;&#45;bold vc-text&#45;&#45;lg vc-text&#45;&#45;baseline&#45;&#45;md"
                >{{ params.cardNo }}</span
              >
            </div>
          </div>

          <div
            v-clipboard="params.bankAccount"
            @success="handleSuccess"
            @error="handleError"
            class="vc-margin__lg&#45;&#45;bm vc-flex"
          >
            <div class="vc-text&#45;&#45;right vc-padding&#45;&#45;rt" style="width:30%">
              <span
                class="vc-text&#45;&#45;bold vc-text&#45;&#45;light vc-text&#45;&#45;lg vc-text&#45;&#45;baseline&#45;&#45;md"
                >户主</span
              >
            </div>
            <div class="">
              <span
                class="vc-text&#45;&#45;bold vc-text&#45;&#45;lg vc-text&#45;&#45;baseline&#45;&#45;md"
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
            <div class="vc-text&#45;&#45;right vc-padding&#45;&#45;rt" style="width:30%">
              <span
                class="vc-text&#45;&#45;bold vc-text&#45;&#45;light vc-text&#45;&#45;lg vc-text&#45;&#45;baseline&#45;&#45;md"
                >开户行</span
              >
            </div>
            <div class="">
              <span
                class="vc-text&#45;&#45;bold vc-text&#45;&#45;lg vc-text&#45;&#45;baseline&#45;&#45;md"
                >{{ params.bankName }}</span
              >
            </div>
          </div>
        </div>
      </div>
      <div class="vc-padding&#45;&#45;ad vc-padding__md-lg&#45;&#45;ud vc-text&#45;&#45;center  ">
        <div>
          <p class="vc-margin&#45;&#45;bm">
            <span class="vc-text&#45;&#45;lg vc-text&#45;&#45;bold vv-text&#45;&#45;card"
              >通过银行卡转账支付</span
            >
          </p>
          <p>
            <span class="vc-text&#45;&#45;gray">
              轻触卡号、开户行、户主均可进行复制
            </span>
          </p>
        </div>
      </div>
    </div>

    <div class="vc-margin__lg&#45;&#45;tp" v-if="false">
      <div
        class="vc-text&#45;&#45;white vc-text&#45;&#45;bold vc-text&#45;&#45;center vc-margin&#45;&#45;tp"
      >
        <span class="vc-text&#45;&#45;white vc-text&#45;&#45;bold  ">
          <span class="vc-text&#45;&#45;white-light">倒计时：</span>
          {{ backTime | strTime }}
        </span>
      </div>
    </div>
  </div>
</div>-->
</template>
<style scoped></style>
