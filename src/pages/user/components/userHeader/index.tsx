import Taro from "@tarojs/taro";
import { View } from "@tarojs/components";
import "./index.scss";
import { connect } from "@tarojs/redux";
import { IGlobalModel } from "@/models/common";
import NotLogin from "./notLogin";
import IsLogin from "./IsLogin";
import Skeleton from "taro-skeleton";

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
