import Taro from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import "./index.scss";
import * as R from "ramda";
import { IProps } from "../CollectionList";
import { CPrice } from "@/components/";
import TitleItem from "../CollectionList/titleItem";

import { jump } from "@/utils/lib";

const NewProduct = ({ data = { data: [] }, style = {} }: IProps) => {
  return (
    <View className="newProduct" style={style}>
      <TitleItem data={data} />
      <View className="grid">
        {R.splitEvery(3, data.data).map((row, rowId) => (
          <View className="row" key={rowId + ""}>
            {row.map(item => (
              <View
                className="item"
                key={item.commonId}
                onClick={() => {
                  jump(`/pages/detail/index?id=${item.commonId}`);
                }}
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
                    counterStyle={{ marginLeft: "10px", fontSize: "16px" }}
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
