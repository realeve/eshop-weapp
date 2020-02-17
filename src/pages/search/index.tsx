import Taro, { useState, useRouter, useEffect } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import "./index.scss";
import * as R from "ramda";
import { CPrice } from "@/components/";
import useFetch from "@/components/hooks/useFetch";
import Skeleton from "taro-skeleton";

import { API } from "@/utils/setting";
import { jump } from "@/utils/lib";
import { IPropGoodsList } from "./lib";
import ImgStore from "./img/store.svg";
import { connect } from "@tarojs/redux";
import { IMenuItem as ICateModel } from "../../models/common";
import Tab from "./tab";
import Sort from "./sort";

let { windowHeight } = Taro.getSystemInfoSync();

const initState = ({ keyword, cat }) => ({
  keyword: keyword || "",
  cat: cat || 1070
});

interface ICateGoodsItem {
  price: number;
  commonId: number;
  title: string;
  img: string;
  store: string;
  sellerId: number;
  storeId: number;
  goodsSaleNum: number;
  freight: number;
}

const Search = ({ menuList }) => {
  let router = useRouter();
  // 页面未加载时仍会载入数据
  if (router.path !== "/pages/search/index") {
    return null;
  }

  let { keyword, cat } = router.params || {};

  const [sort, setSort] = useState({
    key: "goods",
    sort: "desc"
  });

  const [page, setPage] = useState(1);
  const [params, setParams] = useState({
    pageSize: 10,
    sort: `${sort.key}_${sort.sort}`,
    page,
    express: 0,
    ...initState({ cat, keyword })
  });

  const [tabs, setTabs] = useState<
    {
      id: number;
      name: string;
    }[]
  >([]);

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!cat || String(cat).length === 0 || menuList.length === 0) {
      return;
    }
    let res: null | {
      name: string;
      categoryList: {
        id: number;
        name: string;
      }[];
    } = null;
    menuList.forEach(({ cates }) => {
      if (res) {
        return;
      }
      cates.forEach(item => {
        let dist = R.findIndex(cateItem => cateItem.id == cat)(
          item.categoryList
        );
        if (dist > -1) {
          res = item;
          setCurrent(dist);
          return;
        }
      });
    });
    if (!res) {
      setTabs([]);
      return;
    }
    setTabs(res.categoryList);
    Taro.setNavigationBarTitle({
      title: res.name
    });
  }, [cat, menuList]);

  useEffect(() => {
    setParams({
      ...params,
      ...initState({ keyword, cat })
    });
  }, [cat, keyword]);

  let { data, loading } = useFetch<ICateGoodsItem[]>({
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
        store: item.storeName,
        sellerId: item.sellerId,
        storeId: item.storeId,
        goodsSaleNum: item.goodsSaleNum, //已售
        freight: item.goodsFreight
      }));
    }
  });

  const handleMenu = index => {
    const menu = tabs[index];
    setCurrent(index);
    let nextCat = menu.id;

    // 载入对应数据
    setParams({
      ...params,
      cat: nextCat
    });
  };

  return (
    <View className="cate-sub">
      <Tab list={tabs} current={current} onChange={handleMenu} />
      <Sort
        {...sort}
        onChange={res => {
          setSort(res);
          setParams({
            ...params,
            sort: `${res.key}_${res.sort}`
          });
        }}
      />

      <Skeleton loading={loading} animate rowHeight={windowHeight / 2} row={3}>
        <View className="detail-page">
          <View className="grid">
            {R.splitEvery(2, data || []).map((row: ICateGoodsItem[], rowId) => (
              <View className="row" key={rowId + ""}>
                {row.map(item => (
                  <View className="item" key={item.commonId}>
                    <Image
                      mode="aspectFit"
                      src={item.img}
                      className="img"
                      onClick={() => {
                        jump(`/pages/detail/index?id=${item.commonId}`);
                      }}
                    />
                    <View className="detail">
                      <View
                        className="title"
                        onClick={() => {
                          jump(`/pages/detail/index?id=${item.commonId}`);
                        }}
                      >
                        {item.title}
                      </View>
                      <View
                        className="subTitle"
                        onClick={() => {
                          jump(`/pages/detail/index?id=${item.commonId}`);
                        }}
                      >
                        <CPrice retail={item.price} />
                        <View>{item.goodsSaleNum}人已付款</View>
                      </View>
                      <View
                        className="store"
                        style="justify-content:flex-start;"
                      >
                        <Image src={ImgStore} className="logo" />
                        {item.store}
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            ))}
          </View>
        </View>
      </Skeleton>
    </View>
  );
};

Search.config = {
  navigationBarTitleText: "搜索",
  backgroundColor: "#f8f8f8"
};

export default connect(
  ({ common: { menuList } }: { common: { menuList: ICateModel } }) => ({
    menuList
  })
)(Search as any);
