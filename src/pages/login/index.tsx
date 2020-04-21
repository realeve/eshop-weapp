import Taro, { useState } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import "./index.scss";
import { AtTabs, AtTabsPane } from "taro-ui";
import LoginPhone from "./components/LoginPhone";
import LoginPassword from "./components/LoginPassword";
import { CButton } from "@/components";
import { login as onSubmit } from "@/utils/login/";
// interface IProps {
//   [key: string]: any;
// }
const Login = () => {
  const tabList = [
    { title: "微信登录" },
    { title: "手机号" },
    { title: "账号密码" }
  ];
  const [current, setCurrent] = useState(0);

  return (
    <View className="login-page">
      <View className="logo">
        <Image
          src={"https://www.cbpc.ltd/ccgold/static/headerLogo.png"}
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
          <View className="action">
            <CButton theme="gardient" onClick={onSubmit}>
              授权登录
            </CButton>
          </View>
        </AtTabsPane>
        <AtTabsPane current={current} index={1}>
          <LoginPhone />
        </AtTabsPane>
        <AtTabsPane current={current} index={2}>
          {/* <View style="padding: 100px 50px;background-color: #FAFBFC;text-align: center;"> */}
          {/* <LoginPassword /> */}2{/* </View> */}
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
