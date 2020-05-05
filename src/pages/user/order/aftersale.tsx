import Taro, { useRouter, useState, useEffect } from "@tarojs/taro";
import { View, Image, Text } from "@tarojs/components";
import "./aftersale.scss";
import * as db from "./db";
import ListView from "taro-listview";
import useSetState from "@/components/hooks/useSetState";
import useFetch from "@/components/hooks/useFetch";
import useLogin from "@/components/hooks/useLogin";
import HomeIcon from "@/pages/order/confirm/shop.svg";
import classnames from "classname";
import { ORDER } from "@/utils/api";

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
    isLoaded: true,
    hasMore: false,
    list: []
  });

  const { loading, reFetch } = useFetch({
    param: {
      ...ORDER.list,
      params: {
        ordersState: ["all", "new", "pay", "send", "noeval", "cancel"][current], //全部订单
        ordersType: db.EOrderTypes.real, // 实物订单
        keyword: "", // 搜索关键词 订单号或商品
        page
      }
    },
    callback: (e: {
      pageEntity;
      ordersPayVoList: db.IOrderItem[];
      [key: string]: any;
    }) => {
      let { hasMore } = e.pageEntity;
      let list = db.convertOrderData(e.ordersPayVoList);
      setState({
        hasMore,
        list: [...state.list, ...list],
        isLoaded: true //page === 1
      });
    },
    valid: () => isLogin
  });

  const onScrollToLower = async fn => {
    if (state.hasMore) {
      setPage(page + 1);
    }
    fn();
  };

  const onRefresh = () => {
    reFetch();
    console.log("刷新数据");
  };

  console.log(state);

  return (
    <View className="user_order">
      <ListView
        // lazy
        isLoaded={state.isLoaded}
        hasMore={state.hasMore}
        onScrollToLower={onScrollToLower}
        onPullDownRefresh={onScrollToLower}
        className="order_detail"
      >
        {state.list.map(order => {
          return (
            <View className="at-list" key={order.payId}>
              <View className="header">
                <View className="shop">
                  <Image src={HomeIcon} className="icon" />
                  <Text className="title">{order.shop}</Text>
                </View>
                <View className="status">{order.statusName}</View>
              </View>

              {order.goods.map((goodsItem, idx) => (
                <View
                  className={classnames("at-list__item at-list__item--thumb", {
                    noBorder: idx === order.goods.length - 1
                  })}
                  key={goodsItem.goodsId}
                >
                  <View className="at-list__item-container">
                    <View className="at-list__item-thumb">
                      <Image
                        mode="scaleToFill"
                        className="item-thumb"
                        src={goodsItem.url}
                      />
                    </View>

                    <View className="at-list__item-content item-content">
                      <View className="item-content__info">
                        <View className="item-content__info-title spaceBetween">
                          <Text>{goodsItem.title}</Text>
                          <Text>￥{goodsItem.price.toFixed(2)}</Text>
                        </View>
                        <View className="item-content__info-subtitle spaceBetween">
                          <Text>{goodsItem.type}</Text>
                          <Text>× {goodsItem.count}</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              ))}

              <View className="footer">
                <Text>
                  运费：{"￥" + order.express || "包邮"}，共{order.goods.length}
                  件商品
                </Text>
                <Text className="payAmount">
                  实付：￥{order.payAmount.toFixed(2)}
                </Text>
              </View>

              <View className="action">查看详情</View>
            </View>
          );
        })}
      </ListView>
    </View>
  );
};

Order.config = {
  navigationBarTitleText: "退款/售后"
};

export default Order;
