import Taro, { usePageScroll, useState } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import { IGlobalModel } from "@/models/common";
import Search from "./components/search/";
import BannerImg from "./components/bannerImg";
import CateList from "./components/cateList";
import CollectionList from "./components/CollectionList";

import "./index.scss";

const handlePos = (res: Taro.PageScrollObject) =>
  Math.min(Math.ceil(res.scrollTop / 50), 10);
export interface IProps extends IGlobalModel {
  [key: string]: any;
}
const Index = ({ special, cateList, collectionList }: IProps) => {
  let [pos, setPos] = useState(0);
  usePageScroll(res => {
    setPos(handlePos(res));
  });

  return (
    <View className="index-page">
      <Search pos={pos} />
      <BannerImg special={special} />
      <CateList data={cateList} />
      <CollectionList data={collectionList} />
    </View>
  );
};

Index.config = {
  navigationBarTitleText: "首页"
};

export default connect(({ common }: { common: IGlobalModel }) => common)(
  Index as any
);
