import Taro, { useState, useRouter, useEffect } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import "./index.scss";
import * as R from "ramda";
import { CPrice } from "@/components/";
import useFetch from "@/components/hooks/useFetch";
import Skeleton from "taro-skeleton";

import { API } from "@/utils/setting";
import { ISpecialItem } from "src/services/common";
import { jump } from "@/utils/lib";
import { IPropGoodsList } from "./lib";

let { windowHeight } = Taro.getSystemInfoSync();

const initState = ({ keyword, cat }) => ({
  keyword: keyword || "",
  cat: cat || 1070
});

const Search = () => {
  let router = useRouter();
  // 页面未加载时仍会载入数据
  if (router.path !== "/pages/search/index") {
    return null;
  }

  let { keyword, cat } = router.params || {};

  const [page, setPage] = useState(1);
  const [params, setParams] = useState({
    pageSize: 9,
    sort: "goods_desc",
    page,
    express: 0,
    ...initState({ cat, keyword })
  });

  useEffect(() => {
    setParams({
      ...params,
      ...initState({ keyword, cat })
    });
  }, [cat, keyword]);

  let { data, loading } = useFetch<ISpecialItem[]>({
    param: {
      url: API.SEARCH as string,
      params
    },
    valid: () => !(R.isNil(cat) && (keyword || "").length === 0), // 空页面时不加载
    callback: ({ goodsList }) => {
      console.log(goodsList);
      return goodsList.map((item: IPropGoodsList) => ({
        price: item.webPrice0,
        commonId: item.commonId,
        title: item.goodsName,
        img: item.goodsImageList[0].imageSrc,
        store:item.storeName,
        sellerId:item.sellerId，
        goodsSaleNum:item.goodsSaleNum,//已售
        unitName:item.unitName，
        freight:item.goodsFreight
      }));
    }
  });
 

    return (
      <Skeleton loading={loading} animate rowHeight={windowHeight / 2} row={3}>
        <View className="detail-page">
          <View className="grid">
            {R.splitEvery(2, data || []).map((row: ISpecialItem[], rowId) => (
              <View className="row" key={rowId + ""}>
                {row.map(item => (
                  <View
                    className="item"
                    key={item.commonId}
                    onClick={() => {
                      jump(`/pages/detail/index?id=${item.commonId}`);
                    }}
                  >
                    <Image mode="aspectFit" src={item.img} className="img" />
                    <View className="detail">
                      <View className="title">{item.title}</View>
                      <View className="subTitle" style="justify-content:center;">
                        <CPrice retail={item.price} />
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            ))}
          </View>
        </View>
      </Skeleton>
    );
};

Search.config = {
  navigationBarTitleText: "活动商品"
};

export default Search;
