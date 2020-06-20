import Taro, { useState, useEffect } from "@tarojs/taro";
import { View } from "@tarojs/components";
import ListView from "taro-listview";
import { SPECIAL_GOODS } from "@/utils/api";
import useFetch from "@/components/hooks/useFetch";
import useSetState from "@/components/hooks/useSetState";
import { CEmpty } from "@/components";
import { historyHandler } from "./lib";
import PreorderItem from "./preorderItem";

import * as wx from "@/utils/weixin";

interface IOrderItem {
  activityId: number; // 主KEY
  goodsPrice: number;
  status: number;
  statusName: string;

  orderTime: string;
  endTime: string;
  payExpireTime: string;
  drawTime: string;

  goods: {
    goodsId: number;
    goodsName: string;
    imageSrc: string;
    goodsFullSpecs: string;
    price: number;
  };
  [key: string]: any;
}

interface ISubscribeList {
  list: Array<IOrderItem>;
  pageResult: {
    totalPage: number | undefined;
  };
}

const History = () => {
  const [page, setPage] = useState(1);

  const [state, setState] = useSetState({
    hasMore: false,
    list: []
  });

  const { loading, reFetch } = useFetch<ISubscribeList>({
    param: {
      ...SPECIAL_GOODS.history,
      params: {
        page
      }
    },
    callback: res => {
      let { hasMore } = res.pageResult;
      setState({
        hasMore,
        list: [...state.list, ...historyHandler(res)]
      });
    }
  });
  const onScrollToLower = async fn => {
    // 修复无限触发ScrollToLower
    if (loading || !state.hasMore) {
      return;
    }
    // console.info("scroll trigger");
    setPage(page + 1);
    fn();
  };

  useEffect(() => {
    wx.initShare({
      title: "中钞贵金属平台预约商品列表",
      subTitle: "货币文化产品与服务电子商务平台"
    });
  }, []);

  // console.info("loading + loaded", loading, state.isLoaded, state.hasMore);
  return state && state.list && state.list.length > 0 ? (
    <View>
      <ListView
        lazy=".lazy-view"
        isLoaded={!loading}
        hasMore={state.hasMore}
        style={{ height: "calc(100% - 40px)", flex: 1, background: "#f8f8f8" }}
        onScrollToLower={onScrollToLower}
        onPullDownRefresh={onScrollToLower}
      >
        {state.list.map((data: IOrderItem) => (
          <PreorderItem key={data.activityId} data={data} />
        ))}
      </ListView>
    </View>
  ) : (
    <CEmpty type="cart" />
  );
};

History.config = {
  navigationBarTitleText: "抽签购"
};
export default History;
