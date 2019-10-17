import Taro, { usePageScroll, useState } from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import { IGlobalModel } from "@/models/common";
import Search from "./components/search/";
import "./index.less";

export interface IProps extends IGlobalModel {
  [key: string]: any;
}
const Index = ({ special }: IProps) => {
  let [pos, setPos] = useState(0);
  usePageScroll(res => {
    setPos(Math.min(Math.ceil(res.scrollTop / 70), 10));
  });

  return (
    <View className="index-page">
      <Search pos={pos} />
      <View className="banner">
        {special.batchId > 0 && (
          <Image src={special.imageUrl} className="img" />
        )}
        {special.batchId > 0 && (
          <Image src={special.imageUrl} className="img" />
        )}
        {special.batchId > 0 && (
          <Image src={special.imageUrl} className="img" />
        )}
        {special.batchId > 0 && (
          <Image src={special.imageUrl} className="img" />
        )}
        {special.batchId > 0 && (
          <Image src={special.imageUrl} className="img" />
        )}
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
