import Taro, { useRouter, useState } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import "./index.scss";
import { useFetch, CMaginify } from "@/components";

import { API } from "@/utils/setting";
import { handleGoodsData, ISpecValueItem } from "./lib";
import Skeleton from "taro-skeleton";

import DTitle from "./components/title";
import DSpec, { getGoodsInfoBySpec } from "./components/spec";

import { ITypeImageItem } from "@/pages/detail/lib";
import * as R from "ramda";

import DComment from "./components/comment";
import DShop from "./components/shop";
import DContent from "./components/detail";

const Detail = () => {
  const {
    params: { id }
  } = useRouter();

  const [imgs, setImgs] = useState<ITypeImageItem[]>([]);

  let { data, loading, setData } = useFetch({
    param: {
      ...(API.GOODS as {}),
      data: { commonId: id }
    },
    callback: res => {
      let dist = handleGoodsData(res);
      let imgList = R.head(Object.values(dist.imgs));
      setImgs(imgList);
      return dist;
    },
    valid: () => id > "0"
  });

  const [spec, setSpec] = useState<ISpecValueItem[] | null>(null);

  // 规格变更时商品信息需同步更新
  const onSpecChange = res => {
    setSpec(res);
    let dist: ITypeImageItem[] = [];
    res.forEach((item: ISpecValueItem) => {
      dist = [...dist, ...(data.imgs[item.specValueId] || [])];
    });
    if (dist.length > 0) {
      setImgs(dist);
    }

    // 规格变更时，获取对应项的goodsId
    let specGoodsInfo = getGoodsInfoBySpec(res, data);
    if (!specGoodsInfo) {
      return;
    }

    let {
      appPrice0: price,
      goodsId,
      goodsFullSpecs,
      goodsStorage: number,
      imageSrc: img
    } = specGoodsInfo;

    // 更新当前数据信息
    setData({ ...data, goodsId, price, goodsFullSpecs, number, img });
  };

  console.log(data);

  // 购买数量
  const [goodsnum, setGoodsnum] = useState(1);

  return (
    <View className="detail-page">
      <Skeleton loading={loading} animate rowHeight={375} row={1}>
        <CMaginify data={imgs} circular={data && data.specs.length < 2} />
      </Skeleton>

      <Skeleton loading={loading} animate row={3}>
        <DTitle data={data || {}} />
      </Skeleton>

      <Skeleton loading={loading} animate row={2}>
        <DSpec
          goodsnum={goodsnum}
          data={data || {}}
          onSpecChange={onSpecChange}
          onGoodsnumChange={setGoodsnum}
        />
      </Skeleton>

      {/* 评论卡片，下间隔存在异常 */}
      <DComment id={id} />

      <Skeleton loading={loading} avatar animate row={2}>
        <DShop data={(data && data.storeData) || {}} />
      </Skeleton>
      <DContent id={id} />
    </View>
  );
};

Detail.config = {
  navigationBarTitleText: "商品详情"
};

export default connect(({ detail }) => detail)(Detail as any);
