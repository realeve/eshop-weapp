import Taro, { useRouter } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import "./index.scss";
import { useFetch, CMaginify } from "@/components";

import { API } from "@/utils/setting";
import { handleGoodsData } from "./lib";
import Skeleton from "taro-skeleton";

import DTitle from "./components/title";
import DSpec from "./components/spec";

const Detail = () => {
  const {
    params: { id }
  } = useRouter();

  let { data, loading, error, reFetch } = useFetch({
    param: {
      ...(API.GOODS as {}),
      data: { commonId: id }
    },
    callback: handleGoodsData,
    valid: () => id > "0"
  });
  console.log(data);

  return (
    <View className="detail-page">
      <Skeleton loading={loading} animate rowHeight={375} row={1}>
        <CMaginify data={data && data.imgs && data.imgs[0]} />
      </Skeleton>

      <Skeleton loading={loading} animate row={3}>
        <DTitle data={data || {}} />
      </Skeleton>

      <Skeleton loading={loading} animate row={2}>
        <DSpec data={data || {}} />
      </Skeleton>
    </View>
  );
};

Detail.config = {
  navigationBarTitleText: "商品详情"
};

export default connect(({ detail }) => detail)(Detail as any);
