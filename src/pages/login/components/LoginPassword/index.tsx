import Taro, { useState } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import "./index.scss";
import { connect } from "@tarojs/redux";
import { CButton } from "../../../../components";
import useSetState from "@/components/hooks/useSetState";
import CCaptcha, { TCaptchaVal } from "../../../../components/CCaptcha";
import { AtInput, AtModal, AtModalContent } from "taro-ui";
import {
  SMS_TYPE,
  ILoginToken,
  loginSms,
  CLIENT_TYPE,
  loadMember,
  loginPsw
} from "../../db";
import UserIcon from "./user.png";
import { IGlobalModel } from "../../../../models/common";

import { jump } from "@/utils/lib";

const LoginPassword = ({ callback, dispatch }) => {
  const [account, setAccount] = useSetState<{
    username: string;
    password: string;
  }>({
    username: "",
    password: ""
  });
  const [valid, setValid] = useState(false);
  const [showVerifycode, setShowVerifycode] = useState(false);
  const [tryTimes, setTryTimes] = useState(0);

  const closeCaptcha = () => setShowVerifycode(!showVerifycode);

  const getCaptcha = async (str: TCaptchaVal) => {
    setTryTimes(tryTimes + 1);
    closeCaptcha();

    let loginToken: ILoginToken | void = await loginPsw({
      memberName: account.username,
      password: account.password,
      captchaVal: str.captchaVal,
      captchaKey: str.captchaKey,
      clientType: CLIENT_TYPE.WAP
    }).catch(res => {
      // console.log(res);
      Taro.showToast({
        title: res.message, //"验证码无效",
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

    jump({ url: "/pages/user/index" });
  };

  const onSubmit = async () => {
    setShowVerifycode(true);
  };

  return (
    <View className="login-password">
      <AtInput
        name="username"
        title={<Image className="icon" src={UserIcon} />}
        type="phone"
        placeholder="请输入登录手机号码"
        value={account.username}
        onChange={username => setAccount({ username })}
        // error={phoneDisabled}
        clear
        autoFocus
      />
      <AtInput
        name="password"
        title={<View className="at-icon at-icon-lock" />}
        type="password"
        maxLength="20"
        minLength="8"
        placeholder="请输入8~20位密码"
        value={account.password}
        onChange={password => {
          setAccount({ password });
          setValid(password.length > 0);
        }}
      />
      <View className="action">
        <CButton theme="gardient" onClick={onSubmit} disabled={!valid}>
          登录
        </CButton>
      </View>
      {showVerifycode && (
        <AtModal isOpened>
          <AtModalContent>
            <CCaptcha
              onChange={getCaptcha}
              onClose={closeCaptcha}
              retry={tryTimes}
              className="captchaWrap"
            />
          </AtModalContent>
        </AtModal>
      )}
    </View>
  );
};

export default connect(({ user, isLogin }: IGlobalModel) => ({
  user,
  isLogin
}))(LoginPassword as any);
