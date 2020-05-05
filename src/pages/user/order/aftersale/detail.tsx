import Taro, { useRouter, useState } from "@tarojs/taro";
import { View, Image, Text } from "@tarojs/components";
import "./index.scss";
import useSetState from "@/components/hooks/useSetState";
import useFetch from "@/components/hooks/useFetch";
import useLogin from "@/components/hooks/useLogin";
import classnames from "classname";

import { IAfterServicesListDB, getOperationStatus } from "./interface";
import { SERVICE } from "@/utils/api";

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
    reimburse_explain: "" // TODO 缺少留言信息
  };
};

const Detail = () => {
  const router = useRouter();

  let isLogin = useLogin();

  const [page, setPage] = useState(1);

  const [state, setState] = useSetState({
    isLoaded: true,
    hasMore: false,
    list: []
  });

  const { loading, reFetch } = useFetch({
    param: {
      ...SERVICE.refundList,
      params: {
        page
      }
    },
    callback: (e: {
      pageEntity;
      refundItemVoList: IAfterServicesListDB[];
      [key: string]: any;
    }) => {},
    valid: () => isLogin && router.params.sid
  });

  const onRefresh = () => {
    reFetch();
    console.log("刷新数据");
  };

  return <View className="user_order">d</View>;
};

Detail.config = {
  navigationBarTitleText: "退款详情"
};

export default Detail;
