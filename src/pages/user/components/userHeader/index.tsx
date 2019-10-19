import Taro from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import "./index.scss";

const EmptyCart = () => (
  <View className="userCenter-header">
    <View className="avatar">
      <View className="avatarImg">头像</View>
      <View className="detail">
        <View className="userName">
          <View className="name">张三</View>
          <View className="status">已认证状态</View>
        </View>
        <View className="welcome">欢迎畅享中钞电商购物体验</View>
      </View>
    </View>
    <View className="setting">设置按钮</View>
  </View>
);

export default EmptyCart;
