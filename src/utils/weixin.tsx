import { axios } from "./axios";
import qs from "qs";
import { isWeapp } from "./lib";
const wx = require("weixin-js-sdk");

// 公众号配置
const apiId = "wx7a6971dd5ee1ebce";

const needRedirect: () => boolean | string = () => {
  const url: string = window.location.href.split("#")[0];
  const redirectUrl: string = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${apiId}&redirect_uri=${encodeURIComponent(
    url
  )}&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect`;

  let hrefArr: string[] = window.location.href.split("?");
  if (hrefArr.length == 1) {
    window.location.href = redirectUrl;
    return false;
  }
  let params = qs.parse(hrefArr[1]);
  return params.code;
};

export const initShare: (goods: {
  title: string;
  subTitle: string;
  img?: string;
}) => void = async goods => {
  if (isWeapp) {
    return;
  }
  const url: string = window.location.href.split("#")[0];
  let data = await axios({
    url: "/wx/mp/jsapi/signature",
    params: {
      url
    }
  });
  let config = {
    debug: false,
    appId: data.appId, // appId
    timestamp: data.timestamp, // 签名用的时间戳
    nonceStr: data.nonceStr, // 签名用的随机字符串
    signature: data.signature, // 签名结果
    jsApiList: [
      "onMenuShareAppMessage",
      "onMenuShareTimeline",
      "onMenuShareQQ",
      "onMenuShareWeibo",
      "onMenuShareQZone",
      "hideMenuItems"
      // "getNetworkType"
    ]
  };
  wx.config(config);
  configShare(goods);
};

const configShare: (goods: {
  title: string;
  subTitle: string;
  img?: string;
}) => void = goods => {
  // 商品链接
  const url: string = window.location.href.split("#")[0];

  wx.ready(() => {
    let option = {
      title: goods.title,
      desc: goods.subTitle,
      link: url,
      imgUrl: (
        goods.img || "https://static.ccgold.cn/public/web/logo/headerLogo.png"
      ).split("?")[0],
      type: "",
      dataUrl: "",
      success: function() {
        // 记录分享次数
      },
      cancel: function() {}
    };
    wx.onMenuShareAppMessage(option);
    wx.onMenuShareTimeline(option);
    wx.onMenuShareQQ(option);
    wx.onMenuShareWeibo(option);
    wx.onMenuShareQZone(option);
  });
};
