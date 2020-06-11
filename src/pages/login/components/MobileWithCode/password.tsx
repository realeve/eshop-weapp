import Taro, { useEffect } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { AtInput } from "taro-ui";
import useSetState from "@/components/hooks/useSetState";
import fail from "@/components/Toast/fail";
import "./password.scss";

export interface IAccount {
  username: string;
  password: string;
}
const MobileWithCode = ({
  setValid = () => {},
  onChange = () => {}
}: {
  setValid?: (e: boolean) => void;
  onChange: (e: IAccount) => void;
}) => {
  const [account, setAccount] = useSetState<IAccount>({
    memberPwd: "",
    memberPwdRepeat: ""
  });

  useEffect(() => {
    let pwdValid = account.memberPwd.trim().length >= 8;
    let pwd2Valid = account.memberPwdRepeat.trim().length >= 8;
    const isValid = pwdValid && pwd2Valid;
    if (!isValid) {
      return;
    }

    if (account.memberPwd !== account.memberPwdRepeat) {
      fail("两次密码不一致");
    }
    setValid(isValid);
    isValid && onChange(account);
  }, [account]);

  return (
    <View className="mobileWithCode">
      <View className="item">
        <View className="at-icon at-icon-lock" />
        <AtInput
          name="memberPwd"
          type="password"
          placeholder="登录密码,不少于8位"
          value={account.memberPwd}
          onChange={memberPwd => setAccount({ memberPwd })}
        />
      </View>

      <View className="item">
        <View className="at-icon at-icon-lock" />
        <AtInput
          name="memberPwdRepeat"
          type="password"
          placeholder="再次确认密码"
          value={account.memberPwdRepeat}
          onChange={memberPwdRepeat => setAccount({ memberPwdRepeat })}
        />
      </View>
    </View>
  );
};

export default MobileWithCode;
