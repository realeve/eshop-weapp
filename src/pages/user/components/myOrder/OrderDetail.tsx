import Taro from "@tarojs/taro";
import { View, Image, Text } from "@tarojs/components";
import "./OrderDetail.scss";
import * as lib from "@/utils/lib";
import { AtBadge } from "taro-ui";

const OrderDetail = ({
  data,
  value
}: {
  data: {
    name: string;
    img: string;
    link: string;
  };
  value?: number;
}) => (
  <View
    className="link_item"
    onClick={() => {
      lib.jump(data.link);
    }}
  >
    <AtBadge value={value}>
      <Image src={data.img} className="icon" />
    </AtBadge>
    <Text>{data.name}</Text>
  </View>
);
export default OrderDetail;
