import Taro, { useState } from "@tarojs/taro";
import { View } from "@tarojs/components";
import ListView from "taro-listview";
import { SPECIAL_GOODS } from "@/utils/api";
import useFetch from "@/components/hooks/useFetch";
import useSetState from "@/components/hooks/useSetState";
import { CEmpty } from "@/components";
import { historyHandler } from "./lib";
import PreorderItem from "./preorderItem";

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
    isLoaded: true,
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
        list: [...state.list, ...historyHandler(res)],
        isLoaded: true //page === 1
      });
    }
  });
  const onScrollToLower = async fn => {
    console.info("scroll trigger", state);
    if (state.hasMore) {
      setPage(page + 1);
    }
    fn();
  };

  const onRefresh = async fn => {
    reFetch();
    console.log("刷新数据");
    fn();
  };
  console.info("loading + loaded", loading, state.isLoaded, state.hasMore);
  return state && state.list && state.list.length > 0 ? (
    <View>
      <ListView
        isLoaded={state.isLoaded}
        hasMore={state.hasMore}
        style={{ height: "calc(100% - 40px)", background: "#f8f8f8" }}
        onScrollToLower={fn => onScrollToLower(fn)}
        onPullDownRefresh={fn => onRefresh(fn)}
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
  navigationBarTitleText: "历史预约活动"
};
export default History;
