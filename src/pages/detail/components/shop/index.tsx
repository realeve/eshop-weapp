import Taro from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import "./index.scss";
import DCard from "../card";

import { IProductInfo } from "../../lib";

const DetailShop = ({ data }: { data: IProductInfo }) => {
  return (
    <DCard className="detail_page_shop">
      <View className="title">
        <Image mode="aspectFit" className="img" src={data.logo} />
        <Text style="margin-left:10px;">{data.name}</Text>
      </View>

      <View className="detail">
        {data.info.map(item => (
          <View key={item.name} className="alignRow">
            <Text>{item.name}</Text>
            <Text className="score">{item.score}</Text>
          </View>
        ))}
      </View>
    </DCard>
  );
};

export default DetailShop;
