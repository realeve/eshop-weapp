import Taro from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import "./index.scss";
import { AtList, AtListItem } from "taro-ui";
import address from "./address.png";
import comment from "./comment.png";
import order from "./order.png";
import service from "./service.png";

const MyService = () => {
  const list = [
    {
      title: "我的收货地址",
      img: address,
      url: ""
    },
    {
      title: "我的评价",
      img: comment,
      url: ""
    },
    {
      title: "客服与帮助",
      img: service,
      url: ""
    },
    {
      title: "我的预约",
      img: order,
      url: ""
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
          />
        ))}
      </AtList>
    </View>
  );
};
export default MyService;
