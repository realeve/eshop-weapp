import Taro from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import "./index.scss";
import * as R from "ramda";
import { TitleItem, IProps } from "../CollectionList";
import { CPrice } from "@/components/";

const NewProduct = ({ data = { data: [] } }: IProps) => {
  return (
    <View className="newProduct">
      <TitleItem data={data} />
      <View className="grid">
        {R.splitEvery(3, data.data).map((row, rowId) => (
          <View className="row" key={rowId + ""}>
            {row.map(item => (
              <View className="item">
                <Image
                  mode="aspectFit"
                  key={item.titleCh}
                  src={item.imageUrl}
                />
                <View className="detail">
                  <View className="title">{item.goodsTitle}</View>
                  <CPrice
                    className="price"
                    retail={(item && item.goodsPrice) || 0}
                  />
                </View>
              </View>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
};

export default NewProduct;
