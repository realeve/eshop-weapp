import Taro from "@tarojs/taro";
import { CCard } from "@/components";
import { View, Image } from "@tarojs/components";
import "./index.scss";

import needPay from "./needPay.png";
import needConfirm from "./needConfirm.png";
import needSend from "./needSend.png";
import refund from "./refund.png";
import sending from "./sending.png";

const MyOrder = () => {
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
      img: sending,
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
      <View className="usercenterOrderLinkList">
        {linkList.map(item => (
          <View className="linkItem" key={item.text}>
            <View>
              <Image src={item.img} className="icon" />
            </View>
            <View>{item.text}</View>
          </View>
        ))}
      </View>
    </CCard>
  );
};
export default MyOrder;
