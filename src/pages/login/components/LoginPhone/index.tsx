import Taro, { useEffect, useState } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import "./index.scss";
import UserIcon from "./user.png";

import { AtInput, AtForm, AtToast } from "taro-ui";
import { CButton } from "@/components";
import CCaptcha, { TCaptchaVal } from "@/components/CCaptcha";
import { reg, now } from "@/utils/lib";
import { sendSms, ISendSmsParams, ISendSms } from "../../db";

const LoginPhone = ({ smsType = 0 }: { smsType?: number }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [valid, setValid] = useState(false);

  const [toast, setToast] = useState<{
    isOpened: boolean;
    text?: string;
    status?: "error" | "loading" | "success";
  }>({
    isOpened: false
  });

  useEffect(() => {
    let phoneValid = reg.phone.test(username);
    setValid(phoneValid && /^\d{6}$/.test(password));

    if (username.length === 11 && !phoneValid) {
      setToast({
        isOpened: true,
        text: "手机号格式错误",
        status: "error"
      });
      return;
    }
    setToast({ isOpened: false });
  }, [username, password]);
  const onSubmit = () => {
    const param = { username, password };
    console.log(param);
  };

  const [tryTimes, setTryTimes] = useState(0);
  const [showVerifycode, setShowVerifycode] = useState(false);
  const closeCaptcha = () => setShowVerifycode(!showVerifycode);

  // 验证码是否发送
  const [snSendTime, setSnSendTime] = useState<null | string>(null);

  const [loading, setLoading] = useState(false);

  const getCaptcha = async (str: TCaptchaVal) => {
    setSnSendTime(null);

    setLoading(true);
    const params: ISendSmsParams = {
      ...str,
      mobile: username || "",
      sendType: smsType
    };

    console.log(params);
    closeCaptcha();
    return;

    sendSms(params)
      .then((sendCode: ISendSms) => {
        setLoading(false);
        if (!sendCode.status) {
          //   message.error("未发送短信验证码：" + sendCode.err);
          if ("该手机号未绑定" === sendCode.err) {
            setShowVerifycode(false);
            return;
          }
          setTryTimes(tryTimes + 1);
          return;
        }

        setShowVerifycode(false);
        // setTipInfo({
        //   message: "短信已发送，请在10分钟内完成验证。",
        //   type: "warning"
        // });

        // 在LS中记录验证码发送状态
        setSnSendTime(now());
      })
      .catch(err => {
        setTryTimes(tryTimes + 1);
        setLoading(false);
      });
  };

  return (
    <View className="login-phone" style="position:relative">
      <AtToast {...toast} />

      <AtForm onSubmit={onSubmit}>
        <AtInput
          name="username"
          title={<Image className="icon" src={UserIcon} />}
          type="phone"
          placeholder="手机号码"
          value={username}
          onChange={setUsername}
          error={username.length === 11 && !reg.phone.test(username)}
          clear
          autoFocus
        />
        <AtInput
          name="password"
          title={<View className="at-icon at-icon-lock" />}
          type="number"
          maxLength="6"
          minLength="6"
          placeholder="6位验证码"
          value={password}
          onChange={setPassword}
        >
          <View className="sendSn" onClick={() => setShowVerifycode(true)}>
            发送验证码
          </View>
        </AtInput>
        {showVerifycode && (
          <CCaptcha
            onChange={getCaptcha}
            onClose={closeCaptcha}
            className="captchaWrap"
            retry={tryTimes}
          />
        )}
        <View className="action">
          <CButton theme="gardient" formType="submit" disabled={!valid}>
            登录
          </CButton>
        </View>
      </AtForm>
    </View>
  );
};

export default LoginPhone;
