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
      <View className="skeleton lazy-view order_detail">
        <ListView
          lazy
          isLoaded={state.isLoaded}
          hasMore={state.hasMore}
          style={{ height: "100%" }}
          onScrollToLower={onScrollToLower}
          onPullDownRefresh={onScrollToLower}
        >
          {state.list.map((item, index) => {
            return (
              <View className="item" key={item.id}>
                <LazyBlock current={index} className="avatar">
                  <Image
                    className="avatar skeleton-radius"
                    src={item.author.avatar_url}
                  />
                </LazyBlock>
                <View className="title skeleton-rect">{item.title}</View>
              </View>
            );
          })}
        </ListView>
        <View className="at-list">
          <View className="at-list__item at-list__item--thumb">
            <View className="at-list__item-container">
              <View className="at-list__item-thumb item-thumb">
                <View className="taro-img item-thumb__info">
                  <Image
                    mode="scaleToFill"
                    style={{
                      width: "24px",
                      height: "24px",
                      marginRight: "12px"
                    }}
                    src="https://img12.360buyimg.com/jdphoto/s72x72_jfs/t6160/14/2008729947/2754/7d512a86/595c3aeeNa89ddf71.png"
                  />
                </View>
              </View>
              <View className="at-list__item-content item-content">
                <View className="item-content__info">
                  <View className="item-content__info-title">标题文字</View>
                </View>
              </View>
              <View className="at-list__item-extra item-extra">
                <View className="item-extra__icon">
                  <Text className="taro-text at-icon item-extra__icon-arrow at-icon-chevron-right"></Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

Order.config = {
  navigationBarTitleText: "我的订单"
};

export default Order;
