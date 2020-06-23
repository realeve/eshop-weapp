import Taro from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import "./isLogin.scss";
import { AtAvatar } from "taro-ui";

export default ({ data }) => {
  if (!data) {
    return null;
  }
  let { avatar, trueName, isRealNamePassed, registerTime } = data;
  return (
    <View className="user_panel">
      <View className="avatar_img">
        <AtAvatar circle size="large" image={avatar} />
      </View>
      <View className="detail">
        <View className="detail_user_name">
          <Text className="name">{trueName}</Text>
          {isRealNamePassed ? (
            <Text className="valid">已实名认证</Text>
          ) : (
            <Text className="invalid">未实名认证</Text>
          )}
        </View>
        <Text className="detail_welcome">注册时间：{registerTime} </Text>
      </View>
    </View>
  );
};
