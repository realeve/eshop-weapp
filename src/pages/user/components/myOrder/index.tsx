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
import { jump } from "@/utils/lib";
import OrderItem from "./OrderItem";
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

export const linkList = [
  {
    name: "待付款",
    img: needPay,
    link: "/pages/user/order/index?state=1"
  },
  {
    name: "待发货",
    img: needSend,
    link: "/pages/user/order/index?state=2"
  },
  {
    name: "待收货",
    img: needReceive,
    link: "/pages/user/order/index?state=3"
  },
  {
    name: "待评价",
    img: needConfirm,
    link: "/pages/user/order/index?state=4"
  },
  {
    name: "退款/售后",
    img: refund,
    link: "/pages/user/order/aftersale/"
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
        <View
          className="extra"
          onClick={() => {
            jump("/pages/user/order/index");
          }}
        >
          <Text>全部订单</Text>
          <View className="at-icon at-icon-chevron-right" />
        </View>
      </View>

      <Skeleton animate loading={loading && isLogin} row={2}>
        <View className="content">
          <View className="usercenterOrderLinkList">
            {linkList.map((item, idx) => (
              <OrderItem
                key={item.name}
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
