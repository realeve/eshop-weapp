import Taro from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import dayjs from "dayjs";
import { AtCountdown } from "taro-ui";
import "./index.scss";
let getDhms = time => {
  let diff = dayjs(time).diff(dayjs(), "second");
  let day = Math.floor(diff / (24 * 60 * 60));
  let hours = Math.floor((diff % (24 * 60 * 60)) / (60 * 60));
  let minutes = Math.floor((diff % (60 * 60)) / 60);
  let seconds = diff % 60;
  return {
    day,
    hours,
    minutes,
    seconds
  };
};

export default ({ time }) => {
  let props = getDhms(time);
  return (
    <View className="count_time">
      <View className="at-icon at-icon-clock" />
      <Text style={{ margin: "0 5px" }}>还剩</Text>
      <AtCountdown isShowDay={props.day > 0} {...props} />
    </View>
  );
};
