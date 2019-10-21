import Taro from "@tarojs/taro";
import { View } from "@tarojs/components";
import "./index.scss";
import { AtAvatar } from "taro-ui";

import DefaultAvatar from "./headerLogo.png";

export interface IUserInfo {
  uid: number;
  username: string;
  avatar: string;
  valid: boolean;
  [key: string]: any;
}

const NotLogin = () => (
  <View
    className="avatar"
    onClick={() => {
      Taro.navigateTo({
        url: "/pages/login"
      });
    }}
  >
    <View className="avatarImg">
      <AtAvatar circle size="large" image={DefaultAvatar} />
    </View>
    <View className="detail">
      <View className="userName">您好，请您登录</View>
      <View className="welcome">欢迎畅享中钞电商购物体验</View>
    </View>
  </View>
);

interface ILoginProp {
  data: IUserInfo;
}
const IsLogin = ({ data: { avatar, username, valid } }: ILoginProp) => (
  <View className="avatar">
    <View className="avatarImg">
      <AtAvatar circle size="large" image={avatar} />
    </View>
    <View className="detail">
      <View className="userName">
        <View className="name">{username}</View>
        {valid ? (
          <View className="valid">已实名认证</View>
        ) : (
          <View className="invalid">未实名认证</View>
        )}
      </View>
      <View className="welcome">欢迎畅享中钞电商购物体验</View>
    </View>
  </View>
);

const EmptyCart = () => {
  const userInfo: IUserInfo = {
    uid: 0,
    username: "张三",
    avatar:
      "https://static.ccgold.cn/image/9f/12/9f12f7c6a5c005cef4488c753a33e554.gif",
    valid: true
  };

  return (
    <View className="userCenter-header">
      {userInfo.uid == 0 ? <NotLogin /> : <IsLogin data={userInfo} />}
      <View className="at-icon at-icon-settings setting" />
    </View>
  );
};

export default EmptyCart;
