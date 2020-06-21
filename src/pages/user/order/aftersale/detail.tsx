import Taro, { useRouter, useState, useEffect } from "@tarojs/taro";
import { View, Image, Text } from "@tarojs/components";
import "./detail.scss";
import useFetch from "@/components/hooks/useFetch";
import useLogin from "@/components/hooks/useLogin";
import * as R from "ramda";
import { IRefundDetailDB } from "./interface";
import { SERVICE } from "@/utils/api";
import {
  IPropGoodItem,
  getReturnStep,
  IReturnStep
} from "./components/goodsInfo";
import { prefix } from "@/components/CEmpty";
import classnames from "classname";
import Skeleton from "taro-skeleton";

const refundDetail = [
  { name: "商家", value: "shop_name" },
  { name: "订单编号", value: "orderSn" },
  { name: "退款编号", value: "refundSn" },
  { name: "退款金额", value: "refundAmount" },
  { name: "退款原因", value: "reimburse_reason" },
  { name: "退款类型", value: "reimburse_type" },
  { name: "退款说明", value: "reimburse_explain" }
];

/**
 * 处理退款、退货接口数据；
 * TODO 缺少商品规格、单价、用户留言信息
 */
const handleRefundItem: (res: IRefundDetailDB) => IPropGoodItem = res => {
  let data = res.refundItemVo;

  return {
    order_id: data.ordersId,
    orderSn: data.ordersSn,
    shop_name: data.storeName,
    shopId: data.storeId,

    refundId: data.refundId,
    refundType: data.refundType,

    title: data.goodsName,
    imageSrc: data.imageSrc,
    type: "", // TODO 缺少商品类型
    ordersGoodsVoList: data.ordersGoodsVoList,
    state: data.goodsState, // 物流状态(1为待发货,2为待收货,3为未收到,4为已收货)
    sellerState: data.sellerState, // 卖家处理状态 (1为待审核,2为同意,3为不同意)
    sellerTime: data.sellerTime,

    price: data.price || 0, // TODO 缺少商品单价信息
    refundAmount: data.refundAmount, //退款总金额
    refundSn: data.refundSn,
    number: data.goodsNum, // 退款数量，待确认
    reimburse_reason: data.ordersSnStr,
    reimburse_type: data.refundType,
    returnType: data.returnType,
    reimburse_explain: data.buyerMessage
  };
};

const Detail = () => {
  const router = useRouter();

  let isLogin = useLogin();

  const { loading, data } = useFetch({
    param: {
      ...SERVICE.refunDetail,
      data: {
        refundId: router.params.sid
      }
    },
    callback: handleRefundItem,

    valid: () => isLogin && !R.isNil(router.params.sid)
  });

  const [state, setState] = useState<IReturnStep>({
    desc: [],
    step: 0,
    status: "processing"
  });

  useEffect(() => {
    if (!data) {
      return;
    }

    let nextState = getReturnStep(
      data.returnType,
      data.sellerState,
      data.state
    );
    setState(nextState);
  }, [data]);

  return (
    <View className="detail">
      <View className="status">
        <Image className="img" src={prefix + "refund.svg"} />
        <Skeleton loading={loading} row={1}>
          <View className="name">{state.desc[state.step]}</View>
        </Skeleton>
      </View>
      <Skeleton loading={loading} row={2} avatar>
        <View className="at-list">
          {data &&
            data.ordersGoodsVoList.map((goodsItem, idx) => (
              <View
                className={classnames("at-list__item at-list__item--thumb", {
                  noBorder: idx === data.ordersGoodsVoList.length - 1
                })}
                key={goodsItem.commonId}
              >
                <View className="at-list__item-container">
                  <View className="at-list__item-thumb">
                    <Image
                      mode="scaleToFill"
                      className="item-thumb"
                      src={goodsItem.imageSrc}
                    />
                  </View>

                  <View className="at-list__item-content item-content">
                    <View className="item-content__info">
                      <View className="item-content__info-title spaceBetween">
                        <Text>{goodsItem.goodsName}</Text>
                        <Text>￥{goodsItem.goodsPayAmount.toFixed(2)}</Text>
                      </View>
                      <View className="item-content__info-subtitle spaceBetween">
                        <Text>{goodsItem.goodsFullSpecs}</Text>
                        <Text>× {goodsItem.buyNum}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            ))}
        </View>
      </Skeleton>
      <Skeleton loading={loading} row={refundDetail.length}>
        {data && (
          <View className="goods">
            {refundDetail.map(item => (
              <View className="item" key={item.value}>
                <View className="title">{item.name}：</View>
                <Text>{data[item.value]}</Text>
              </View>
            ))}
          </View>
        )}
      </Skeleton>
    </View>
  );
};

Detail.config = {
  navigationBarTitleText: "退款详情"
};

export default Detail;
