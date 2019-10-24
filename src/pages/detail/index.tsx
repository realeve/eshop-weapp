import Taro, { useRouter } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import "./index.scss";
import { useFetch } from "@/components";

import { API } from "@/utils/setting";
import { handleGoodsData, initData } from "./lib";

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

  return (
    <View className="detail-page">
      <Text>detail</Text>
    </View>
  );
};

Detail.config = {
  navigationBarTitleText: "这是页面标题信息"
};

export default connect(({ detail }) => detail)(Detail as any);
