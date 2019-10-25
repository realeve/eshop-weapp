import Taro, { useState } from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import "./index.scss";
import DCard from "../card";
import { AtFloatLayout } from "taro-ui";
import { CPrice } from "@/components";

const DetailCard = ({ data }) => {
  const [showPanel, setShowPanel] = useState<boolean>(false);

  return (
    <DCard className="detail_page_spec">
      <View className="item">
        <Text className="title">选择</Text>
        <View className="detail">
          <View
            className="spec"
            onClick={() => {
              setShowPanel(true);
            }}
          >
            <View>请选择规格/包装</View>
            <View className="at-icon at-icon-chevron-right" />
          </View>
          {data.goodsSaleTime && (
            <View className="selltime">
              <View className="at-icon at-icon-clock"></View>
              该商品售卖时间为{data.goodsSaleTime.text}
            </View>
          )}
        </View>
      </View>

      <AtFloatLayout
        isOpened={showPanel}
        onClose={() => setShowPanel(false)}
        scrollY
      >
        <View className="specPanel">
          <View className="title">
            <Image className="img" src={data.img} />
            <View className="detail">
              <CPrice retail={data.price} retailStyle="font-size:20px;" />
              <Text className="storage">库存 {data.number}件</Text>
              <Text className="goodsname">{data.title}</Text>
            </View>
          </View>
          <View className="close" onClick={() => setShowPanel(false)}>
            <View className="at-icon at-icon-close-circle"></View>
          </View>
        </View>
      </AtFloatLayout>
    </DCard>
  );
};

export default DetailCard;
