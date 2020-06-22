import Taro from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import "./isLogin.scss";
import { AtAvatar } from "taro-ui";
import { IGlobalUser } from "@/models/common";

interface ILoginProp {
  data: IGlobalUser;
}
const IsLogin = ({ data }: ILoginProp) => {
  if (!data) {
    return null;
  }
  let { avatar, trueName, isRealNamePassed, registerTime } = data;
  return (
    <View className="is_login">
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
        <Text className="detail_welcome">欢迎畅享中钞电商购物体验</Text>
        <Text className="detail_welcome">{registerTime} 注册</Text>
      </View>
    </View>
  );
};

export default IsLogin;
