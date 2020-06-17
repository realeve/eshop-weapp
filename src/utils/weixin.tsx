import { axios } from "./axios";
import qs from "qs";
import { isWeapp } from "./lib";
import { API } from "@/utils/setting";

import { set as setGlobalData } from "@/utils/global_data";

import { loadMember } from "@/pages/login/db";
import { jump } from "@/utils/lib";
import { Dispatch } from "redux";

const wx = require("weixin-js-sdk");

// 公众号配置
const apiId = "wx7a6971dd5ee1ebce";

export const isWXBrowser = navigator.userAgent
  .toLocaleLowerCase()
  .includes("micromessenger");

// 在用户个人中心页面唤起页面调用
/**
 * 场景1：手机号已登录————loadMember获取用户信息——————存储用户信息——————未绑定微信身份时，调用该接口
 * 场景2：手机号未登录————直接调用该接口——————未返回token————跳转到登录页手机登录；
 * 场景3：上述场景中返回了token，说明已绑定，直接自动登录; *
 *
 */
export const bindWXInfo: (
  dispatch: Dispatch
) => Promise<boolean | { token: string }> = async dispatch => {
  // 小程序 || 已登录不用继续认证
  if (isWeapp) {
    return false;
  }

  // 非微信浏览器
  if (!isWXBrowser) {
    return false;
  }

  //本地获取token
  const url: string = window.location.href.split("#")[0];
  const redirectUrl: string = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${apiId}&redirect_uri=${encodeURIComponent(
    url
  )}&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect`;

  let hrefArr: string[] = window.location.href.split("?");

  // 满足以上条件，同时参数中没有code的链接，将302跳转到微信页面，请求获取用户身份。
  if (hrefArr.length == 1) {
    window.location.href = redirectUrl;
    return false;
  }
  // 微信重新跳转回来之后的结果，拿到code
  let params = qs.parse(hrefArr[1]);
  let code = params.code;

  await axios({
    method: "post",
    url: API.LOGIN_WX_H5 as string,
    data: { code }
  })
    .then(async res => {
      // 新用户无法获取token,跳转到登录页
      if (res.token.length === 0) {
        jump({ url: "/pages/login/index" });
      }

      // 如果登录有结果，拿token换身份信息
      setGlobalData("token", res.token);
      // 在loginSms之后，用户信息的token已经载入，但token存储入全局变量为异步，此时loadMember会出现token为空校验失败。
      await loadMember(dispatch);
      setTimeout(() => {
        jump({ url: "/pages/user/index" });
      }, 100);
    })
    .catch(e => {
      // 新用户无法获取token,跳转到登录页
      jump({ url: "/pages/login/index" });
    });

  return true;
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
