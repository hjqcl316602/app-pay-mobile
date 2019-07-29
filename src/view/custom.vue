<script>
import { List } from "vant";
import { getOrder, getOrderCustom } from "../request";

export default {
  name: "Custom",
  components: {
    "van-list": List
  },
  data() {
    return {
      tab: {
        active:
          sessionStorage.getItem("app/order/tab/active") === "custom" ? 1 : 0
      },
      params: {
        accessToken: "",
        appId: "",
        pageNum: 1,
        pageSize: 10,
        loading: false,
        push: {
          loading: false,
          finished: false,
          finishedText: ""
        }
      },
      result: []
    };
  },
  beforeMount() {},
  mounted() {
    console.log(Stomp);
    this.init();
  },
  methods: {
    /**
     * 页面初始化
     */
    init() {
      let params = this.$route.params;
      this.params.accessToken = params.accessToken;
      this.params.appId = params.appId;
      this.getList();
    },

    /**
     * 获取订单,申诉订单
     */
    getList(more = false) {
      if (this.params.loading) return;

      this.params.loading = true;

      if (more) {
        this.params.pageNum++;
      } else {
        this.params.pageNum = 1;
        this.params.push.finished = true;
        this.result = [];
      }
      if (this.tab.active === 0) {
        getOrder(this.params, 3).then(
          response => {
            console.log(response);

            this.params.loading = false;

            this.params.push.loading = false;

            this.params.push.finished = response.length < this.params.pageSize;

            this.result = more ? [...this.result, ...response] : [...response];
          },
          () => {
            this.params.pageNum--;
            this.params.loading = false;
            this.params.push.loading = false;

            console.log("reject");
          }
        );
      } else {
        getOrderCustom(this.params, 3).then(
          response => {
            console.log(response);

            this.params.loading = false;

            this.params.push.loading = false;

            this.params.push.finished = response.length < this.params.pageSize;

            this.result = more ? [...this.result, ...response] : [...response];
          },
          () => {
            this.params.pageNum--;
            this.params.loading = false;
            this.params.push.loading = false;
          }
        );
      }
    },
    /**
     * 申诉前
     */
    onLoadList() {},
    /**
     * 订单处理
     */
    handlerCustom(item, index, type) {
      sessionStorage.setItem("app/order/custom/detail", JSON.stringify(item));
      if (type === "custom") {
        this.$router.push({
          name: "CustomSubmit",
          query: { orderId: item["orderId"] }
        });
      } else if (type === "detail") {
        this.$router.push({
          name: "CustomDetail",
          query: { orderId: item["orderId"] }
        });
      }
    }
  },
  watch: {
    ["tab.active"]: {
      handler(val) {
        sessionStorage.setItem(
          "app/order/tab/active",
          val === 0 ? "all" : "custom"
        );
        this.result = [];
        this.getList();
      }
    }
  }
};
</script>

<template>
  <div class="vv-custom">
    <div class="vv-header">
      <van-tabs v-model="tab.active">
        <van-tab title="全部订单"></van-tab>
        <van-tab title="申诉订单"></van-tab>
      </van-tabs>
    </div>

    <div class="vv-content" v-if="result.length > 0">
      <van-list
        v-model="params.push.loading"
        :finished="params.push.finished"
        :finished-text="params.push.finishedText"
        @load="getList(true)"
      >
        <div
          class="vv-content__item "
          v-for="(item, i) in result"
          :key="i"
          @click="
            handlerCustom(item, i, tab.active === 0 ? 'custom' : 'detail')
          "
        >
          <div
            class="vc-flex vc-content--between vc-border--bm  vc-padding__md-lg"
          >
            <span class=" vc-text--bold">{{ item["orderSn"] }}</span>
            <span
              class=" vc-text--bold vc-text--danger"
              :class="{
                'vc-text--danger': item['status'] === 0 || item['status'] === 1
              }"
            >
              {{ item["status"] | strOrderStatus }}</span
            >
          </div>

          <div class="vc-flex vc-content--between   vc-padding__md-lg ">
            <div
              class="vc-flex vc-direction--column vc-items--start vc-content--between"
            >
              <span class="vc-margin--bm vc-text--light">{{
                item["payMode"]
              }}</span>
              <span class="vc-text--gray  ">{{
                item["advertiseType"] | strAdvertiseType
              }}</span>
            </div>
            <div
              class="vc-flex vc-direction--column vc-items--end vc-content--between"
            >
              <span class="vc-margin--bm vc-text--light"
                >￥{{ item["money"] }}</span
              >
              <span class="vc-text--gray  ">{{ item["createTime"] }}</span>
            </div>
          </div>

          <div class="vc-padding__md-lg vc-flex vc-content--end" v-if="false">
            <div
              v-if="tab.active === 0"
              class="vc-btn is-circle is-hollow  vc-btn--primary "
              @click="handlerCustom(item, i, 'custom')"
            >
              去申诉
            </div>
            <div
              v-if="tab.active === 1"
              class="vc-btn is-circle is-hollow  vc-btn--danger vc-margin__lg--rt"
              @click="handlerCustom(item, i, 'close')"
            >
              关闭申诉
            </div>
            <div
              v-if="tab.active === 1"
              class="vc-btn is-circle is-hollow  vc-btn--primary "
              @click="handlerCustom(item, i, 'detail')"
            >
              查看详情
            </div>
          </div>
        </div>
      </van-list>
    </div>

    <div
      style="height:100vh"
      class="vc-flex--center"
      v-if="result.length === 0 && !params.loading"
    >
      <span class="vc-text--light" v-if="tab.active === 0">~暂无订单~</span>
      <span class="vc-text--light" v-if="tab.active === 1">~暂无申诉订单~</span>
    </div>
  </div>
</template>

<style   scoped>
</style>