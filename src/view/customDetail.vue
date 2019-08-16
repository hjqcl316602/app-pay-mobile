<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-07-29 10:02:13
 * @LastEditTime: 2019-08-16 10:33:38
 * @LastEditors: Please set LastEditors
 -->
<script>
import { Upload, Pic, Ratio, Tag, Icon } from "../components";
import { Checker } from "store-es";
import {
  getOrderDetail,
  createSocket,
  uploadImage,
  getChatHistory
} from "../request";

import { ImagePreview } from "vant";

export default {
  name: "CustomDeatil",
  components: {
    Upload,
    Pic,
    Ratio,
    Tag,
    Icon
  },
  data() {
    return {
      custom: {
        message: ""
      },
      header: {
        show: false
      },
      params: {
        accessToken: "",
        appId: "",
        orderId: "",
        orderSn: "",
        minChatId: 0,

        uidTo: "",
        uidFrom: "",
        nameFrom: "",
        nameTo: "",

        socketConneted: false,
        socketConnetedCount: 0
      },
      result: {},

      chats: [],

      chat: {
        loading: false,
        pageSize: 20,
        push: {
          loading: false,
          finished: true
        }
      }
    };
  },

  mounted() {
    this.init();
    //this.hanlderHeaderVisibility();
  },
  methods: {
    /**
     * 页面初始化
     */

    async init() {
      let params = (() => {
        let params = this.$route.params;
        let query = this.$route.query;
        this.params.accessToken = params.accessToken;
        this.params.appId = params.appId;
        this.params.orderId = query.orderId;
      })();

      let detail = await this.getOrderDetail(2);

      let list = await this.getChatHistory();

      this.createSocket();
    },

    /**
     * 创建socket
     */
    createSocket() {
      this._socket = createSocket();

      let connect = this._socket.connect(
        {},
        frame => {
          this.$message.success("聊天室已连接，您可以进行聊天了~");
          this.params.socketConneted = true;
          this.params.socketConnetedCount = 0;
          this.subscribeSocketMessage();
        },
        frame => {
          //this.$toast("聊天室连接失败，请检查网络！");
          //this.params.socketConneted = false;
          this.params.socketConnetedCount++;
          console.log(this.params.socketConnetedCount);
          if (this.params.socketConnetedCount == 10) {
            this.$message.danger("聊天室连接失败，请检查网络！");
            this.params.socketConnetedCount = 0;
          } else {
            this.params.socketConneted = false;
            this.createSocket();
          }
        }
      );

      this._socket.debug = function(str) {
        console.log(JSON.stringify(str));
      };
      //this._socket.heartbeat.outgoing = 10000;
      //this._socket.heartbeat.incoming = 0;
    },
    /**
     * 关闭实时通信
     */
    closeSocket() {
      if (this._socket) {
        this._socket.disconnect();
        this.$message.warning("聊天室已关闭！");
      }
    },

    /**
     * 订阅实时聊天信息
     */
    subscribeSocketMessage() {
      this._socket.subscribe(
        "/topic/chatMsg/kh/" + this.params.uidFrom,
        response => {
          let message = JSON.parse(response.body);
          // 会收到全部的信息 需要过滤出当前的订单对应的信息
          if (message["orderId"] == this.params.orderId) {
            this.chats.push(message);
          }

          this.scrollToBottom();
        }
      );
    },

    /**
     * 获取订单详情，并得到聊天需要的参数
     */
    getOrderDetail(loading) {
      return new Promise(resolve => {
        let promise = getOrderDetail(this.params, loading);

        promise.then(res => {
          this.result = Object.assign({}, res);

          this.params.uidFrom =
            this.result["customerId"] + "_" + this.result["subMemId"];

          this.params.uidTo = this.result["memberId"];

          this.params.nameFrom =
            this.result["subDealName"] || this.result["subMemId"];

          this.params.nameTo = this.result["memberName"];

          this.params.orderSn = this.result["orderSn"];

          resolve("detail");
        });
      });
    },
    /**
     * 获取聊天列表
     */
    getChatHistory(more = false) {
      return new Promise(resolve => {
        if (this.chat.loading)
          return this.$message.warning("请稍等，正在获取聊天记录！");
        this.chat.loading = true;

        if (more) {
          this.params.minChatId = this.chats[0]["chatId"];
        } else {
          this.params.minChatId = 0;
        }

        let promise = getChatHistory(this.params, 1);

        promise.then(res => {
          let list = res.reverse();

          this.chat.push.finished = this.chat.pageSize > list.length;

          if (more) {
            this.chats = [...list, ...this.chats];
          } else {
            this.chats = list;

            this.scrollToBottom();
          }

          this.chat.loading = false;

          resolve("list");
        });

        promise.catch(() => {
          this.chat.loading = false;
        });
      });
    },

    /**
     * 处理页面头部的显示和隐藏，判断单击位置是否是头部
     */
    hanlderHeaderVisibility() {
      this._close = e => {
        this.header.show = this.$refs["header"].contains(e.target);
      };
      document.body.addEventListener("click", this._close);
    },
    /**
     * 让滚动条始终在底部
     */
    scrollToBottom() {
      setTimeout(() => {
        var div = this.$refs["body"];
        div.scrollTop = div.scrollHeight;
      }, 300);
    },

    /**
     * 发送消息
     */
    sendSocketMessage(params) {
      let sendParams = {
        uidTo: this.params.uidTo,
        uidFrom: this.params.uidFrom,
        orderId: this.params.orderId,
        orderSn: this.params.orderSn,
        nameFrom: this.params.nameFrom,
        nameTo: this.params.nameTo,
        content: params.content,
        type: params.type,
        appId: this.params.appId,
        accessToken: this.params.accessToken,
        uidType: 1
      };

      this.chats.push(sendParams);

      this.scrollToBottom();

      this._socket.send("/app/message/nologin", {}, JSON.stringify(sendParams));
    },

    /**
     * 发送消息
     */
    sendMessage() {
      let check = new Checker();
      check
        .set(this.custom.message, true, "申诉内容不能为空！")
        .maxLen("申诉内容长度不能超过150", 150);

      if (check.pass) {
        this.sendSocketMessage({
          content: this.custom.message,
          type: 0
        });
        this.custom.message = "";
      } else {
        this.$message.danger(check["message"]);
      }
    },
    /**
     * 选择图片并上传
     */
    async selectPic(value) {
      let res = await uploadImage(value, true, "正在发送图片...");
      this.sendSocketMessage({ content: res["url"], type: 1 });
    },
    /**
     * 加载更多
     */
    loadMore() {
      this.getChatHistory(true);
    },
    /**
     * 预览图片
     */
    showPicture(currentPic) {
      let pics = [];
      this.chats.forEach(item => {
        if (item["type"] === 1) {
          pics.push(item["content"]);
        }
      });
      ImagePreview({
        images: pics,
        startPosition: pics.indexOf(currentPic),
        loop: false
      });
    }
  },
  beforeDestroy() {
    this.closeSocket();
    document.body.removeEventListener("click", this._close);
  }
};
</script>

<template>
  <div class="vv-custom-deatil">
    <div class="vv-body" ref="body">
      <div class="vv-body__content">
        <div class="vc-text--center vc-margin--bm" v-if="!chat.push.finished">
          <span class="vc-text--theme" @click="loadMore">加载更多</span>
        </div>

        <div class="vv-chat">
          <div
            class=" vv-chat__item  vc-margin--bm"
            v-for="(item, i) in chats"
            :class="{
              'is-left': item['uidType'] === 2,
              'is-right': item['uidType'] === 1
            }"
            :key="i"
          >
            <!-- :class="{'is-left':item['type'] === 'left','is-right':item['type'] === 'right'}" -->
            <template v-if="item['uidType'] === 2">
              <div class="vv-chat__head">
                <div class="vv-chat__head--inner vc-flex--center">
                  <span class="vc-text--white vc-text--bold vc-text--sm"
                    >客服</span
                  >
                  <!-- {{ item['nameFrom'] ? item['nameFrom'].split('')[0] : '' }} -->
                </div>
              </div>
              <div>
                <div class="vv-chat__content">
                  <div>
                    <div v-if="item['type'] === 0">
                      <span
                        class="vc-text vc-text--lg vc-text--baseline--md vc-text--break"
                        >{{ item["content"] }}</span
                      >
                    </div>
                    <div
                      v-if="item['type'] === 1"
                      @click="showPicture(item['content'])"
                    >
                      <img
                        :src="item['content']"
                        alt=""
                        style="max-width:200px;max-height:200px"
                      />
                    </div>
                  </div>
                  <i class="vv-chat__point"></i>
                </div>
                <div
                  class="vc-text--left vc-margin__sm--tp vc-margin--lt"
                  v-if="item['sendTimeStr']"
                >
                  <span class=" vc-text--sm" style="color:#ddd">{{
                    item["sendTimeStr"]
                  }}</span>
                </div>
              </div>
            </template>
            <template v-if="item['uidType'] === 1">
              <div>
                <div class="vv-chat__content">
                  <div>
                    <div v-if="item['type'] === 0">
                      <span
                        class="vc-text vc-text--lg vc-text--baseline--md vc-text--break"
                        >{{ item["content"] }}</span
                      >
                    </div>
                    <div
                      v-if="item['type'] === 1"
                      @click="showPicture(item['content'])"
                    >
                      <img
                        :src="item['content']"
                        alt=""
                        style="max-width:200px;max-height:200px"
                      />
                    </div>
                  </div>
                  <i class="vv-chat__point"></i>
                </div>
                <div
                  class="vc-text--right vc-margin__sm--tp vc-margin--rt"
                  v-if="item['sendTimeStr']"
                >
                  <span class=" vc-text--sm" style="color:#ddd">{{
                    item["sendTimeStr"]
                  }}</span>
                </div>
              </div>
              <div class="vv-chat__head">
                <div class="vv-chat__head--inner vc-flex--center">
                  <span class="vc-text--white vc-text--bold vc-text--sm"
                    >我</span
                  >
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>

    <div class="vv-header">
      <div class="vc-text--center" style="line-height:50px">
        <span class="vc-text--bold">{{ result["orderSn"] }}</span>
      </div>
    </div>

    <div class="vv-header" ref="header" v-if="false">
      <div class=" vv-cell vc-flex--between-center vc-border--bm ">
        <span class="vc-text vc-text--break vc-text--bold">
          {{ result["orderSn"] }}
        </span>
        <div>
          <Icon
            name="icon-arrow "
            class="vv-header__switch "
            :class="{ 'is-open': header.show }"
            @click.native.stop="header.show = !header.show"
          ></Icon>
        </div>
      </div>
      <div class="vv-header__detail " :class="{ 'is-show': header.show }">
        <div
          class=" vc-flex vc-content--between vc-border--bm vc-padding__md-lg "
        >
          <div
            class="vc-flex vc-direction--column vc-items--start vc-content--between"
          >
            <span class="vc-margin--bm vc-text--light">{{
              result["payMode"]
            }}</span>
            <span class="vc-text--gray ">{{
              result["advertiseType"] | strAdvertiseType
            }}</span>
          </div>
          <div
            class="vc-flex vc-direction--column vc-items--end vc-content--between"
          >
            <span class="vc-margin--bm vc-text--light"
              >￥{{ result["money"] }}</span
            >
            <span class="vc-text--gray ">{{ result["createTime"] }}</span>
          </div>
        </div>
      </div>

      <div
        class="vv-header__cell vc-flex vc-content--end vc-padding--ud vc-padding__md-lg--ad"
        v-if="false"
      >
        <div class="vc-btn is-circle is-hollow  vc-btn--primary ">
          关闭申诉
        </div>
      </div>
    </div>
    <div class="vv-footer">
      <div class="vv-footer__content">
        <div class="" style="width:28px;">
          <Upload @change="selectPic"></Upload>
        </div>
        <div class="vc-flex--fit">
          <van-field
            v-model="custom.message"
            type="textarea"
            placeholder="请输入您申诉的内容..."
            rows="1"
            :autosize="{ maxHeight: 100, minHeight: 24 }"
          />
        </div>
        <div class="">
          <div
            class="vc-btn vc-btn--primary vc-btn--small is-radius"
            @click="sendMessage"
          >
            发送
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style   scoped>
</style>