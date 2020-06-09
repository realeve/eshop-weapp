import Taro, { useState } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import "./index.scss";
import { connect } from "@tarojs/redux";
import { IGlobalModel } from "@/models/common";
import NotLogin from "./notLogin";
import IsLogin from "./IsLogin";
import Skeleton from "taro-skeleton";
import { logout as _logout } from "@/pages/login/db";
import { jump } from "@/utils/lib";
import { AtModal } from "taro-ui";

const UserHeader = ({ user, loading, isLogin, dispatch }) => {
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
      setIsOpened(false);
      jump("/pages/index/index");
    }
  };
  const [isOpened, setIsOpened] = useState<boolean>(false);
  return (
    <Skeleton avatar loading={loading.global} row={2}>
      <View className="userCenter-header">
        {!user.uid || !isLogin ? <NotLogin /> : <IsLogin data={user} />}
        <View className="at-icon at-icon-settings setting" />
        {isLogin && (
          <Image
            src="https://static.ccgold.cn/img/mp/logout.svg"
            // style="width:30px;cursor:pointer"
            style={{ width: "30px", cursor: "pointer" }}
            onClick={() => setIsOpened(!isOpened)}
          />
        )}
        <AtModal
          isOpened={isOpened}
          closeOnClickOverlay
          // title='标题'
          cancelText="取消"
          confirmText="确定"
          onClose={() => {
            setIsOpened(!isOpened);
          }}
          onCancel={() => {
            setIsOpened(!isOpened);
          }}
          onConfirm={logout}
          content="确定要退出吗？"
        />
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
