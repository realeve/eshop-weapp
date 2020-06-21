import Taro from "@tarojs/taro";
import OrderDetail from "./OrderDetail";

export default class OrderItem extends Taro.Component<{
  value?: number;
  data: {
    name: string;
    img: any;
    link: string;
  };
}> {
  render() {
    let { value, data } = this.props;
    return (value || 0) > 0 ? (
      <OrderDetail data={data} value={value} />
    ) : (
      <OrderDetail data={data} />
    );
  }
}
