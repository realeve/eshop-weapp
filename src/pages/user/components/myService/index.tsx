import Taro from "@tarojs/taro";
import { View } from "@tarojs/components";
import "./index.scss";
import { AtList, AtListItem } from "taro-ui";
import address from "./address.png";
import comment from "./comment.png";
import order from "./order.png";
import service from "./service.png";
import { jump } from "@/utils/lib";

const MyService = () => {
  const list = [
    {
      title: "我的收货地址",
      img: address,
      url: "/pages/user/address/index"
    },
    {
      title: "我的评价",
      img: comment,
      url: "/pages/user/comment/index"
    },
    {
      title: "客服与帮助",
      img: service,
      url: "/pages/help/index"
    },
    {
      title: "我的预约",
      img: order,
      url: ""
    },
    {
      title: "功能调试_订单确认",
      img: order,
      url: "/pages/order/confirm/index"
    }
  ];
  return (
    <View className="usercenterMyService">
      <AtList>
        <AtListItem title="我的服务" />
        {list.map(item => (
          <AtListItem
            key={item.title}
            title={item.title}
            arrow="right"
            thumb={item.img}
            onClick={() => {
              jump(item.url);
            }}
          />
        ))}
      </AtList>
    </View>
  );
};
export default MyService;
