import Taro, { useState, useEffect } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import "./register.scss";
import MobileWithCode from "./components/MobileWithCode";
import useSetState from "@/components/hooks/useSetState";
import { SMS_TYPE, registerMobile, CLIENT_TYPE } from "./db";
import fail from "@/components/Toast/fail";
import { CButton } from "@/components";

import { jump } from "@/utils/lib";
import { AtCheckbox } from "taro-ui";

import Password from "./components/MobileWithCode/password";

import success from "@/components/Toast/success";

const Register = () => {
  const [account, setAccount] = useSetState<{
    username: string;
    password: string;
  }>({
    username: "",
    password: ""
  });
  const [valid, setValid] = useState(false);
  const [validPsw, setValidPsw] = useState(false);
  useEffect(() => {
    setValid(
      account &&
        account.username &&
        account.username.length > 1 &&
        account.password &&
        account.password.length >= 6
    );
  }, [account]);

  const [psw, setPsw] = useSetState({
    memberPwd: "",
    memberPwdRepeat: ""
  });

  const [isAgree, setIsAgree] = useState<string | null>(null);

  const onSubmit = async () => {
    Taro.showLoading({
      title: "注册中"
    });

    let params = {
      mobile: account.username,
      smsAuthCode: account.password,
      ...psw,
      clientType: CLIENT_TYPE.WECHAT
    };

    registerMobile(params)
      .catch(a => {
        fail(a.message);
      })
      .then(async res => {
        if (!res) {
          return;
        }
        await success("注册成功");
        jump("/pages/login/index");
      })
      .finally(() => {
        Taro.hideLoading();
      });
  };

  return (
    <View className="register-page">
      <View className="title">帐号注册</View>
      <MobileWithCode
        onChange={setAccount}
        smsType={SMS_TYPE.REGISTER}
        setValid={setValid}
      />

      <Password onChange={setPsw} setValid={setValidPsw} />

      <View className="action">
        <View className="fields">
          <AtCheckbox
            options={[
              {
                value: "agree",
                label: ""
              }
            ]}
            selectedList={[isAgree]}
            onChange={([, e]) => {
              let status = e === "agree";
              setIsAgree(status ? e : "");
            }}
          />
          <View>
            点击下一步即代表阅读并同意
            <Text
              className="link"
              onClick={() => {
                jump("/pages/help/view?page=login");
              }}
            >
              《用户协议》
            </Text>
            和
            <Text
              className="link"
              onClick={() => {
                jump("/pages/help/view?page=privacy");
              }}
            >
              《隐私政策》
            </Text>
          </View>
        </View>

        <CButton
          style={{ marginTop: "20px", width: "100%" }}
          theme="gardient"
          onClick={onSubmit}
          disabled={!valid || !validPsw || isAgree == ""}
        >
          下一步
        </CButton>
      </View>
    </View>
  );
};

Register.config = {
  navigationBarTitleText: "用户注册"
};

export default Register;
