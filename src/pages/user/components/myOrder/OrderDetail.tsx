import Taro from "@tarojs/taro";
import { View, Image, Text } from "@tarojs/components";
import "./OrderDetail.scss";
const OrderDetail = ({
  data
}: {
  data: {
    text: string;
    img: any;
    link: string;
  };
}) => (
  <View className="link_item">
    <View>
      <Image src={data.img} className="icon" />
    </View>
    <Text>{data.text}</Text>
  </View>
);
export default OrderDetail;