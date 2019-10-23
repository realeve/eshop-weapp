import Taro, { useRouter, useState, useEffect } from "@tarojs/taro";

import { View, Image } from "@tarojs/components";

import "./index.scss";
import { connect } from "@tarojs/redux";
import { API } from "@/utils/setting";
import { useFetch } from "@/components/";
import { handleSubscribe, ISubscribe } from "../db";
import Skeleton from "taro-skeleton";

interface IProps {
  [key: string]: any;
}
const SpecialResult = ({ dispatch, special }: IProps) => {
  const {
    params: { id }
  } = useRouter();

  const { data: subscribe, loading } = useFetch<ISubscribe>({
    param: { url: `${API.SP_SUBSCRIBER_INFO}/${id}` },
    callback: e => handleSubscribe(e, dispatch),
    valid: () => id > "0" && !special
  });

  return <View className="special-page__detail">这里显示抽签结果</View>;
};

SpecialResult.config = {
  navigationBarTitleText: "预约结果"
};

export default connect(({ special }) => special)(SpecialResult as any);