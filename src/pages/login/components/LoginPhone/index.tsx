import Taro, { useState } from "@tarojs/taro";
import { View } from "@tarojs/components";
import "./index.scss";
import { connect } from "@tarojs/redux";

import { CButton, useSetState, useTimeoutFn } from "@/components";
import MobileWithCode from "../MobileWithCode";
import {
  SMS_TYPE,
  ILoginToken,
  loginSms,
  CLIENT_TYPE,
  loadMember
} from "../../db";

import { IGlobalModel } from "@/models/common";

const LoginPhone = ({ callback, dispatch }) => {
  const [account, setAccount] = useSetState<{
    username: string;
    password: string;
  }>({
    username: "",
    password: ""
  });
  const [valid, setValid] = useState(false);

  const onSubmit = async () => {
    Taro.showLoading();

    let loginToken: ILoginToken | void = await loginSms({
      mobile: account.username,
      smsAuthCode: account.password,
      clientType: CLIENT_TYPE.WECHAT
    }).catch(() => {
      Taro.showToast({
        title: "验证码无效",
        icon: "none"
      });
    });

    if (!loginToken) {
      Taro.hideLoading();
      return;
    }

    if (!loginToken.token && loginToken.statusText) {
      Taro.atMessage({
        type: "warning",
        message: "登录失败：" + loginToken.statusText
      });

      Taro.hideLoading();
      return;
    }

    callback && callback();

    // 在loginSms之后，用户信息的token已经载入，但token存储入全局变量为异步，此时loadMember会出现token为空校验失败。
    setTimeout(() => {
      loadMember(dispatch);
    }, 500);

    // 载入购物车
    // loadShoppingCart(dispatch);

    Taro.hideLoading();

    Taro.switchTab({ url: "/pages/user/index" });
  };

  return (
    <View className="login-phone">
      <MobileWithCode
        onChange={setAccount}
        smsType={SMS_TYPE.LOGIN}
        setValid={setValid}
      />
      <View className="action">
        <CButton theme="gardient" onClick={onSubmit} disabled={!valid}>
          登录
        </CButton>
      </View>
    </View>
  );
};

export default connect(({ common: { user, isLogin } }: IGlobalModel) => ({
  user,
  isLogin
}))(LoginPhone as any);
