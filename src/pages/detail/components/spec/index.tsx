import Taro from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import "./index.scss";
import DCard from "../card";

const DetailCard = ({ data }) => {
  return (
    <DCard className="detail_page_spec">
      <View className="item">
        <Text className="title">选择</Text>
        <View>内容</View>
      </View>
    </DCard>
  );
};

export default DetailCard;
