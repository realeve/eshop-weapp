import Taro, { useState, useEffect } from "@tarojs/taro";
import { View, Image, Text } from "@tarojs/components";
import "./index.scss";
import Tab from "@/pages/search/tab/";
import * as db from "./db";
import ListView from "taro-listview";
import useSetState from "@/components/hooks/useSetState";
import useFetch from "@/components/hooks/useFetch";

import HomeIcon from "@/pages/order/confirm/shop.svg";

import { ORDER } from "@/utils/api";

const Order = () => {
  const [current, setCurrent] = useState(0);
  const [page, setPage] = useState(1);
  const [state, setState] = useSetState({
    isLoaded: true,
    hasMore: false,
    list: [
      {
        payId: 100,
        shop: "lwgsh001测试专卖店",
        shopId: 12,
        orderId: 100,
        orderSN: 5420000000010000,
        orderTime: "2020-02-21 15:58:47",
        autoCancelTime: "2020-02-21 16:58:47",
        autoReceiveTime: null,
        ordersRefundState: 0,
        payAmount: 0.02,
        isVirtual: 0,
        shipSn: "",
        shipCode: "",
        sendTime: null,
        type: "",
        price: 0.02,
        express: 0.01,
        status: 10,
        statusName: "待付款",
        invoice: {},
        goods: [
          {
            spuid: 92,
            goodsId: 94,
            ordersGoodsId: 1199,
            title: "lwgsh001贵金属-养生银器-茶具01",
            url:
              "https://statictest.ccgold.cn/image/d2/a7/d2a7fbdcabec488f9edb80b8e1309d15.jpg",
            type: "颜色：粉色",
            price: 0.01,
            count: 1
          },
          {
            spuid: 92,
            goodsId: 95,
            ordersGoodsId: 1199,
            title: "lwgsh001贵金属-养生银器-茶具01",
            url:
              "https://statictest.ccgold.cn/image/d2/a7/d2a7fbdcabec488f9edb80b8e1309d15.jpg",
            type: "颜色：粉色",
            price: 0.01,
            count: 1
          },
          {
            spuid: 92,
            goodsId: 96,
            ordersGoodsId: 1199,
            title: "lwgsh001贵金属-养生银器-茶具01",
            url:
              "https://statictest.ccgold.cn/image/d2/a7/d2a7fbdcabec488f9edb80b8e1309d15.jpg",
            type: "颜色：粉色",
            price: 0.01,
            count: 1
          },
          {
            spuid: 92,
            goodsId: 97,
            ordersGoodsId: 1199,
            title: "lwgsh001贵金属-养生银器-茶具01",
            url:
              "https://statictest.ccgold.cn/image/d2/a7/d2a7fbdcabec488f9edb80b8e1309d15.jpg",
            type: "颜色：粉色",
            price: 0.01,
            count: 1
          }
        ],
        address: {
          name: "moren",
          phone: "13399990000",
          detail: "北京 北京市 东城区",
          address: "mmmrrr"
        }
      },
      {
        payId: 99,
        shop: "中钞贵金属",
        shopId: 3,
        orderId: 99,
        orderSN: 5230000000009900,
        orderTime: "2020-02-21 15:57:50",
        autoCancelTime: "2020-02-21 16:57:50",
        autoReceiveTime: null,
        ordersRefundState: 0,
        payAmount: 5,
        isVirtual: 0,
        shipSn: "",
        shipCode: "",
        sendTime: null,
        type: "",
        price: 5,
        express: 0,
        status: 10,
        statusName: "待付款",
        invoice: {},
        goods: [
          {
            spuid: 108,
            goodsId: 113,
            ordersGoodsId: 1198,
            title: "秒杀六号",
            url:
              "https://statictest.ccgold.cn/image/a3/60/a360786e9984ce666bb168f4c16277cc.jpg",
            type: "",
            price: 5,
            count: 1
          }
        ],
        address: {
          name: "moren",
          phone: "13399990000",
          detail: "北京 北京市 东城区",
          address: "mmmrrr"
        }
      }
    ]
  });

  //   const { loading } = useFetch({
  //     param: {
  //       ...ORDER.list,
  //       params: {
  //         ordersState: ["all", "new", "pay", "send", "noeval", "cancel"][current], //全部订单
  //         ordersType: db.EOrderTypes.real, // 实物订单
  //         keyword: "" // 搜索关键词 订单号或商品
  //       }
  //     },
  //     callback: (e: {
  //       pageEntity;
  //       ordersPayVoList: db.IOrderItem[];
  //       [key: string]: any;
  //     }) => {
  //       let { hasMore } = e.pageEntity;
  //       let list = db.convertOrderData(e.ordersPayVoList);
  //       setState({
  //         hasMore,
  //         list,
  //         isLoaded: page === 1
  //       });
  //     }
  //   });

  // 更新cat信息
  const handleMenu = index => {
    setCurrent(index);
  };

  const getData = async (pageIndex = page) => {
    if (pageIndex === 1) {
      setState({ isLoaded: false });
    }
    const {
      data: { data }
    } = await Taro.request({
      url: "https://cnodejs.org/api/v1/topics",
      data: {
        limit: 10,
        page: pageIndex
      }
    });
    return { list: data, hasMore: true, isLoaded: pageIndex === 1 };
  };

  const onScrollToLower = async fn => {
    const { list } = state;
    const { list: newList, hasMore } = await getData(page + 1);
    setPage(page + 1);
    setState({
      list: list.concat(newList),
      hasMore
    });
    fn();
  };

  console.log(state);

  return (
    <View className="user_order">
      <Tab list={db.orderStateList} current={current} onChange={handleMenu} />
      <ListView
        lazy=".lazy-view"
        isLoaded={state.isLoaded}
        hasMore={state.hasMore}
        style={{ height: "calc(100% - 40px)", background: "#f8f8f8" }}
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

              {order.goods.map(goodsItem => (
                <View
                  className="at-list__item at-list__item--thumb"
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
                          <Text>￥{goodsItem.price}</Text>
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
                  运费：￥{order.express}，共 {order.goods.length} 件商品
                </Text>
                <Text className="payAmount">实付：￥{order.payAmount}</Text>
              </View>
            </View>
          );
        })}
      </ListView>
    </View>
  );
};

Order.config = {
  navigationBarTitleText: "我的订单"
};

export default Order;
