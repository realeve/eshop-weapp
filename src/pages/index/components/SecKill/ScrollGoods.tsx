import Taro from "@tarojs/taro";
import { ScrollView } from "@tarojs/components";
import "./ScrollGoods.scss";
import GoodsItem from "../newProduct/GoodsItem";

export default ({ data }) => {
  return (
    <ScrollView scrollX className="goods">
      {data.map(item => (
        <GoodsItem
          item={item}
          key={item.commonId}
          style={{ margin: "0 5px", width: "30%" }}
        />
      ))}
    </ScrollView>
  );
};
