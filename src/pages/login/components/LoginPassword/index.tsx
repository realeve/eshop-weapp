import Taro, { useState, useEffect } from "@tarojs/taro";
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
import { LocalStorageKeys } from "@/utils/setting";

import fail from "@/components/Toast/fail";
import { jump, loadPhone } from "@/utils/lib";
import { storePhone } from "@/pages/login/db";
import { RESPONSE_CODES } from "@/utils/axios";

const LoginPassword = ({ callback, dispatch }) => {
  const [account, setAccount] = useSetState<{
    username: string;
    password: string;
  }>({
    username: loadPhone(),
    password: ""
  });
  const [valid, setValid] = useState(false);
  const [showVerifycode, setShowVerifycode] = useState(false);
  const [tryTimes, setTryTimes] = useState(0);

  useEffect(() => {
    setValid(
      account &&
        account.username &&
        account.username.length > 1 &&
        account.password &&
        account.password.length >= 8
    );
  }, [account]);

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
      Taro.showToast({
        title: res.message, //"验证码无效",
        icon: "none"
      });
    });
    Taro.hideLoading();
    callback && callback();
    if (!loginToken) {
      Taro.showToast({
        title: "账户信息输入错误,请重新输入", //"验证码无效",
        icon: "none"
      });

      return;
    }

    // 在loginSms之后，用户信息的token已经载入，但token存储入全局变量为异步，此时loadMember会出现token为空校验失败。
    await loadMember(dispatch);

    jump({ url: "/pages/user/index" });
  };

  const onSubmit = async () => {
    setShowVerifycode(true);
  };

  return (
    <View className="login-password">
      <View className="item">
        <Image className="icon" src={UserIcon} />
        <AtInput
          name="username"
          type="phone"
          placeholder="手机号码"
          value={account.username}
          onChange={username => {
            setAccount({ username });
            storePhone(username);
          }}
          // error={phoneDisabled}
          clear
          autoFocus
        />
      </View>
      <View className="item">
        <View className="at-icon at-icon-lock" />
        <AtInput
          name="password"
          type="password"
          maxLength="20"
          minLength="6"
          placeholder="请输入8~20位密码"
          value={account.password}
          onChange={password => setAccount({ password })}
          // onConfirm={onSubmit}
        ></AtInput>
      </View>
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
