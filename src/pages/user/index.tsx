import Taro from "@tarojs/taro";
import { View } from "@tarojs/components";
import "./index.scss";
import { AtButton } from "taro-ui";
import { UserHeader, MyOrder, MyService } from "./components/index";
import { jump } from "@/utils/lib";
import { logout as _logout } from "@/pages/login/db";
import { IGlobalModel } from "@/models/common";
import { connect } from "@tarojs/redux";
import CEmpty from "@/components/CEmpty";

const User = ({ isLogin, dispatch }) => {
  const logout = () => {
    if (_logout(dispatch)) {
      dispatch({
        type: "common/setStore",
        payload: {
          isLogin: false,
          user: {},
          token: "",
          shoppingCart: {
            loading: false,
            total: { num: 0 }
          }
        }
      });
      jump("/pages/index/index");
    }
  };
  return (
    <View className="user-page">
      <UserHeader />
      {!isLogin && <CEmpty type="login" />}
      {isLogin && <MyOrder />}
      {isLogin && <MyService />}
    </View>
  );
};

User.config = {
  navigationBarTitleText: "个人中心"
};

export default connect(({ common: { isLogin } }: IGlobalModel) => ({
  isLogin
}))(User as any);
