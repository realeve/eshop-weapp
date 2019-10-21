import Taro, { useEffect } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import { IUserModel } from "./model";
import "./index.scss";

import { UserHeader, MyOrder, MyService } from "./components";

interface IProps extends IUserModel {
  [key: string]: any;
}
const User = ({ ...props }: IProps) => {
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

export default connect(({ user }) => ({
  ...user
}))(User as any);
