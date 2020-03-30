import Taro, { useState, useRouter, useEffect } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import * as R from "ramda";
import { CPrice, CEmpty } from "@/components/";
import useFetch from "@/components/hooks/useFetch";
import Skeleton from "taro-skeleton";
import { AtLoadMore } from "taro-ui";
import { API } from "@/utils/setting";
import { jump } from "@/utils/lib";
import { IPropGoodsList } from "./lib";
import ImgStore from "./img/store.svg";
import { connect } from "@tarojs/redux";
import { IMenuItem as ICateModel } from "../../models/common";
import Tab from "./tab";
import Sort from "./sort";
import classnames from "classname";
import Search from "@/pages/index/components/search/";

import { getWebp } from "@/services/common";

import "./index.scss";

let { windowHeight } = Taro.getSystemInfoSync();

const initState = ({ keyword, cat }) => ({
  keyword: keyword || "",
  cat: cat || ""
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

const Index = ({ menuList }) => {
  let router = useRouter();
  // 页面未加载时仍会载入数据
  if (router.path !== "/pages/search/index") {
    return null;
  }

  const [state, setState] = useState<{
    keyword: string;
    cat: string;
  }>(router.params || { keyword: "", cat: "" });
  useEffect(() => {
    setState(router.params);
  }, [router.params]);

  // let { keyword, cat } = router.params || {};

  const [sort, setSort] = useState({
    key: "goods",
    sort: "desc"
  });

  const getParam = (_page = page) => {
    return {
      pageSize: 6,
      sort: `${sort.key}_${sort.sort}`,
      page: _page,
      express: 0,
      ...initState(state)
    };
  };

  const [page, setPage] = useState(1);
  const [params, setParams] = useState(getParam());

  const [tabs, setTabs] = useState<
    {
      id: number;
      name: string;
    }[]
  >([]);

  const [current, setCurrent] = useState(0);
  const [inited, setInited] = useState(false);

  useEffect(() => {
    if (!state.cat || String(state.cat).length === 0 || menuList.length === 0) {
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
        let dist = R.findIndex(cateItem => cateItem.id == state.cat)(
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
  }, [state.cat, menuList]);

  // 没有更多了
  const [more, setMore] = useState(false);

  let { data, loading, setData } = useFetch<ICateGoodsItem[]>({
    param: {
      url: API.SEARCH as string,
      params
    },
    valid: () => !(R.isNil(state.cat) && (state.keyword || "").length === 0), // 空页面时不加载
    callback: ({ goodsList, pageEntity }) => {
      setMore(pageEntity.hasMore);
      setInited(true);
      let res = goodsList.map((item: IPropGoodsList) => ({
        price: item.webPrice0,
        commonId: item.commonId,
        title: item.goodsName,
        img: getWebp(item.goodsImageList[0].imageSrc),
        store: item.storeName,
        sellerId: item.sellerId,
        storeId: item.storeId,
        goodsSaleNum: item.goodsSaleNum, //已售
        freight: item.goodsFreight
      }));
      let _data = data || [];
      // console.log("加载更多页面时数据需要合并");
      return [..._data, ...res];
    }
  });

  useEffect(() => {
    setPage(1);
    setData(null);
  }, [state.cat, state.keyword]);

  useEffect(() => {
    setParams({
      ...params,
      ...initState(state),
      sort: `${sort.key}_${sort.sort}`,
      page
    });
  }, [state.cat, state.keyword, sort, page]);

  const loadMore = () => {
    if (!more) {
      return;
    }
    setPage(page + 1);
    // console.log("加载更多");
  };

  // 更新cat信息
  const handleMenu = index => {
    const menu = tabs[index];
    setCurrent(index);
    let nextCat = menu.id;
    setState({
      ...state,
      cat: nextCat
    });
  };

  const searchMode = state.keyword && state.keyword.length > 0;

  return (
    <View
      className={classnames("cate-sub", {
        ["cate-subSmall"]: !searchMode && tabs.length < 2
      })}
    >
      {searchMode && <Search value={state.keyword || ""} fixed={true} />}
      {tabs.length > 1 && (
        <Tab list={tabs} current={current} onChange={handleMenu} />
      )}
      <Sort
        {...sort}
        onChange={res => {
          // 点击sort排序后，页码重置，数据重置
          setPage(1);
          setData(null);
          setSort(res);
        }}
        simple={tabs.length < 2 && !searchMode}
      />

      <Skeleton
        loading={loading && !inited}
        animate
        rowHeight={windowHeight / 2}
        row={3}
      >
        <View
          className={classnames("detail-page", {
            ["detail-pageSmall"]: !searchMode && tabs.length < 2
          })}
        >
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

          {data !== null && data.length === 0 ? (
            <CEmpty type="goods" />
          ) : (
            <AtLoadMore
              onClick={loadMore}
              status={loading ? "loading" : more ? "more" : "noMore"}
              noMoreText="—— 所有数据加载完毕 ——"
              className="more"
            />
          )}
        </View>
      </Skeleton>
    </View>
  );
};

Index.config = {
  navigationBarTitleText: "搜索",
  backgroundColor: "#f8f8f8"
};

export default connect(
  ({ common: { menuList } }: { common: { menuList: ICateModel } }) => ({
    menuList
  })
)(Index as any);
