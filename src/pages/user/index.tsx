import Taro from "@tarojs/taro";
import { View } from "@tarojs/components";
import "./index.scss";
import { UserHeader, MyOrder, MyService } from "./components/index";
import { IGlobalModel } from "@/models/common";
import { connect } from "@tarojs/redux";
import CEmpty from "@/components/CEmpty";

const User = ({ isLogin }) => (
  <View className="user-page">
    <UserHeader />
    {!isLogin && <CEmpty type="login" />}
    {isLogin && <MyOrder />}
    {isLogin && <MyService />}
  </View>
);

User.config = {
  navigationBarTitleText: "个人中心"
};

export default connect(({ common: { isLogin } }: IGlobalModel) => ({
  isLogin
}))(User as any);
