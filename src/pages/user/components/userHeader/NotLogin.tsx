import Taro from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import "./notLogin.scss";
import { AtAvatar } from "taro-ui";

const NotLogin = () => (
  <View
    className="not_login"
    onClick={() => {
      Taro.navigateTo({
        url: "/pages/login/index"
      });
    }}
  >
    <View className="avatar_img">
      <AtAvatar
        circle
        size="large"
        image="https://www.cbpc.ltd/ccgold/static/headerLogo.png"
      />
    </View>
    <View className="detail">
      <Text className="detail_user_name">您好，请您登录</Text>
      <Text className="detail_welcome">欢迎畅享中钞电商购物体验</Text>
    </View>
  </View>
);
export default NotLogin;
