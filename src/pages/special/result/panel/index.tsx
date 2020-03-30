import Taro from "@tarojs/taro";

import { View, Image, Text } from "@tarojs/components";

import "./index.scss";
import classnames from "classnames";

import Grass from "./grass.svg";
import Skeleton from "taro-skeleton";
import { getDescDetail, orderDesc } from "./lib";
import { CButton } from "@/components";

export interface IResultProp {
  countDown: string;
  curPeople: number;
  current: number | string;
  lotteryDate: string;
  lucky: number;
  payedBefore: string;
  phases: any;
  phone: string;
  sn?: string;
  total: number;
  type: string;
  typeDesc: string;
}
interface IProps {
  data: IResultProp;
  loading: boolean;
  [key: string]: any;
}
const SpecialPanel = ({ data, loading }: IProps) => {
  if (!data) {
    return null;
  }
  const failed = ["unsigned", "lost", "other", "unlucky"].includes(data.type);

  return (
    <View className="special-page__panel">
      <Skeleton loading={loading} row={6} rowHeight={30}>
        <View className="head">
          {/* <Image src={bg} mode="widthFix" className="img" /> */}
          <View
            className={classnames("content", {
              unlucky: failed
            })}
          >
            <View className="content-title">
              <View className="left">
                <View className="top" />
                <View className="btm" />
              </View>
              {data.type === "lucky" ? "CONGRATULATIONS" : "预约失败"}
              <View className="right">
                <View className="top" />
                <View className="btm" />
              </View>
            </View>
            <View className="detail">
              <Image src={Grass} className="grassLeft" mode="aspectFit" />
              <View className="result">
                <Text className="title">{orderDesc[data.type]}</Text>
                {data.typeDesc && <Text className="desc">{data.typeDesc}</Text>}

                {data.sn && <Text className="code">抽签码：{data.sn}</Text>}
              </View>
              <Image src={Grass} className="grassRight" mode="aspectFit" />
            </View>

            {/* 中签 | 已付款 | 付款超时 */}
            {!failed && (
              <CButton
                theme="gardient"
                size="small"
                style={{ width: "100px", marginTop: "10px" }}
                onClick={() => {
                  console.log("checkOrder");
                }}
              >
                {data.type === "lucky" ? "立即付款" : "查看订单"}
              </CButton>
            )}

            <View className="tips">
              <Text className="tips__main">感谢您的参与!</Text>
              <Text className="tips__desc">{getDescDetail(data)}</Text>
            </View>
          </View>
        </View>
      </Skeleton>
    </View>
  );
};

export default SpecialPanel;
