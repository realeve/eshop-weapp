import Taro, { useEffect } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import { IOrderModel } from "../model";
import { Dispatch } from "redux";
import "./index.scss";

interface IProps extends IOrderModel {
  dispatch: Dispatch;
  [key: string]: any;
}
const Order = ({ dispatch, ...props }: IProps) => {
  useEffect(() => {
    console.log("这里对数据的引用", props.stateName);
    dispatch({
      type: "order/setStore",
      payload: {
        stateName: "变更数据"
      }
    });
  }, [props.stateName]);

  return (
    <View className="order-page">
      <Text>order</Text>
    </View>
  );
};

Order.config = {
  navigationBarTitleText: "这是页面标题信息"
};

export default connect(({ order }) => order)(Order as any);
