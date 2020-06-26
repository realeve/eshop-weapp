import Taro from "@tarojs/taro";
import { View } from "@tarojs/components";
import "./index.scss";
import * as R from "ramda";
import { IProps } from "../CollectionList";
import TitleItem from "../CollectionList/titleItem";
import GoodsItem from "./GoodsItem";

const NewProduct = ({ data = { data: [] }, style = {} }: IProps) => {
  return (
    <View className="newProduct" style={style}>
      <TitleItem data={data} />
      <View className="grid">
        {R.splitEvery(3, data.data).map((row, rowId) => (
          <View className="row" key={rowId + ""}>
            {row.map(item => (
              <GoodsItem key={item.commonId} item={item} />
            ))}
          </View>
        ))}
      </View>
    </View>
  );
};

export default NewProduct;
