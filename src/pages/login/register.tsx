import Taro, { useState, useEffect } from "@tarojs/taro";
import { View } from "@tarojs/components";
import "./register.scss";
import MobileWithCode from "./components/MobileWithCode";
import useSetState from "@/components/hooks/useSetState";
import { SMS_TYPE, ILoginToken, loginSms, CLIENT_TYPE } from "./db";
import fail from "@/components/Toast/fail";
import { CButton } from "@/components";

import { jump } from "@/utils/lib";
import { AtCheckbox } from "taro-ui";

const Register = () => {
  const [account, setAccount] = useSetState<{
    username: string;
    password: string;
  }>({
    username: "",
    password: ""
  });
  const [valid, setValid] = useState(false);
  useEffect(() => {
    setValid(
      account &&
        account.username &&
        account.username.length > 1 &&
        account.password &&
        account.password.length >= 6
    );
  }, [account]);

  const [isAgree, setIsAgree] = useState<string | null>(null);

  const onSubmit = async () => {
    Taro.showLoading({
      title: "注册中"
    });

    let loginToken: ILoginToken | void = await loginSms({
      mobile: account.username,
      smsAuthCode: account.password,
      clientType: CLIENT_TYPE.WECHAT
    }).catch(() => {
      fail("验证码无效");
    });

    Taro.hideLoading();

    jump({ url: "/pages/user/index" });
  };

  return (
    <View className="register-page">
      <View className="title">帐号注册</View>
      <MobileWithCode
        onChange={setAccount}
        smsType={SMS_TYPE.REGISTER}
        setValid={setValid}
      />
      <View className="action">
        <AtCheckbox
          options={[
            {
              value: "agree",
              label: "同意用户协议"
            }
          ]}
          selectedList={[isAgree]}
          onChange={([, e]) => {
            let status = e === "agree";
            setIsAgree(status ? e : "");
          }}
        />

        <CButton
          style={{ marginTop: "10px", width: "100%" }}
          theme="gardient"
          onClick={onSubmit}
          disabled={!valid}
        >
          注册
        </CButton>
      </View>
    </View>
  );
};

Register.config = {
  navigationBarTitleText: "用户注册"
};

export default Register;
