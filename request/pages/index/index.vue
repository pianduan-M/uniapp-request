<template>
  <view class="content">
    <image class="logo" src="/static/logo.png"></image>
    <view class="text-area">
      <text class="title">{{ title }}</text>
    </view>
  </view>
</template>

<script>
import { Request } from "../../request.js";

const request = new Request({
  baseUrl: "http://192.168.1.95:3022",
});

request.interceptors.request.use(
  (config) => {
    console.log(config, "interceptors request success 1");

    return config;
  },
  (error) => {
    console.log(
      typeof error,
      error instanceof Error,
      "interceptors request error 1"
    );
    console.log(error, "interceptors request error 1");
    return error;
  }
);

request.interceptors.request.use(
  (config) => {
    console.log(config, "interceptors request success 2");

    return config;
  },
  (error) => {
    console.log(error, "interceptors request error 2");
    return error;
  }
);

request.interceptors.response.use(
  (response) => {
    console.log(response, "interceptors response success 1");
    const { response: res } = response;
    if (res.data.code !== 0) {
      return Promise.reject(res.data);
    }
    return res.data;
  },
  (error) => {
    console.log(error, "interceptors response error 1");
    return Promise.reject(error);
  }
);

request.interceptors.response.use(
  (response) => {
    console.log(response, "interceptors response success 2");
    // xx = 1
    return response;
  },
  (error) => {
    // console.log(typeof error, error instanceof Error);
    console.log(error, "interceptors response error 2");
    return Promise.reject(error);
  }
);

export default {
  data() {
    return {
      title: "Hello",
    };
  },
  onLoad() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      const res = await request
        .get({
          url: "/error",
        })
        .catch((err) => {
          console.log(err, "result error");
        });
      console.log(res, "result success");
    },
  },
};
</script>

<style>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo {
  height: 200rpx;
  width: 200rpx;
  margin-top: 200rpx;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 50rpx;
}

.text-area {
  display: flex;
  justify-content: center;
}

.title {
  font-size: 36rpx;
  color: #8f8f94;
}
</style>
