import Taro from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import needPay from "./needPay.png";
import needConfirm from "./needConfirm.png";
import needSend from "./needSend.png";
import refund from "./refund.png";
import needReceive from "./sending.png";

import { connect } from "@tarojs/redux";
import { IGlobalModel, updateStore } from "@/models/common";
import useFetch from "@/components/hooks/useFetch";
import Skeleton from "taro-skeleton";
import { ORDER } from "@/utils/api";

import OrderItem from "./OrderItem";
import "@/components/CCard/index.scss";
import "./index.scss";

// ordersStatePayCount 待发货数量
// ordersStateEvaluationCount 待评价数量
// refundAndReturnCount 退款退货数
// ordersStateSendCount 待收货数量
// ordersStateNewCount 待付款订单数量
const handleOrderNum = e => ({
  needPay: e.ordersStateNewCount,
  needSend: e.ordersStatePayCount,
  needReceive: e.ordersStateSendCount,
  needConfirm: e.ordersStateEvaluationCount,
  refund: e.refundAndReturnCount
});

const linkList = [
  {
    text: "待付款",
    img: needPay,
    link: "/order/list/0"
  },
  {
    text: "待发货",
    img: needSend,
    link: "/order/list/0"
  },
  {
    text: "待收货",
    img: needReceive,
    link: "/order/list/0"
  },
  {
    text: "待评价",
    img: needConfirm,
    link: "/order/list/0"
  },
  {
    text: "退款/售后",
    img: refund,
    link: "/order/list/0"
  }
];

const MyOrder = ({ dispatch, isLogin }) => {
  const { data: orderNumber, loading } = useFetch({
    param: ORDER.orderStatusNumber,
    callback: e => {
      let orderNum = handleOrderNum(e);
      dispatch({
        type: updateStore,
        payload: {
          orderNum
        }
      });
      return Object.values(orderNum);
    },
    valid: () => isLogin
  });

  return (
    <View className="CCard" style="margin-top:10px;">
      <View className="head">
        <View className="title">我的订单</View>
        <View className="extra">
          <Text>全部订单</Text>
          <View className="at-icon at-icon-chevron-right" />
        </View>
      </View>
      <Skeleton animate loading={loading && isLogin} row={2}>
        <View className="content">
          <View className="usercenterOrderLinkList">
            {linkList.map((item, idx) => (
              <OrderItem
                key={item.text}
                data={item}
                value={(orderNumber || [])[idx]}
              />
            ))}
          </View>
        </View>
      </Skeleton>
    </View>
  );
};

export default connect(({ common: { isLogin } }: IGlobalModel) => ({
  isLogin
}))(MyOrder as any);
