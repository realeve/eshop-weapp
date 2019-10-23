import Taro, { useRouter, useState, useEffect } from "@tarojs/taro";

import { View, Image } from "@tarojs/components";

import "./index.scss";
import { connect } from "@tarojs/redux";
import { API } from "@/utils/setting";
import { useFetch } from "@/components/";
import { handleSubscribe, ISubscribe } from "../db";
import Skeleton from "taro-skeleton";
import classnames from "classnames";

import bg from "./main_bg.png";
import Grass from "./grass.svg";

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

  const status = "unlucky";

  return (
    <View className="special-page__result">
      <View className="head">
        <Image src={bg} mode="widthFix" className="img" />
        <View
          className={classnames("content", { unlucky: status === "unlucky" })}
          // className="content"
        >
          <View className="content-title">
            <View className="left">
              <View className="top" />
              <View className="btm" />
            </View>
            {status === "lucky" ? "CONGRATULATIONS" : "SORRY"}
            <View className="right">
              <View className="top" />
              <View className="btm" />
            </View>
          </View>
          <View className="detail">
            <Image src={Grass} className="grassLeft" />
            <View className="result">
              <View className="title">很遗憾</View>
              <View className="desc">您未中签</View>
            </View>
            <Image src={Grass} className="grassRight" />
          </View>

          <View className="tips">
            <View className="tips__main">感谢您参与!</View>
            <View className="tips__desc">欢迎您关注最新的特品活动</View>
          </View>
        </View>
      </View>
    </View>
  );
};

SpecialResult.config = {
  navigationBarTitleText: "预约结果"
};

export default connect(({ special }) => special)(SpecialResult as any);
