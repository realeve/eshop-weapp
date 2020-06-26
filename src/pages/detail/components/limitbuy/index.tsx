import Taro from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import "./index.scss";
import { AtCountdown } from "taro-ui";
import { getDhms } from "@/pages/user/order/components/CountTime";

export default ({ limitBuy }) => {
  console.log(limitBuy);
  let props = getDhms(limitBuy.endTime);
  return (
    <View className="limitbuy">
      <View>
        <View className="at-icon at-icon-clock" />
        <Text className="title">秒杀</Text>
      </View>
      <View className="remain">
        <Text className="remainTitle">距结束</Text>
        <AtCountdown
          isCard
          format={{ day: "天", hours: "时", minutes: "分", seconds: "秒" }}
          isShowDay={props.day > 0}
          {...props}
        />
      </View>
    </View>
  );
};
