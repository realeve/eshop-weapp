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
