import Taro from "@tarojs/taro";

import { View, Image, Text } from "@tarojs/components";

import "./index.scss";
import classnames from "classnames";

import Grass from "./grass.svg";
import Skeleton from "taro-skeleton";
import { getDescDetail, orderDesc } from "./lib";

interface IProps {
  data: {
    status: string;
    loading: boolean;
    sn?: string;
  };
  [key: string]: any;
}
const SpecialPanel = ({ data }: IProps) => {
  console.log(data);

  const failed =
    !data || ["unsigned", "lost", "other", "unlucky"].includes(data.status);

  return (
    <View className="special-page__panel">
      <Skeleton loading={!data || data.loading} row={6} rowHeight={30}>
        <View className="head">
          {/* <Image src={bg} mode="widthFix" className="img" /> */}
          <View
            className={classnames("content", {
              unlucky: data && data.status === "unlucky"
            })}
          >
            <View className="content-title">
              <View className="left">
                <View className="top" />
                <View className="btm" />
              </View>
              {data && data.status === "lucky" ? "CONGRATULATIONS" : "预约失败"}
              <View className="right">
                <View className="top" />
                <View className="btm" />
              </View>
            </View>
            <View className="detail">
              <Image src={Grass} className="grassLeft" mode="aspectFit" />
              <View className="result">
                <Text className="title">{orderDesc[data.status]}</Text>
                <Text className="desc">
                  {data.status === "other" && data.typeDesc}
                </Text>

                {(data.status === "signed" || true) && (
                  <Text className="code">{data.sn || "23332"}</Text>
                )}
              </View>
              <Image src={Grass} className="grassRight" mode="aspectFit" />
            </View>

            {/* 中签 | 已付款 | 付款超时 */}
            {!failed && (
              <CButton
                theme="gardient"
                size="small"
                style="width:100px;"
                onClick={() => {
                  console.log("checkOrder");
                }}
              >
                {data.status === "lucky" ? "立即付款" : "查看订单"}
              </CButton>
            )}

            <View className="tips">
              <Text className="tips__main">感谢您参与!</Text>
              <Text className="tips__desc">欢迎您关注最新的特品活动</Text>
            </View>
          </View>
        </View>
      </Skeleton>
    </View>
  );
};

export default SpecialPanel;
