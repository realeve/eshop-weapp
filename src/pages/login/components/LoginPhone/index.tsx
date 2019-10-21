import Taro, { useState } from "@tarojs/taro";
import { View } from "@tarojs/components";
import "./index.scss";

import { CButton, useSetState } from "@/components";
import MobileWithCode from "../MobileWithCode";
import { SMS_TYPE } from "../../db";
// import { loadPhone } from "@/utils/lib";

const LoginPhone = () => {
  const [account, setAccount] = useSetState<{
    username: string;
    password: string;
  }>({
    username: "",
    password: ""
  });
  const [valid, setValid] = useState(false);

  const onSubmit = () => {
    console.log(account);
  };

  return (
    <View className="login-phone" style="position:relative">
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

export default LoginPhone;
