import Taro from "@tarojs/taro";
import classNames from "classnames";
import "./index.scss";
import { CPrice, CButton } from "@/components";
import { jump } from "@/utils/lib";

import { View, Image, Text } from "@tarojs/components";

export interface ICouponItem {
  title: string;
  id: string;
  hour: string;
  img: string;
  tip?: string;
  total: number;
  rest: number | string;
  price: string;
  counter: string;
}
interface ICouponData {
  data: ICouponItem;
  style?: React.CSSProperties;
  className?: string;
  state?: string;
  [key: string]: any;
}
let titleDate: {
  start: string;
  end: string;
  before: string;
  selling: string;
  taked: string;
} = {
  start: "立即抢购",
  end: "已结束",
  before: "开抢提醒",
  selling: "立即抢购",
  taked: "去看看"
};

const STATE = [0, 1, 2];
const STATE_TITLE = ["即将登场", "抢购中", "已结束"];

const CouponItem: (prop: ICouponData) => React.ReactElement = ({
  data,
  style,
  className,
  state
}) => {
  let isEmpty = data.rest == 100 || data.total == 0;
  return (
    <View className={classNames("couponItem", className)} style={style}>
      <View className="img">
        <Image
          src={data.img}
          onClick={() => jump(`/pages/detail/index?id=${data.id}`)}
          className="img_item"
        />

        {isEmpty && (
          <View className="invalid">
            <View className="circle">已抢完</View>
          </View>
        )}
      </View>

      <View className="content">
        <View
          className="title"
          onClick={() => jump(`/pages/detail/index?id=${data.id}`)}
        >
          {data.title}
        </View>
        <View className="tips">{data && data.tip}</View>
        <View className="style">
          <View className="progress">
            <View
              className="active"
              style={{ width: `${data.rest || 0}%` }}
            ></View>
          </View>
          <View className="rest">还剩 {data.total}件</View>
        </View>

        <View className="action">
          <Text className="action_title">限购价：</Text>
          <CPrice
            retail={data.price}
            retailStyle={{ marginLeft: 10, fontSize: 18 }}
            counter={data.counter}
            counterStyle={{ marginLeft: 10, fontSize: 16 }}
          />
        </View>
        <View className="btn">
          <CButton
            theme={!isEmpty && state.value === 1 ? "normal" : "gardient"}
            size="small"
            onClick={() => {
              jump(`/pages/detail/index?id=${data.id}`);
            }}
          >
            {STATE_TITLE[state.value]}
          </CButton>
        </View>
      </View>
    </View>
  );
};

export default CouponItem;
