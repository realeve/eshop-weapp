import Taro from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import "./index.scss";
import { jump } from "@/utils/lib";
import CountTime from "@/pages/user/order/components/CountTime";

export default ({ data }) => {
  return (
    <View className="seckill">
      <View className="alignRow">
        <View className="title">秒杀</View>
        <view className="alignRow">
          <Text className="time">12点场</Text>
          <CountTime
            isCard
            showIcon={false}
            format={{ day: "天", hours: ":", minutes: ":", seconds: "" }}
            time={data.remainSeconds}
          />
        </view>
      </View>
      <view
        className="more"
        onClick={() => {
          jump("/pages/seckill/index");
        }}
      >
        更多 <Text className="at-icon at-icon-chevron-right" />
      </view>
    </View>
  );
};
