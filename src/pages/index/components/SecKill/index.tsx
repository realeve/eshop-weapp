import Taro from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import "./index.scss";
import { jump } from "@/utils/lib";
import CountTime from "@/pages/user/order/components/CountTime";
import NewProduct from "../newProduct";
export default ({ res }) => {
  return (
    <View className="secwrap">
      <View className="seckill">
        <View className="alignRow">
          <View className="title">秒杀</View>
          <view className="alignRow">
            <Text className="time">{res.title}</Text>
            <CountTime
              isCard
              showIcon={false}
              format={{ day: "天", hours: ":", minutes: ":", seconds: "" }}
              time={res.remainSeconds}
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
      {res && res.data && res.data.length > 0 && (
        <NewProduct
          style={{ marginTop: "-10px" }}
          data={{ data: res.data }}
          showTitle={false}
        />
      )}
    </View>
  );
};
