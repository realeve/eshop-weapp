import Taro, { useEffect, useState } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import "./index.scss";
import UserIcon from "./user.png";

import { AtInput, AtForm, AtModal, AtModalContent } from "taro-ui";
import { CButton, useInterval } from "@/components";
import CCaptcha, { TCaptchaVal } from "@/components/CCaptcha";
import { reg, now, setSNSendStatus, loadSNSendStatus } from "@/utils/lib";
import { sendSms, ISendSmsParams, ISendSms, SMS_TYPE } from "../../db";
import classname from "classname";
import dayjs from "dayjs";

const LoginPhone = ({ smsType = SMS_TYPE.LOGIN }: { smsType?: number }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [valid, setValid] = useState(false);

  useEffect(() => {
    let phoneValid = reg.phone.test(username);
    setValid(phoneValid && /^\d{6}$/.test(password));

    if (username.length === 11 && !phoneValid) {
      Taro.showToast({
        title: "手机号格式错误",
        icon: "none"
      });
    }
  }, [username, password]);
  const onSubmit = () => {
    const param = { username, password };
    console.log(param);
  };

  const [tryTimes, setTryTimes] = useState(0);
  const [showVerifycode, setShowVerifycode] = useState(false);
  const closeCaptcha = () => setShowVerifycode(!showVerifycode);

  // 验证码是否发送
  const [snSendTime, setSnSendTime] = useState<null | string>(
    loadSNSendStatus()
  );

  const [loading, setLoading] = useState(false);

  const [nextTime, setNextTime] = useState<null | number>(null);

  useInterval(() => {
    if (!snSendTime) {
      return;
    }
    let totalSeconds = Math.max(dayjs().diff(dayjs(snSendTime), "second"), 0);
    setNextTime(60 - totalSeconds);
    if (totalSeconds > 59) {
      setSnSendTime(null);
    }
    console.log(totalSeconds);
  }, 1e3);

  const getCaptcha = async (str: TCaptchaVal) => {
    setSnSendTime(null);

    // 清空storage
    setSNSendStatus(false);

    setLoading(true);
    const params: ISendSmsParams = {
      ...str,
      mobile: username || "",
      sendType: smsType
    };

    let curTime = now();
    setSnSendTime(curTime);
    setSNSendStatus(curTime);

    return;
    console.log(params);

    sendSms(params)
      .then((sendCode: ISendSms) => {
        setLoading(false);
        if (!sendCode.status) {
          Taro.showToast({
            title: "未发送短信验证码：" + sendCode.err,
            icon: "none"
          });

          if ("该手机号未绑定" === sendCode.err) {
            closeCaptcha();
            return;
          }
          setTryTimes(tryTimes + 1);
          return;
        }

        closeCaptcha();

        Taro.atMessage({
          message: "短信已发送，请在10分钟内完成验证。",
          type: "success"
        });

        // 在LS中记录验证码发送状态

        let curTime = now();
        setSnSendTime(curTime);
        setSNSendStatus(curTime);
      })
      .catch(err => {
        setTryTimes(tryTimes + 1);
        setLoading(false);
      });
  };

  const phoneDisabled = username.length === 11 && !reg.phone.test(username);

  return (
    <View className="login-phone" style="position:relative">
      <AtForm onSubmit={onSubmit}>
        <AtInput
          name="username"
          title={<Image className="icon" src={UserIcon} />}
          type="phone"
          placeholder="手机号码"
          value={username}
          onChange={setUsername}
          error={phoneDisabled}
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
          <View
            className={classname("sendSn", {
              disabled: nextTime > 0 || username.length < 11 || phoneDisabled
            })}
            onClick={() =>
              !nextTime &&
              username.length === 11 &&
              !phoneDisabled &&
              setShowVerifycode(true)
            }
          >
            发送验证码{!nextTime ? "" : `(${nextTime})`}
          </View>
        </AtInput>
        <AtModal isOpened={showVerifycode}>
          <AtModalContent>
            <CCaptcha
              onChange={getCaptcha}
              onClose={closeCaptcha}
              retry={tryTimes}
              className="captchaWrap"
            />
          </AtModalContent>
        </AtModal>
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
