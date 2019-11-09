import Taro from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import "./index.scss";
import { ICollection } from "@/pages/index/components/collectionList";
import * as R from "ramda";
import { CPrice } from "@/components/";

export interface IProps {
  data: ICollection;
  [key: string]: any;
}
const Suggest = ({ data = { data: [] } }: IProps) => {
  return (
    <View className="suggest-page">
      <View className="grid">
        {R.splitEvery(2, data.data).map((row, rowId) => (
          <View className="row" key={rowId + ""}>
            {row.map(item => (
              <View className="item" key={item.titleCh}>
                <Image mode="aspectFit" src={item.imageUrl} className="img" />
                <View className="detail">
                  <View className="title">{item.goodsTitle}</View>
                  <View className="subTitle">
                    <CPrice retail={item.goodsPrice} />
                    <View className="title">{item.payNumber}人已付款</View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
};

Suggest.config = {
  navigationBarTitleText: "精选推荐"
  // backgroundColor: "#f8f9fb"
};

export default connect(({ common }) => ({
  data: common.collectionList
}))(Suggest as any);
