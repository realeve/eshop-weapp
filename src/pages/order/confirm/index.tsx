import Taro, { useEffect, useState } from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import { Dispatch } from "redux";
import "./index.scss";

import { IOrderModel } from "@/models/common";
import * as R from "ramda";
import { CCardLite, CPrice } from "@/components/";
import HomeIcon from "./shop.svg";

import { IConfirmCart } from "@/utils/cart";
import * as cartDb from "@/utils/cartDb";
import fail from "@/components/Toast/fail";

import useFetch from "@/components/hooks/useFetch";
import { API } from "@/utils/setting";

import {
  IModPanelItem,
  IADDRESS,
  handleAddressList
} from "@/pages/user/address";
import AddressPanel from "./components/AddressPanel";

// interface IProps extends IOrderModel {
//   dispatch: Dispatch;
//   cart: IConfirmCart[];
//   [key: string]: any;
// }

const OrderConfirm = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [invalid, setInvalid] = useState(false);
  const [isInited, setIsInited] = useState<boolean>(false);
  const [invoice, setInvoice] = useState<cartDb.InvoiceType>({
    type: "电子发票",
    title: "个人",
    username: "个人",
    sn: "",
    content: "明细",
    mount: 0,
    email: ""
  });
  const [origin, setOrigin] = useState<cartDb.IBooking>();
  const [selectedAddr, setSelectedAddr] = useState<number>(0);

  const { data: address, reFetch: refreshAddress } = useFetch<IModPanelItem>({
    param: {
      method: "post",
      url: API.MEMBER_ADDRESS_LIST as string
    },
    callback: (res: { addressList: IADDRESS[] }) => {
      let resdata: IModPanelItem[] = handleAddressList(res);
      let dist = resdata.filter(item => item.isDefault)[0];
      if (!dist) {
        dist = resdata[0] || null;
      }
      return dist;
    }
  });

  const [goodsList, setGoodsList] = useState<cartDb.IBuyGoodsItemVoList[]>([]);

  useEffect(() => {
    setLoading(true);
    let params = cartDb.getShoppingCartAxiosParam();
    // console.log(params);
    setInvalid(!params);
    if (!params) {
      return;
    }

    setIsInited(true);
    cartDb
      .step1Detail(params as cartDb.IBookingDetail)
      .then((data: cartDb.IBooking) => {
        let _data = R.clone(data);
        Reflect.deleteProperty(_data, "buyStoreVoList");
        setOrigin(_data);
        setSelectedAddr(_data.address ? _data.address.addressId || 0 : 0);
        let flatGoods = cartDb.getFlatBooking(data) || [];
        setGoodsList(flatGoods);
        setLoading(false);
      })
      .catch(err => {
        fail(`出错啦：${err.message}！`);
        setLoading(false);
      });
  }, []);

  // useEffect(() => {
  //   const res = loadCart<IConfirmCart[]>(cart);
  //   console.log(res);
  //   let nextState = R.values(R.groupBy(item => item.shop.name)(res));
  //   setData(nextState);
  // }, [cart]);

  console.log(goodsList, address);

  return (
    <View className="order_confirm">
      <AddressPanel data={address} />

      {goodsList.map((goodsItem: cartDb.IBuyGoodsItemVoList) => (
        <CCardLite className="goodslist" key={goodsItem.commonId}>
          <View className="shop">
            <Image src={HomeIcon} className="icon" />
            <Text className="title">{goodsItem.storeName}</Text>
          </View>

          <View className="item">
            <Image src={goodsItem.spuImageSrc} className="img" />

            <View className="detail">
              <View className="main">
                <Text className="goods_name">{goodsItem.goodsName} aasd</Text>
                <CPrice retail={goodsItem.goodsPrice} />
              </View>

              <View className="sub">
                <Text>{goodsItem.goodsFullSpecs}</Text>
                <Text>x {goodsItem.spuBuyNum}</Text>
              </View>
            </View>
          </View>
        </CCardLite>
      ))}
    </View>
  );
};

OrderConfirm.config = {
  navigationBarTitleText: "订单确认"
};

export default OrderConfirm;

// connect(({ common: { confirmCart } }) => ({
//   cart: confirmCart
// }))(OrderConfirm as any);
