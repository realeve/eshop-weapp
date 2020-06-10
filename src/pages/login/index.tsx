import Taro, { useState } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import "./index.scss";
import { AtTabs, AtTabsPane } from "taro-ui";
// import CTabs from "@/pages/detail/components/detail/tabs";
import LoginPhone from "./components/LoginPhone";
import LoginPassword from "./components/LoginPassword";
// interface IProps {
//   [key: string]: any;
// }

console.error(
  "[ ] 注册逻辑未开发\r\n[ ] 注册逻辑未开发\r\n[ ] 注册逻辑未开发\r\n"
);
const Login = () => {
  const tabList = [{ title: "账号密码" }, { title: "手机号" }];
  const [current, setCurrent] = useState(1);

  return (
    <View className="login-page">
      <View className="logo">
        <Image
          src={"https://static.ccgold.cn/img/mp/headerLogo.png"}
          className="img"
        />
      </View>

      <AtTabs
        current={current}
        swipeable={false}
        tabList={tabList}
        onClick={setCurrent}
      >
        <AtTabsPane current={current} index={0}>
          <LoginPassword />
        </AtTabsPane>
        <AtTabsPane current={current} index={1}>
          <LoginPhone />
        </AtTabsPane>
      </AtTabs>

      <View
        className="register"
        onClick={() => {
          console.log("添加注册逻辑");
        }}
      >
        没有账号？现在注册
      </View>
    </View>
  );
};

Login.config = {
  navigationBarTitleText: "登录"
};

export default connect(({ common }) => common)(Login as any);
