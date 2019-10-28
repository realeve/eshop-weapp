import Taro, { useEffect } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import { ICartModel } from "./model";
import { Dispatch } from "redux";
import "./index.scss";
import EmptyCart from "./components/empty";

interface IProps extends ICartModel {
  dispatch: Dispatch;
  [key: string]: any;
}
const Cart = ({ dispatch, stateName }: IProps) => {
  useEffect(() => {
    console.log("这里对数据的引用", stateName);
    dispatch({
      type: "cart/setStore",
      payload: {
        stateName: "变更数据"
      }
    });
  }, [stateName]);

  return (
    <View className="cart-page">
      <EmptyCart />
    </View>
  );
};

Cart.config = {
  navigationBarTitleText: "购物车"
};

export default connect(({ cart }) => ({
  ...cart
}))(Cart as any);
