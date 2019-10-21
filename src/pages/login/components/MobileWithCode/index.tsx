import Taro, { useEffect, useState } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import { AtInput, AtModal, AtModalContent } from "taro-ui";
import classname from "classname";
import dayjs from "dayjs";

import { useInterval, useSetState } from "@/components";
import CCaptcha, { TCaptchaVal } from "@/components/CCaptcha";
import {
  reg,
  now,
  setSNSendStatus,
  loadSNSendStatus,
  setPhone,
  loadPhone
} from "@/utils/lib";
import { sendSms, ISendSmsParams, ISendSms, SMS_TYPE } from "../../db";

import UserIcon from "./user.png";
import "./index.scss";

export interface IAccount {
  username: string;
  password: string;
}
const MobileWithCode = ({
  smsType = SMS_TYPE.LOGIN,
  setValid = () => {},
  onChange = () => {}
}: {
  smsType?: number;
  setValid?: (e: boolean) => void;
  onChange: (e: IAccount) => void;
}) => {
  const [account, setAccount] = useSetState<IAccount>({
    username: loadPhone(),
    password: ""
  });

  useEffect(() => {
    let phoneValid = reg.phone.test(account.username);

    if (account.username.length === 11 && !phoneValid) {
      Taro.showToast({
        title: "手机号格式错误",
        icon: "none"
      });
    }
    const isValid = phoneValid && /^\d{6}$/.test(account.password);
    setValid(isValid);

    if (phoneValid) {
      // 存储手机信息
      setPhone(account.username);
    }

    isValid && onChange(account);
  }, [account]);

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
    if (totalSeconds > 59 || totalSeconds < 0) {
      setSnSendTime(null);
      return;
    }
    setNextTime(60 - totalSeconds);
  }, 1e3);

  const getCaptcha = async (str: TCaptchaVal) => {
    setSnSendTime(null);

    // 清空storage
    setSNSendStatus(false);

    setLoading(true);
    const params: ISendSmsParams = {
      ...str,
      mobile: account.username || "",
      sendType: smsType
    };

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

  const phoneDisabled =
    account.username.length === 11 && !reg.phone.test(account.username);

  return (
    <View className="mobileWithCode">
      <AtInput
        name="username"
        title={<Image className="icon" src={UserIcon} />}
        type="phone"
        placeholder="手机号码"
        value={account.username}
        onChange={username => setAccount({ username })}
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
        value={account.password}
        onChange={password => setAccount({ password })}
      >
        <View
          className={classname("sendSn", {
            disabled:
              nextTime > 0 || account.username.length < 11 || phoneDisabled
          })}
          onClick={() =>
            !nextTime &&
            account.username.length === 11 &&
            !phoneDisabled &&
            setShowVerifycode(true)
          }
        >
          发送验证码{!nextTime ? "" : `(${nextTime})`}
        </View>
      </AtInput>
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

export default MobileWithCode;
