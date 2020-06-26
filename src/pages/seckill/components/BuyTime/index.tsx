import Taro from "@tarojs/taro";
import "./index.scss";
import { AtIcon as Icon } from "taro-ui";
import classNames from "classnames";
import { View, Text, ScrollView } from "@tarojs/components";

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
// let titleDate: {
//   start: string;
//   end: string;
//   before: string;
//   selling: string;
//   taked: string;
// } = {
//   start: "已开抢",
//   end: "已结束",
//   before: "即将开抢",
//   selling: "抢购中",
//   taked: "已抢完"
// };

const BuyTime: (props: IBuytimeData) => React.ReactElement = ({
  limitTime = [],
  onClick,
  current
}) => {
  return (
    <View className="buytime">
      <ScrollView scrollX className="arrow">
        {limitTime.map(item => (
          <View
            className={classNames("time", {
              timeActive: item.id === current
            })}
            key={item.id}
            onClick={() => {
              onClick && onClick(item.id);
            }}
          >
            <View className="date">
              <Text className="datename">{item.data}</Text>
              <Text className="hour">{item.hour}</Text>
            </View>
            <View className="title">{item.state.text}</View>
          </View>
        ))}
      </ScrollView>
      <View className="icon">
        <Icon value="chevron-right" size={25} />
      </View>
    </View>
  );
};

export default BuyTime;
