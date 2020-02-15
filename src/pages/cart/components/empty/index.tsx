import Taro from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import "./index.scss";
import CartImg from "./cartEmpty.svg";
import CButton from "@/components/CButton";
import { jump } from "@/utils/lib";

const EmptyCart = () => (
  <View className="cart-page-empty">
    <View className="imgWrapper">
      <Image mode="aspectFit" className="img" src={CartImg} />
    </View>
    <View className="title">您当前购物车空空如也~</View>
    <CButton
      onClick={() => {
        jump({
          url: "/pages/index/index"
        });
      }}
      theme="gardient"
    >
      去逛逛
    </CButton>
  </View>
);

export default EmptyCart;
