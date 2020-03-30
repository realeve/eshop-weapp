import Taro from "@tarojs/taro";
import { View } from "@tarojs/components";
import "./index.scss";

import { UserHeader, MyOrder, MyService } from "./components/index";

const User = () => {
  return (
    <View className="user-page">
      <UserHeader />
      <MyOrder />
      <MyService />
    </View>
  );
};

User.config = {
  navigationBarTitleText: "个人中心"
};

export default User;
