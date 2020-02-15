import Taro from "@tarojs/taro";
import Skeleton from "taro-skeleton";
import DGoodsList from "../goodsList";
import useFetch from "@/components/hooks/useFetch";
import { API } from "@/utils/setting";

export default () => {
  let { data, loading } = useFetch({
    param: {
      method: "post",
      url: API.GOODS_GUESS as string
    },
    callback: res => res.goodsLiteVoList
  });
  return (
    <Skeleton loading={loading} animate row={3}>
      {data && data.length > 0 && (
        <DGoodsList data={data || []} title="猜你喜欢" />
      )}
    </Skeleton>
  );
};
