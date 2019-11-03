import Taro from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import "./index.scss";
import { AtAvatar } from "taro-ui";
import DefaultAvatar from "./headerLogo.png";

const NotLogin = () => (
  <View className="notLogin">
    <View
      className="avatar"
      onClick={() => {
        Taro.navigateTo({
          url: "/pages/login/index"
        });
      }}
    >
      <View className="avatarImg">
        <AtAvatar circle size="large" image={DefaultAvatar} />
      </View>
      <View className="detail">
        <Text className="userName">您好，请您登录</Text>
        <Text className="welcome">欢迎畅享中钞电商购物体验</Text>
      </View>
    </View>
  </View>
);
export default NotLogin;
