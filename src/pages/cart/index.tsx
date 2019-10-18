import Taro, { useEffect } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import { ICartModel } from "./model";
import { Dispatch } from "redux";
import "./index.scss";

interface IProps extends ICartModel {
  dispatch: Dispatch;
  [key: string]: any;
}
const Cart = ({ dispatch, ...props }: IProps) => {
  useEffect(() => {
    console.log("这里对数据的引用", props.stateName);
    dispatch({
      type: "cart/setStore",
      payload: {
        stateName: "变更数据"
      }
    });
  }, [props.stateName]);

  return (
    <View className="cart-page">
      <Text>cart</Text>
    </View>
  );
};

Cart.config = {
  navigationBarTitleText: "这是页面标题信息"
};

export default connect(({ cart }) => ({
  ...cart
}))(Cart as any);
