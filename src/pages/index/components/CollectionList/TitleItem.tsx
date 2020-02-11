import Taro from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import "./TitleItem.scss";

export interface ICollectionItem {
  commonId: number;
  goodsPrice: number;
  goodsTitle: string;
  imageUrl: string;
  payNumber: number;
  storeId: number;
  storeName: string;
}
export interface ITitle {
  titleCh: string;
  titleEn: string;
}

export default ({ data }: { data: ITitle }) => (
  <View className="title-homePage">
    <Text className="main">{data.titleCh}</Text>
    <Text className="sub">{data.titleEn}</Text>
  </View>
);
