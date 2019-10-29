import Taro, { useState } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import "./index.scss";
import DefaultAvatar from "@/pages/user/components/userHeader/headerLogo.png";
import { AtTabs, AtTabsPane } from "taro-ui";
import LoginPhone from "./components/LoginPhone";
import LoginPassword from "./components/LoginPassword";

// interface IProps {
//   [key: string]: any;
// }
const Login = () => {
  const tabList = [{ title: "手机号登录" }, { title: "账号密码登录" }];
  const [current, setCurrent] = useState(0);

  return (
    <View className="login-page">
      <View className="logo">
        <Image src={DefaultAvatar} className="img" />
      </View>
      <AtTabs
        current={current}
        swipeable={false}
        tabList={tabList}
        onClick={setCurrent}
      >
        <AtTabsPane current={current} index={0}>
          <LoginPhone />
        </AtTabsPane>
        <AtTabsPane current={current} index={1}>
          {/* <View style="padding: 100px 50px;background-color: #FAFBFC;text-align: center;"> */}
          <LoginPassword />
          {/* </View> */}
        </AtTabsPane>
      </AtTabs>

      <View className="register">没有账号？现在注册</View>
    </View>
  );
};

Login.config = {
  navigationBarTitleText: "登录"
};

export default connect(({ common }) => common)(Login as any);
