import Taro from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import dayjs from "dayjs";
import { AtCountdown } from "taro-ui";
import "./index.scss";
export let getDhms = time => {
  let diff =
    typeof time === "string" ? dayjs(time).diff(dayjs(), "second") : time;
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

export default ({
  time,
  format = { day: "天", hours: "时", minutes: "分", seconds: "秒" },
  showIcon = true,
  isCard = false
}) => {
  let props = getDhms(time);
  return (
    <View className="count_time">
      {showIcon && <View className="at-icon at-icon-clock" />}
      {showIcon && <Text style={{ margin: "0 5px" }}>还剩</Text>}
      <AtCountdown
        isCard={isCard}
        format={format}
        isShowDay={props.day > 0}
        {...props}
      />
    </View>
  );
};
