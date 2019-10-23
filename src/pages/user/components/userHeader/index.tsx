import Taro from "@tarojs/taro";
import { View } from "@tarojs/components";
import "./index.scss";
import { AtAvatar } from "taro-ui";
import { connect } from "@tarojs/redux";
import DefaultAvatar from "./headerLogo.png";
import { IGlobalModel, IGlobalUser } from "@/models/common";
import Skeleton from "taro-skeleton";

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
  data: IGlobalUser;
}
const IsLogin = ({
  data: { avatar, trueName, isRealNamePassed }
}: ILoginProp) => (
  <View className="avatar">
    <View className="avatarImg">
      <AtAvatar circle size="large" image={avatar} />
    </View>
    <View className="detail">
      <View className="userName">
        <View className="name">{trueName}</View>
        {isRealNamePassed ? (
          <View className="valid">已实名认证</View>
        ) : (
          <View className="invalid">未实名认证</View>
        )}
      </View>
      <View className="welcome">欢迎畅享中钞电商购物体验</View>
    </View>
  </View>
);

const UserHeader = ({ user, loading }) => {
  return (
    <Skeleton avatar loading={loading.global} row={2}>
      <View className="userCenter-header">
        {!user.uid ? <NotLogin /> : <IsLogin data={user} />}
        <View className="at-icon at-icon-settings setting" />
      </View>
    </Skeleton>
  );
};

export default connect(
  ({ common: { user, isLogin }, loading }: IGlobalModel) => ({
    user,
    isLogin,
    loading
  })
)(UserHeader as any);
