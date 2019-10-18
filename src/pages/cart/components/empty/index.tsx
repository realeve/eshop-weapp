import Taro from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import { AtButton } from "taro-ui";
import "./index.scss";
import CartImg from "./cartEmpty.svg";

const EmptyCart = () => (
  <View className="cart-page-empty">
    <View className="imgWrapper">
      <Image className="img" src={CartImg} />
    </View>
    <View className="title">您当前购物车空空如也~</View>
    <AtButton>去逛逛</AtButton>
  </View>
);

export default EmptyCart;
