import Taro from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import "./GoodsItem.scss";
import { CPrice } from "@/components/";
import { jump } from "@/utils/lib";

const GoodsItem = ({ item, style }) => {
  return (
    <View
      className="item"
      onClick={() => {
        jump(`/pages/detail/index?id=${item.commonId}`);
      }}
      style={style}
    >
      <Image
        className="img"
        mode="aspectFit"
        key={item.titleCh}
        src={item.imageUrl.replace("statictest", "statictest")}
      />
      <View className="detail">
        <View className="title">{item.goodsTitle}</View>
        <CPrice
          className="price"
          retail={(item && item.goodsPrice) || 0}
          counter={(item && item.counter) || 0}
          counterStyle={{ marginLeft: "5px", fontSize: "16px" }}
        />
      </View>
    </View>
  );
};

export default GoodsItem;
