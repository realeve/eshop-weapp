import Taro from "@tarojs/taro";
import { View, Image, Text } from "@tarojs/components";
import "./OrderDetail.scss";
import * as lib from "@/utils/lib";
const OrderDetail = ({
  data
}: {
  data: {
    name: string;
    img: any;
    link: string;
  };
}) => (
  <View
    className="link_item"
    onClick={() => {
      console.log(data.link);
      lib.jump(data.link);
    }}
  >
    <View>
      <Image src={data.img} className="icon" />
    </View>
    <Text>{data.name}</Text>
  </View>
);
export default OrderDetail;
