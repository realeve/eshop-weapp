import Taro from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import "./index.scss";
import { AtCountdown } from "taro-ui";
import { getDhms, IHms } from "@/pages/user/order/components/CountTime";
import dayjs from "dayjs";

const getConfig: (
  data: any
) => {
  status: boolean;
  title: string;
  param?: IHms;
} = data => {
  if (dayjs().isBefore(data.startTime)) {
    return {
      status: true,
      title: "距开始",
      param: getDhms(data.startTime)
    };
  } else if (dayjs().isBefore(data.endTime)) {
    return {
      status: true,
      title: "距结束",
      param: getDhms(data.endTime)
    };
  }
  return {
    status: false,
    title: `已于 ${data.endTime} 结束`
  };
};

export default ({ limitBuy }) => {
  let props = getConfig(limitBuy);
  return (
    <View className="limitbuy">
      <View>
        <View className="at-icon at-icon-clock" />
        <Text className="title">秒杀</Text>
      </View>
      <View className="remain">
        <Text className="remainTitle">{props.title}</Text>
        {props.param && (
          <AtCountdown
            isCard
            format={{ day: "天", hours: "时", minutes: "分", seconds: "秒" }}
            isShowDay={props.param.day > 0}
            {...props.param}
          />
        )}
      </View>
    </View>
  );
};
