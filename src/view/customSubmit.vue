<script>
import { Upload, Pic, Ratio, Tag, Icon } from "../components";
import { uploadImage, createOrderCustom } from "../request";
import { Checker } from "store-es";

export default {
  name: "Custom",
  components: {
    Upload,
    "vc-image": Pic,
    "vc-ratio": Ratio,
    "vc-tag": Tag,
    "vc-icon": Icon
  },

  data() {
    return {
      params: {
        accessToken: "",
        appId: "",
        orderId: "",
        remark: "", // 长度150
        image: []
      },
      result: {}
    };
  },

  mounted() {
    this.init();
  },

  methods: {
    /**
     * 页面初始化
     */
    init() {
      let params = this.$route.params;
      let query = this.$route.query;
      this.params.accessToken = params.accessToken;
      this.params.appId = params.appId;
      this.params.orderId = query.orderId;
      let detail = sessionStorage.getItem("app/order/custom/detail");
      this.result = Object.assign({}, detail ? JSON.parse(detail) : {});
    },
    /**
     * 提交订单申诉
     */
    createOrderCustom() {
      let check = new Checker();
      check
        .set(this.params.remark, true, "请输入您的申述内容")
        .maxLen("申述内容长度不能超过150", 150);
      if (check.pass) {
        this.params.pics = this.params.image.join(",");

        let promise = createOrderCustom(this.params);

        promise.then(res => {
          this.params.pics = "";
          this.params.image = [];
          this.params.remark = "";
          sessionStorage.setItem("app/order/tab/active", "custom");
          setTimeout(() => {
            this.$router.replace({
              name: "CustomDetail",
              query: { orderId: this.params.orderId }
            });
          }, 500);
        });
      } else {
        this.$Toast(check["message"]);
      }
    },

    /**
     * 删除图片
     */
    delImage(i) {
      this.params.image = this.params.image.filter((item, index) => {
        return i !== index;
      });
    },
    /**
     * 选择图片
     */
    async selectFile(value) {
      let res = await uploadImage(value);
      this.params.image.unshift(res["url"]);
    }
  }
};
</script>

<template>
  <div class="vv-page">
    <div class="vc-fluid--h-min vp-bg vc-padding__lg--ad">
      <div class="vc-margin--bm ">
        <div
          class="vc-flex--between-center vc-padding__md-lg--ud vc-border--bm"
        >
          <span class="vc-text vc-text--bold vc-text--break">{{
            result["orderSn"]
          }}</span>
        </div>
        <div class="vc-flex vc-content--between  vc-padding__md-lg--ud">
          <div
            class="vc-flex vc-direction--column vc-items--start vc-content--between"
          >
            <span class="vc-margin--bm vc-text--light">{{
              result["payMode"]
            }}</span>
            <span class="vc-text--gray">{{
              result["advertiseType"] | strAdvertiseType
            }}</span>
          </div>
          <div
            class="vc-flex vc-direction--column vc-items--end vc-content--between"
          >
            <span class="vc-margin--bm vc-text--light"
              >￥{{ result["money"] }}</span
            >
            <span class="vc-text--gray">{{ result["createTime"] }}</span>
          </div>
        </div>
      </div>
      <div class="vc-margin--bm  ">
        <div class="vc-border--bm vc-padding--ud">
          <span class="vc-text--bold vc-text--light"> 申诉内容 </span>
        </div>
        <div class="vc-text--bold vc-text--light"></div>
        <div class="van-no-padding vc-padding--ud">
          <van-field
            v-model="params.remark"
            type="textarea"
            placeholder="请输入您申诉的内容..."
            rows="4"
          />
        </div>
      </div>
      <div class="vc-margin--bm">
        <div class="vc-border--bm vc-padding--ud">
          <span class="vc-text--bold vc-text--light"> 申诉凭证 </span>
        </div>
        <div class="vc-padding--ud">
          <div class="vc-row" data-gutter="10">
            <div
              class="vc-col--06 vc-margin--bm"
              v-if="params.image.length < 5"
            >
              <Upload @change="selectFile"></Upload>
            </div>
            <div
              class="vc-col--06 vc-margin--bm"
              v-for="(item, i) in params.image"
              :key="i"
            >
              <vc-ratio>
                <vc-tag block>
                  <vc-image :src="item" type="cover-width"></vc-image>
                  <vc-icon
                    slot="child"
                    name="icon-close"
                    color="#fff"
                    :size="12"
                    @click.native="delImage(i)"
                  ></vc-icon>
                </vc-tag>
              </vc-ratio>
            </div>
          </div>
        </div>
      </div>
      <div class="vc-margin--bm">
        <div
          class="vc-btn vc-btn--primary is-radius"
          @click="createOrderCustom"
        >
          提交
        </div>
      </div>
    </div>
  </div>
</template>

<style   scoped>
</style>