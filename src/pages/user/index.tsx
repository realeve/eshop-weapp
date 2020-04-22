import Taro from "@tarojs/taro";
import { View } from "@tarojs/components";
import "./index.scss";
import { AtButton } from "taro-ui";
import { UserHeader, MyOrder, MyService } from "./components/index";
import { jump } from "@/utils/lib";
import { logout as _logout } from "@/pages/login/db";
import { IGlobalModel } from "@/models/common";
import { connect } from "@tarojs/redux";

const User = ({ isLogin, dispatch }) => {
  const logout = () => {
    _logout().then(res => {
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
    });
  };
  return (
    <View className="user-page">
      <UserHeader />
      <MyOrder />
      <MyService />
      {isLogin && (
        <AtButton type="secondary" onClick={logout}>
          退出登录
        </AtButton>
      )}
    </View>
  );
};

User.config = {
  navigationBarTitleText: "个人中心"
};

export default connect(({ common: { isLogin } }: IGlobalModel) => ({
  isLogin
}))(User as any);
