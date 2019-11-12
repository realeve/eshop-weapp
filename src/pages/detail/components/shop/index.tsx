import Taro from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import "./index.scss";
import DCard from "../card";

import { IProductInfo } from "../../lib";

const DetailShop = ({ data }: { data: IProductInfo }) => {
  return (
    <DCard className="detail_page_shop">
      <View className="detail_page_shop_title">
        <Image
          mode="aspectFit"
          className="detail_page_shop_title_img"
          src={data.logo}
        />
        <Text style="margin-left:10px;">{data.name}</Text>
      </View>

      <View className="detail_page_shop_detail">
        {data.info.map(item => (
          <View key={item.name} className="alignRow">
            <Text>{item.name}</Text>
            <Text className="detail_page_shop_detail_score">{item.score}</Text>
          </View>
        ))}
      </View>
    </DCard>
  );
};

export default DetailShop;
