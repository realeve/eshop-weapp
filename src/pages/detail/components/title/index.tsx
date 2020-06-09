import Taro from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import "./index.scss";
import DCard from "../card";
import { CPrice } from "@/components";

// NOTE:此处用 detail_page_title|detail_page_detail 两个样式是由于微信小程序样式需要按BEM规范，用CSS 层叠的方案无法生效

const DetailCard = ({ data = {} }) => {
  let address =
    data.shopAddress && data.shopAddress.includes("市")
      ? data.shopAddress.split("市")[0] + "市"
      : data.shopAddress;
  return (
    <DCard>
      <CPrice
        retail={data.price}
        // retailStyle="font-size:20px;"

        retailStyle={{ fontSize: "20px" }}
      />
      <Text className="detail_page_title">{data.title}</Text>
      <View className="detail_page_detail">
        <Text>运费:{data.expressPrice || "包邮"}</Text>
        <Text>已售:{data.goodsSaleNum}件</Text>
        {address && <Text>发货地:{address}</Text>}
      </View>
    </DCard>
  );
};

export default DetailCard;
