import Taro from "@tarojs/taro";
import { axios } from "@/utils/axios";
import url from "./url";
import { jump } from "@/utils/lib";
import { ILoginToken, loadMember } from "@/pages/login/db";

import { LocalStorageKeys } from "@/utils/setting";
import fail from "@/components/Toast/fail";

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

export const pay: (payId: string, callback: () => void) => void = (
  payId,
  callback
) => {
  let data = {
    payId,
    predepositPay: 0,
    payPwd: ""
  };
  // 支付参数
  const payParam = axios<IWeixinPay>({
    url: url.pay,
    method: "POST",
    data
  });

  // https://nervjs.github.io/taro/docs/apis/open-api/payment/requestPayment.html
  // 发起支付调用
  // https://pay.weixin.qq.com/wiki/doc/api/wxa/wxa_api.php?chapter=7_7&index=5
  Taro.requestPayment({
    ...payParam,
    success: function(res) {
      console.log("支付成功");
    },
    fail: function(res) {
      Taro.showModal({
        title: "提示",
        content: "支付失败"
      });
    },
    complete: function(res) {
      if (res.errMsg != "requestPayment:ok") {
        return;
      }

      callback();

      Taro.showModal({
        title: "提示",
        content: "支付成功"
      });

      setTimeout(function() {
        jump("/pages/user/order/index?state=2");
      }, 2000);
    }
  });
};
