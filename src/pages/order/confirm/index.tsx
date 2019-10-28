import Taro, { useEffect, useState } from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import { Dispatch } from "redux";
import "./index.scss";
import { LocalStorageKeys } from "@/utils/setting";
import { IOrderModel } from "@/models/common";
import * as R from "ramda";
import { CCardLite, CPrice } from "@/components/";
import HomeIcon from "./shop.svg";

import { IConfirmCart } from "@/utils/cart";

interface IProps extends IOrderModel {
  dispatch: Dispatch;
  cart: IConfirmCart[];
  [key: string]: any;
}
const loadCart: <T extends IConfirmCart[]>(e: T) => T = cart =>
  cart.name ? cart : Taro.getStorageSync(LocalStorageKeys.confirm);

const OrderConfirm = ({ cart, dispatch }: IProps) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    const res = loadCart<IConfirmCart[]>(cart);
    let nextState = R.values(R.groupBy(item => item.shop.name)(res));
    setData(nextState);
  }, [cart]);

  console.log(data);

  return (
    <View className="order-confirm">
      {data.map((shopItem: IConfirmCart) => (
        <CCardLite className="goodslist" key={shopItem[0].shop.id}>
          <View className="shop">
            <Image src={HomeIcon} className="icon" />
            <Text className="title">{shopItem[0].shop.name}</Text>
          </View>
          {shopItem.map(item => (
            <View className="item" key={item.id}>
              <Image src={item.img} className="img" />
              <View className="detail">
                <View className="main">
                  <Text>{item.name}</Text>
                  <CPrice retail={item.price} />
                </View>

                <View className="sub">
                  <Text>{item.spec}</Text>
                  <Text>x {item.num}</Text>
                </View>
              </View>
            </View>
          ))}
        </CCardLite>
      ))}
    </View>
  );
};

OrderConfirm.config = {
  navigationBarTitleText: "订单确认"
};

export default connect(({ common: { confirmCart } }) => ({
  cart: confirmCart
}))(OrderConfirm as any);
