import Taro from "@tarojs/taro";
import { View } from "@tarojs/components";
import "./index.scss";
import DCard from "../card";
import { CPrice } from "@/components";

const DetailCard = ({ data }) => {
  let address =
    data.shopAddress && data.shopAddress.includes("市")
      ? data.shopAddress.split("市")[0] + "市"
      : data.shopAddress;
  return (
    <DCard className="detail_page_title">
      <CPrice retail={data.price} retailStyle="font-size:20px;" />
      <View className="title">{data.title}</View>
      <View className="detail">
        <View>运费:{data.expressPrice || "包邮"}</View>
        <View>已售:{data.goodsSaleNum}件</View>
        {address && <View>发货地:{address}</View>}
      </View>
    </DCard>
  );
};

export default DetailCard;
