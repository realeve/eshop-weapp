import Taro from "@tarojs/taro";
import { View } from "@tarojs/components";
import "./index.scss";
import { jump } from "@/utils/lib";
export default () => {
  return (
    <View
      className="empty_address"
      onClick={() => {
        jump("/pages/user/address/new");
      }}
    >
      <View className="at-icon at-icon-map-pin icon" />
      <View className="tips">您还没有收货地址，点击这里添加</View>
    </View>
  );
};
