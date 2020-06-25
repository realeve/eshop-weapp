import Taro, { useState } from "@tarojs/taro";
import "./index.scss";
import { AtIcon as Icon } from "taro-ui";
import * as R from "ramda";
import classNames from "classnames";
import { View, Text } from "@tarojs/components";

export interface IBuytimeItem {
  data?: string;
  hour?: string;
  title?: string;
  onClick?: (e: string) => void;
  maxNum?: string;
  [key: string]: any;
}

interface IBuytimeData {
  limitTime?: IBuytimeItem[];
  style?: React.CSSProperties;
  className?: string;
  Click?: (state: string) => void;
  [key: string]: any;
}

// 限购时间段说明信息
let titleDate: {
  start: string;
  end: string;
  before: string;
  selling: string;
  taked: string;
} = {
  start: "已开抢",
  end: "已结束",
  before: "即将开抢",
  selling: "抢购中",
  taked: "已抢完"
};

const BuyTime: (props: IBuytimeData) => React.ReactElement = ({
  limitTime = [],
  onClick,
  current,
  maxNum = 5
}) => {
  const [idx, setIdx] = useState(0);

  return (
    <View className="buytime">
      {limitTime.length > maxNum && (
        <View
          className={classNames("prev", {
            disabled: idx === 0
          })}
          onClick={() => {
            setIdx(R.clamp(0, limitTime.length - maxNum, idx - 1));
          }}
        >
          <Icon value="chevron-left" size="25" />
        </View>
      )}
      <View className="arrow">
        {limitTime.map(item => (
          <View
            className={classNames("time", {
              timeActive: item.id === current
            })}
            key={item.id}
            onClick={() => {
              onClick && onClick(item.id);
            }}
            style={{
              transform: `translateX(-${idx * 170}px)`,
              transition: "transform .5s"
            }}
          >
            <View className="date">
              <Text className="datename">{item.data}</Text>
              <Text className="hour">{item.hour}</Text>
            </View>
            <View className="title">{item.state.text}</View>
          </View>
        ))}
      </View>
      {limitTime.length > Number(maxNum) && (
        <View
          className={classNames("next", {
            disabled: idx === limitTime.length - maxNum
          })}
          onClick={() => {
            setIdx(R.clamp(0, limitTime.length - maxNum, idx + 1));
          }}
        >
          <Icon value="chevron-right" size={25} />
        </View>
      )}
    </View>
  );
};

export default BuyTime;
