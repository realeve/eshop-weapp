import Taro from "@tarojs/taro";
import { CCard } from "@/components";
import { View, Image } from "@tarojs/components";
import "./index.scss";

import needPay from "./needPay.png";
import needConfirm from "./needConfirm.png";
import needSend from "./needSend.png";
import refund from "./refund.png";
import needReceive from "./sending.png";
import { connect } from "@tarojs/redux";
import { IGlobalModel, updateStore } from "@/models/common";
import { useFetch } from "@/components/";
import Skeleton from "taro-skeleton";
import { AtBadge } from "taro-ui";
import { ORDER } from "@/utils/api";

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

const OrderItem = ({
  data,
  value
}: {
  value: number;
  data: {
    text: string;
    img: any;
    link: string;
  };
}) => {
  let Detail = () => (
    <View className="linkItem">
      <View>
        <Image src={data.img} className="icon" />
      </View>
      <View>{data.text}</View>
    </View>
  );

  return value > 0 ? (
    <AtBadge value={value}>
      <Detail />
    </AtBadge>
  ) : (
    <Detail />
  );
};
const MyOrder = ({ isLogin, dispatch }) => {
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
    <CCard
      title="我的订单"
      extra={
        <View>
          全部订单 <View className="at-icon at-icon-chevron-right" />
        </View>
      }
      style={{ marginTop: 10 }}
    >
      <Skeleton animate loading={loading} row={2}>
        <View className="usercenterOrderLinkList">
          {linkList.map((item, idx) => (
            <OrderItem
              key={item.text}
              data={item}
              value={(orderNumber || [])[idx]}
            />
          ))}
        </View>
      </Skeleton>
    </CCard>
  );
};

export default connect(({ common: { user, isLogin } }: IGlobalModel) => ({
  isLogin
}))(MyOrder as any);
