import Taro from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import "./index.less";

import { connect } from "@tarojs/redux";
import { IGlobalModel } from "@/models/common";

import Search from "./components/search/";

export interface IProps extends IGlobalModel {
  [key: string]: any;
}
const Index = ({ special }: IProps) => {
  return (
    <View className="index-page">
      <View className="banner">
        <Search className="searchWrap" />
        <View>
          {special.batchId > 0 && (
            <Image src={special.imageUrl} className="img" />
          )}
        </View>
      </View>
      <Text>首页</Text>
    </View>
  );
};

Index.config = {
  navigationBarTitleText: "首页"
};

export default connect(({ common }: { common: IGlobalModel }) => ({
  special: common.special
}))(Index as any);
