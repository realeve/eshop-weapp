import Taro, { useState, useEffect } from "@tarojs/taro";
import { View, Image, Text } from "@tarojs/components";
import "./index.scss";
import Tab from "@/pages/search/tab/";
import * as db from "./db";
import ListView, { LazyBlock } from "taro-listview";
import useSetState from "@/components/hooks/useSetState";

let pageIndex = 1;

const Order = () => {
  const [current, setCurrent] = useState(0);

  // 更新cat信息
  const handleMenu = index => {
    setCurrent(index);
  };

  const [state, setState] = useSetState({
    isLoaded: false,
    error: false,
    hasMore: true,
    isEmpty: false,
    list: []
  });

  const getData = async (pIndex = pageIndex) => {
    if (pIndex === 1) {
      setState({ isLoaded: false });
    }
    const {
      data: { data }
    } = await Taro.request({
      url: "https://cnodejs.org/api/v1/topics",
      data: {
        limit: 10,
        page: pIndex
      }
    });
    return { list: data, hasMore: true, isLoaded: pIndex === 1 };
  };

  useEffect(() => {
    getData().then(res => {
      setState(res);
    });
  }, []);

  const onScrollToLower = async fn => {
    const { list } = state;
    const { list: newList, hasMore } = await getData(++pageIndex);
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
        style={{ height: "calc(100% - 40px)" }}
        onScrollToLower={onScrollToLower}
        onPullDownRefresh={onScrollToLower}
        className="order_detail at-list"
      >
        {state.list.map(item => {
          return (
            <View className="at-list__item at-list__item--thumb" key={item.id}>
              <View className="at-list__item-container">
                <View className="at-list__item-thumb">
                  <Image
                    mode="scaleToFill"
                    className="item-thumb"
                    src="https://img12.360buyimg.com/jdphoto/s72x72_jfs/t6160/14/2008729947/2754/7d512a86/595c3aeeNa89ddf71.png"
                  />
                </View>

                <View className="at-list__item-content item-content">
                  <View className="item-content__info">
                    <View className="item-content__info-title">
                      {item.title}
                    </View>
                    <View className="item-content__info-subtitle">
                      {item.title.slice(0, 8)}
                    </View>
                  </View>
                </View>
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
