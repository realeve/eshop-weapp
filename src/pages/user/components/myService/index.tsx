import Taro from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import "./index.scss";
import { AtList, AtListItem } from "taro-ui";
import address from "./address.png";
import comment from "./comment.png";
import order from "./order.png";
import service from "./service.png";
import { jump } from "@/utils/lib";

const MyService = () => {
  const list = [
    // {
    //   title: "功能调试_im",
    //   img: order,
    //   url: "/pages/user/im/index?sid=3"
    // },
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
      title: "帮助中心",
      img: service,
      url: "/pages/help/index"
    },
    {
      title: "我的预约",
      img: order,
      url: "/pages/user/lottery/index"
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
        <View className="at-list__item at-list__item--thumb">
          <a className="at-list__item-container" href="tel:4008122200">
            <View className="at-list__item-thumb item-thumb">
              <View className="taro-img item-thumb__info">
                <img className="taro-img__mode-scaletofill" src={service} />
              </View>
            </View>
            <View className="at-list__item-content item-content">
              <View
                className="item-content__info-title"
                style={{ color: "#2c2e36" }}
              >
                联系客服
              </View>
            </View>
            <View className="at-list__item-extra item-extra">
              <View>
                <View className="item-extra__icon">
                  <Text className="taro-text at-icon item-extra__icon-arrow at-icon-chevron-right" />
                </View>
              </View>
            </View>
          </a>
        </View>
      </AtList>
    </View>
  );
};
export default MyService;
