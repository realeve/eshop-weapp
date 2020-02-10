import Taro from "@tarojs/taro";
import { AtBadge } from "taro-ui";
import OrderDetail from "./OrderDetail";

export default class OrderItem extends Taro.Component<{
  value: number;
  data: {
    text: string;
    img: any;
    link: string;
  };
}> {
  render() {
    let { value, data } = this.props;
    return value > 0 ? (
      <AtBadge value={value}>
        <OrderDetail data={data} />
      </AtBadge>
    ) : (
      <OrderDetail data={data} />
    );
  }
}
