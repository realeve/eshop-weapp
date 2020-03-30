import Taro, { useRouter, useState, useEffect } from "@tarojs/taro";
import { View, Image, Text } from "@tarojs/components";
import "./index.scss";
import Tab from "@/pages/search/tab/";
import ListView from "taro-listview";
import useSetState from "@/components/hooks/useSetState";
import useFetch from "@/components/hooks/useFetch";
import useLogin from "@/components/hooks/useLogin";
import { CPrice, CButton } from "@/components";

import { API } from "@/utils/api";
import { ISpecialListItem } from "./interface";
import { SUBSCRIBE_STATUS, SUBSCRIBE_PHASE } from "@/pages/special/db";
import { jump } from "@/utils/lib";

const handleSubscribes = (d: { datas: ISpecialListItem[] }) =>
  d.datas.map(item => ({
    payId: item.payId,
    activityId: item.activityId,
    orderId: item.orderId,
    orderSn: item.orderSn,
    subscriberSn: item.subscriberSn,
    // shop: item.storeName,
    shop: "中钞贵金属自营",
    price: item.goods.goodsPrice0,
    status: item.subscribeState,
    statusName: item.subscribeStateStr,

    orderTime: item.createDate,
    endTime: item.specialtyBatch.endTime,
    payExpireTime: item.specialtyBatch.payExpireTime,
    drawTime: item.specialtyBatch.drawTime,

    goods: [
      {
        goodsId: item.goodsId,
        title: item.goods.goodsName,
        url: item.goods.imageSrc,
        type: item.goods.goodsSpecs,
        price: item.goods.goodsPrice
      }
    ]
  }));

export const orderList: {
  name: string;
  key: string;
  id: number;
}[] = [
  {
    name: "全部",
    key: "all",
    id: 0
  },
  {
    name: "待抽签",
    key: "waiting",
    id: 1
  },
  {
    name: "已中签",
    key: "success",
    id: 2
  },
  {
    name: "未中签",
    key: "fail",
    id: 3
  }
];

const Order = () => {
  let isLogin = useLogin();
  const router = useRouter();

  const [current, setCurrent] = useState(router.params.state || 0);

  useEffect(() => {
    if ("undefined" == typeof router.params.state) {
      return;
    }
    setCurrent(+router.params.state);
  }, [router.params]);

  const [page, setPage] = useState(1);

  const [state, setState] = useSetState({
    hasMore: true,
    list: []
  });

  const { loading, reFetch } = useFetch({
    param: {
      url: API.MY_SUBSCRIBE
    },
    callback: e => {
      let res = handleSubscribes(e);
      let { hasMore } = e.pageEntity;
      setState({
        list: [...state.list, ...res],
        hasMore
      });
    },
    valid: () => state.hasMore && isLogin
  });

  // 更新cat信息
  const handleMenu = index => {
    setCurrent(index);

    // 重置数据列表
    setState({
      list: [],
      hasMore: true
    });

    reFetch();

    setPage(1);
  };

  const onScrollToLower = async fn => {
    setPage(page + 1);
    fn();
  };

  console.log(state.list);
  return (
    <View className="user_lottery">
      <Tab list={orderList} current={current} onChange={handleMenu} />
      <ListView
        lazy=".lazy-view"
        isLoaded={!loading}
        hasMore={state.hasMore}
        style={{ height: "calc(100% - 40px)", background: "#f8f8f8" }}
        onScrollToLower={onScrollToLower}
        onPullDownRefresh={onScrollToLower}
        className="detail"
      >
        {state.list.map(item => {
          return (
            <View className="at-list" key={item.subscriberSn}>
              <View className="header">
                <Text className="title">抽签时间:{item.drawTime}</Text>
                <View className="status">{item.statusName}</View>
              </View>
              <View className="goods">
                <Image src={item.goods[0].url} className="img" />
                <View className="title">
                  <View className="main">{item.goods[0].title}</View>
                  <View className="type">{item.goods[0].type}</View>
                </View>
                <View className="price">
                  <CPrice retail={item.goods[0].price} />
                  <View className="num">x {item.goods.length}</View>
                </View>
              </View>
              <View className="action">
                <CButton
                  theme="yellow"
                  size="small"
                  round={false}
                  style={{ width: "100px" }}
                  onClick={() => {
                    // 跳转至结果页
                    jump({
                      url: "/pages/special/result/index",
                      payload: {
                        id: item.activityId
                      }
                    });
                  }}
                >
                  预约详情
                </CButton>
                {SUBSCRIBE_PHASE[SUBSCRIBE_STATUS.NEED_PAY].includes(
                  item.status
                ) && (
                  <CButton
                    theme="gardient"
                    size="small"
                    round={false}
                    style={{ width: "100px", marginLeft: "12px" }}
                    onClick={() => {
                      console.log("付款,特品");
                    }}
                  >
                    立即付款
                  </CButton>
                )}
              </View>
            </View>
          );
        })}
      </ListView>
    </View>
  );
};

Order.config = {
  navigationBarTitleText: "我的预约"
};

export default Order;
