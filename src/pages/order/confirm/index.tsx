import Taro, { useEffect, useState } from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import "./index.scss";

import * as R from "ramda";
import { CCardLite, CPrice, CButton } from "@/components/";
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
  InvoiceType
} from "@/utils/cartDb";

import fail from "@/components/Toast/fail";

import useFetch from "@/components/hooks/useFetch";
import { API } from "@/utils/setting";

import {
  handleAddressList,
  IADDRESS,
  IModPanelItem
} from "@/pages/user/address/lib";
import AddressPanel from "./components/AddressPanel";

const OrderConfirm = ({ currentAddress }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [invalid, setInvalid] = useState(false);
  const [isInited, setIsInited] = useState<boolean>(false);
  const [amount, setAmount] = useState<ICalcResult>(null);

  const [freight, setFreight] = useState<ICalcFreight>({});
  const [invoice, setInvoice] = useState<InvoiceType>({
    type: "电子发票",
    title: "个人",
    username: "个人",
    sn: "",
    content: "明细",
    mount: 0,
    email: ""
  });
  const [origin, setOrigin] = useState<IBooking>();
  const [selectedAddr, setSelectedAddr] = useState<number>(0);

  const calc = (
    goods?: IBuyGoodsItemVoList[],
    addr?: Partial<IOrderAddress>
  ) => {
    let data = goods || goodsList;
    let _addr = addr || address;

    if (!data || !_addr || !_addr.address_id) {
      return;
    }

    let preOrder = getPreOrder({
      data,
      address: { addressId: _addr.address_id }
    });
    setLoading(true);
    if (preOrder) {
      calcFee(preOrder)
        .then(a => {
          setLoading(false);
          setAmount(a);
        })
        .catch(e => {
          fail(e.message);
        });

      calcFreight(preOrder).then(f => {
        setLoading(false);
        setFreight(f);
      });
    }
  };

  const { data: address, reFetch: refreshAddress, setData } = useFetch<
    IModPanelItem
  >({
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

  useEffect(() => {
    if (!currentAddress.address_id) {
      return;
    }
    setData(currentAddress);
    setSelectedAddr(currentAddress.addressId || 0);
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
      .catch(err => {
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

  console.log(amount);

  return (
    <View className="order_confirm">
      <AddressPanel data={address} />
      {amount && (
        <View>
          {amount.storeList.map((item: IBuyGoodsItemVoList) => (
            <CCardLite className="goodslist" key={item.commonId}>
              <View className="shop">
                <Image src={HomeIcon} className="icon" />
                <Text className="title">{item.storeName}</Text>
              </View>

              <View className="item">
                {item.buyGoodsItemVoList.map(goods => (
                  <View className="main" key={goods.commonId}>
                    <Image src={item.spuImageSrc} className="img" />
                    <View className="detail">
                      <View className="main">
                        <Text className="goods_name">{goods.goodsName}</Text>
                        <CPrice retail={goods.goodsPrice} />
                      </View>

                      <View className="sub">
                        <Text>{goods.goodsFullSpecs}</Text>
                        <Text>
                          x {goods.spuBuyNum}
                          {goods.unitName}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </CCardLite>
          ))}
          <View className="invoice">
            <View>发票</View>
            <View>{invoice.title}</View>
          </View>

          <View className="summary">
            <Text className="title">合计</Text>
            <View className="sub">
              <View className="subTitle">商品总额</View>
              <View className="subValue">
                ￥{amount.buyGoodsItemAmount.toFixed(2)}
              </View>
            </View>
            <View className="sub last">
              <View className="subTitle">运费</View>
              <View className="subValue">
                {freight && freight.freightAmount > 0
                  ? "￥" + freight.freightAmount.toFixed(2)
                  : "免邮"}
              </View>
            </View>
            <View className="sub">
              <View className="subTitle">实际应付（含运费）</View>
              <View className="subValue">
                ￥
                {(
                  amount.buyGoodsItemAmount +
                  (freight && freight.freightAmount ? freight.freightAmount : 0)
                ).toFixed(2)}
              </View>
            </View>
          </View>
          <View className="toPay">
            <CButton
              theme="gardient"
              size="small"
              round={true}
              onClick={() => {
                console.log("to pay");
              }}
            >
              立即付款
            </CButton>
          </View>
        </View>
      )}
    </View>
  );
};

OrderConfirm.config = {
  navigationBarTitleText: "订单确认"
};

export default connect(({ order: { currentAddress } }) => ({
  currentAddress
}))(OrderConfirm as any);
