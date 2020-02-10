import Taro from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import "./NotLogin.scss";
import { AtAvatar } from "taro-ui";
import { IGlobalUser } from "@/models/common";

interface ILoginProp {
  data: IGlobalUser;
}
const IsLogin = ({ data }: ILoginProp) => {
  if (!data) {
    return null;
  }
  let { avatar, trueName, isRealNamePassed } = data;
  return (
    <View className="avatar">
      <View className="avatarImg">
        <AtAvatar circle size="large" image={avatar} />
      </View>
      <View className="detail">
        <View className="userName">
          <Text className="name">{trueName}</Text>
          {isRealNamePassed ? (
            <Text className="valid">已实名认证</Text>
          ) : (
            <Text className="invalid">未实名认证</Text>
          )}
        </View>
        <Text className="welcome">欢迎畅享中钞电商购物体验</Text>
      </View>
    </View>
  );
};

export default IsLogin;
