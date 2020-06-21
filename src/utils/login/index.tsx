import Taro from "@tarojs/taro";
import { axios, apiId } from "@/utils/axios";
import url from "./url";
import { jump, isWeapp } from "@/utils/lib";
import { ILoginToken, loadMember } from "@/pages/login/db";

import { LocalStorageKeys } from "@/utils/setting";
import fail from "@/components/Toast/fail";
import success from "@/components/Toast/success";

// import * as wx from "@/utils/weixin";

// 微信小程序登录接口
export const login = dispatch =>
  Taro.login({
    success: async function(res) {
      Taro.showLoading();
      if (res.code) {
        //发起网络请求
        let loginToken: ILoginToken | void = await axios({
          url: url.onLogin,
          method: "POST",
          data: {
            code: res.code
          }
        }).catch(() => {
          fail("登录失败");
        });

        Taro.hideLoading();
        if (!loginToken) {
          fail("登录失败");
          return false;
        }

        Taro.setStorage({
          key: LocalStorageKeys.token,
          data: loginToken.token
        });

        await loadMember(dispatch);
        jump({ url: "/pages/user/index" });
      } else {
        fail("登录失败" + res.errMsg);
        return false;
      }
    }
  });

interface IWeixinPay {
  payId: number;
  isPayed: number;
  payParam: {
    appId: string;
    timeStamp: string;
    nonceStr: string;
    package: string;
    signType: string;
    paySign: string;
  };
}

export const pay: (payId: string, callback: () => void) => void = async (
  payId,
  callback
) => {
  let data = {
    payId,
    predepositPay: 0,
    payPwd: ""
  };
  // 支付参数
  const prePay = await axios<IWeixinPay>({
    url: isWeapp ? url.pay : url.mpPay,
    method: "POST",
    data
  });

  let { payParam } = prePay || {};
  if (!payParam) {
    Taro.showModal({ title: "提示", content: "服务错误，支付失败。" });
    return;
  }

  const complete = res => {
    if (
      !["get_brand_wcpay_request:ok", "requestPayment:ok"].includes(res.errMsg)
    ) {
      fail("支付失败").then(() => {
        jump("/pages/user/order/index?state=2");
      });
      return;
    }

    callback();

    success("支付成功").then(() => {
      jump("/pages/user/order/index?state=2");
    });
  };

  if (isWeapp) {
    // https://nervjs.github.io/taro/docs/apis/open-api/payment/requestPayment.html
    // 发起支付调用
    // https://pay.weixin.qq.com/wiki/doc/api/wxa/wxa_api.php?chapter=7_7&index=5
    Taro.requestPayment({
      ...payParam,
      success: function(res) {
        console.log("支付成功");
      },
      fail: function(res) {
        fail("支付失败");
      },
      complete
    });
  } else {
    mpPay(payParam, complete);
  }
};

/**
 * 公众号支付
 * @param param 后端返回的签名参数
 * @param callback 成功处理逻辑
 */
const mpPay = (param, callback) => {
  function onBridgeReady() {
    WeixinJSBridge.invoke(
      "getBrandWCPayRequest",
      {
        appId: apiId, //公众号名称，由商户传入
        signType: "MD5", //微信签名方式：
        ...param
      },
      callback
    );
  }
  if (typeof WeixinJSBridge == "undefined") {
    if (document.addEventListener) {
      document.addEventListener("WeixinJSBridgeReady", onBridgeReady, false);
    } else if (document.attachEvent) {
      document.attachEvent("WeixinJSBridgeReady", onBridgeReady);
      document.attachEvent("onWeixinJSBridgeReady", onBridgeReady);
    }
  } else {
    onBridgeReady();
  }
};
