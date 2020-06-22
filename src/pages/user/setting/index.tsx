import Taro, { useEffect, useState } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import "./index.scss";
import { IGlobalModel } from "@/models/common";
import { connect } from "@tarojs/redux";
import * as wx from "@/utils/weixin";
import UserPanel from "./IsLogin";
import { AtListItem, AtModal } from "taro-ui";
import { unbind } from "@/pages/login/db";

import { jump } from "@/utils/lib";

const Setting = ({ isLogin, user, dispatch }) => {
  const [isOpened, setIsOpened] = useState<boolean>(false);

  // 个人信息页面
  useEffect(() => {
    // 场景2/场景3：未登录用户自动登录
    if (!isLogin) {
      wx.bindWXInfo(dispatch);
    }

    // 微信分享
    wx.initShare({
      title: "中钞贵金属平台-个人中心",
      subTitle: "货币文化产品与服务电子商务平台"
    });
  }, []);

  const unBind = () => {
    if (unbind(dispatch)) {
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

  return (
    <View className="user-setting">
      <UserPanel data={user} />
      <View
        className="at-list__item fields"
        onClick={() => {
          !user.isRealNamePassed && jump("/pages/user/verify/index");
        }}
      >
        <View className="at-list__item-container">
          <View className="at-list__item-content item-content">
            <View className="item-content__info-title">实名认证</View>
          </View>
          <View className="at-list__item-extra item-extra">
            {user.isRealNamePassed ? (
              "已认证"
            ) : (
              <View>
                <Text style={{ paddingRight: "20px" }}>未认证</Text>
                <View className="item-extra__icon">
                  <Text className="taro-text at-icon item-extra__icon-arrow at-icon-chevron-right" />
                </View>
              </View>
            )}
          </View>
        </View>
      </View>

      <AtListItem className="fields" title="关于我们" extraText="V 1.3.0" />
      <AtListItem
        className="fields"
        title="取消微信绑定"
        arrow="right"
        onClick={() => {
          setIsOpened(true);
        }}
      />
      <AtModal
        isOpened={isOpened}
        closeOnClickOverlay
        title="系统提示"
        cancelText="取消"
        confirmText="确定"
        onClose={() => {
          setIsOpened(!isOpened);
        }}
        onCancel={() => {
          setIsOpened(!isOpened);
        }}
        onConfirm={unBind}
        content="确定要解除微信号绑定？"
      />
    </View>
  );
};

Setting.config = {
  navigationBarTitleText: "账号设置"
};

export default connect(({ common: { user, isLogin } }: IGlobalModel) => ({
  user,
  isLogin
}))(Setting as any);
