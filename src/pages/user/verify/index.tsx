import Taro from "@tarojs/taro";
import { View } from "@tarojs/components";
import "./index.scss";
import { IGlobalModel } from "@/models/common";
import { connect } from "@tarojs/redux";

const Verify = ({ isLogin, user, dispatch }) => {
  return <View className="user-setting">实名认证页面</View>;
};

Verify.config = {
  navigationBarTitleText: "实名认证"
};

export default connect(({ common: { user, isLogin } }: IGlobalModel) => ({
  user,
  isLogin
}))(Verify as any);
