import Taro, { useEffect } from "@tarojs/taro";
import { View } from "@tarojs/components";
import "./index.scss";
import { UserHeader, MyOrder, MyService } from "./components/index";
import { IGlobalModel } from "@/models/common";
import { connect } from "@tarojs/redux";
import CEmpty from "@/components/CEmpty";
import * as wx from "@/utils/weixin";

const User = ({ isLogin, dispatch }) => {
  // 个人信息页面
  useEffect(() => {
    // 场景2/场景3：未登录用户自动登录
    if (!isLogin) {
      wx.bindWXInfo(dispatch);
    }
  }, []);

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
