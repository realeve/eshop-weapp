import Taro, { useEffect, useState } from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import "./index.scss";

import * as R from "ramda";
import { CCardLite, CPrice } from "@/components/";
import HomeIcon from "./shop.svg";

import {
  ICalcResult,
  ICalcFreight,
  IStoreInfo,
  IBuyData,
  calcFreight,
  step2Order,
  IBooking,
  IBuyGoodsItemVoList,
  IOrderAddress,
  step1Detail,
  calcFee,
  getShoppingCartAxiosParam,
  getPreOrder,
  getFlatBooking,
  IBookingDetail,
  InvoiceType,
} from "@/utils/cartDb";

import fail from "@/components/Toast/fail";

import useFetch from "@/components/hooks/useFetch";
import { API } from "@/utils/setting";

import {
  handleAddressList,
  IADDRESS,
  IModPanelItem,
} from "@/pages/user/address/lib";
import AddressPanel from "./components/AddressPanel";

const OrderConfirm = ({ currentAddress }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [invalid, setInvalid] = useState(false);
  const [isInited, setIsInited] = useState<boolean>(false);
  const [amount, setAmount] = useState<ICalcResult>();
  const [invoice, setInvoice] = useState<InvoiceType>({
    type: "电子发票",
    title: "个人",
    username: "个人",
    sn: "",
    content: "明细",
    mount: 0,
    email: "",
  });
  const [origin, setOrigin] = useState<IBooking>();
  const [selectedAddr, setSelectedAddr] = useState<number>(0);

  const calc = (
    goods?: IBuyGoodsItemVoList[],
    addr?: Partial<IOrderAddress>
  ) => {
    let data = goods || goodsList;
    let _addr = addr || address;
    if (!data || !_addr || !_addr.addressId) {
      return;
    }
    let preOrder = getPreOrder({
      data,
      address: { addressId: _addr.addressId },
    });
    setLoading(true);
    if (preOrder) {
      calcFee(preOrder)
        .then((a) => {
          setLoading(false);
          setAmount(a);
        })
        .catch((e) => {
          fail(e.message);
        });
    }
  };

  const { data: address, reFetch: refreshAddress, setData } = useFetch<
    IModPanelItem
  >({
    param: {
      method: "post",
      url: API.MEMBER_ADDRESS_LIST as string,
    },
    callback: (res: { addressList: IADDRESS[] }) => {
      let resdata: IModPanelItem[] = handleAddressList(res);
      let dist = resdata.filter((item) => item.isDefault)[0];
      if (!dist) {
        dist = resdata[0] || null;
      }
      return dist;
    },
  });

  useEffect(() => {
    if (!currentAddress.address_id) {
      return;
    }
    setData(currentAddress);
  }, [JSON.stringify(currentAddress)]);

  const [goodsList, setGoodsList] = useState<IBuyGoodsItemVoList[]>([]);

  useEffect(() => {
    setLoading(true);
    let params = getShoppingCartAxiosParam();
    // console.log(params);
    setInvalid(!params);
    if (!params) {
      return;
    }

    setIsInited(true);
    step1Detail(params as IBookingDetail)
      .then((data: IBooking) => {
        let _data = R.clone(data);
        Reflect.deleteProperty(_data, "buyStoreVoList");
        setOrigin(_data);
        setSelectedAddr(_data.address ? _data.address.addressId || 0 : 0);
        let flatGoods = getFlatBooking(data) || [];
        setGoodsList(flatGoods);
        setLoading(false);
      })
      .catch((err) => {
        fail(`出错啦：${err.message}！`);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!goodsList || !address) {
      return;
    }
    calc();
  }, [goodsList, address]);

  return (
    <View className="order_confirm">
      <AddressPanel data={address} />
      {goodsList.map((item: IBuyGoodsItemVoList) => (
        <CCardLite className="goodslist" key={item.commonId}>
          <View className="shop">
            <Image src={HomeIcon} className="icon" />
            <Text className="title">{item.storeName}</Text>
          </View>

          <View className="item">
            <View className="main">
              <Image src={item.spuImageSrc} className="img" />
              <View className="detail">
                <View className="main">
                  <Text className="goods_name">{item.goodsName} aasd</Text>
                  <CPrice retail={item.goodsPrice} />
                </View>

                <View className="sub">
                  <Text>{item.goodsFullSpecs}</Text>
                  <Text>
                    x {item.spuBuyNum}
                    {item.unitName}
                  </Text>
                </View>
              </View>
            </View>
            <View className="express">
              <View>配送方式</View>
              <View>
                快递:
                {item.goodsFreight == 0 ? "免邮" : "￥" + item.goodsFreight}
                <Text className="at-icon item-extra__icon-arrow at-icon-chevron-right" />
              </View>
            </View>
          </View>
        </CCardLite>
      ))}
      <View className="invoice">
        <View>发票</View>
        <View>{invoice.title}</View>
      </View>
    </View>
  );
};

OrderConfirm.config = {
  navigationBarTitleText: "订单确认",
};

export default connect(({ order: { currentAddress } }) => ({
  currentAddress,
}))(OrderConfirm as any);
