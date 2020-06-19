import Taro, { useState, useEffect } from "@tarojs/taro"; //  usePageScroll,
import { View, ScrollView } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import { IGlobalModel } from "@/models/common";
import {
  Search,
  BannerImg,
  CateList,
  CollectionList,
  NewProduct,
  Carousel
} from "./components/";
import { getWindowHeight } from "@/utils/style";

import * as wx from "@/utils/weixin";

import "./index.scss";

const handlePos = (res: Taro.PageScrollObject) =>
  Math.min(Math.ceil(res.scrollTop / 50), 10);
// export interface IProps extends IGlobalModel {
//   [key: string]: any;
// }
const Index = ({
  special,
  // cateList,
  menuList,
  collectionList,
  newProduct,
  specialList,
  normalList,
  isLogin,
  dispatch
}: IGlobalModel) => {
  let [pos, setPos] = useState(0);

  const onScroll = event => {
    setPos(handlePos(event.detail));
  };

  useEffect(() => {
    // 场景2/场景3：未登录用户自动登录
    if (!isLogin) {
      wx.bindWXInfo(dispatch);
    }

    // 微信分享
    wx.initShare({
      title: "中钞贵金属平台",
      subTitle: "货币文化产品与服务电子商务平台"
    });
  }, []);

  return (
    <View className="index-page">
      <Search pos={pos} />
      <ScrollView
        scrollY
        style={{ height: getWindowHeight() }}
        onScroll={onScroll}
      >
        <BannerImg special={special} />
        <CateList data={menuList} dispatch={dispatch} />
        <Carousel data={normalList} ratio="1.05" />
        <CollectionList data={collectionList} />
        <Carousel data={specialList} />
        <NewProduct data={newProduct} />
      </ScrollView>
    </View>
  );
};

Index.config = {
  navigationBarTitleText: "首页"
  // backgroundColor: "#f8f9fb"
};

export default connect(({ common }: { common: IGlobalModel }) => common)(
  Index as any
);
