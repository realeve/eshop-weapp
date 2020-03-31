import * as lib from "@/utils/lib";
import * as R from "ramda";
import { LotteryStatus } from "@/pages/special/result/step";
import * as cartDb from "@/utils/cartDb";
import { ShoppingCartItem, ICartItem, IConfirmCart } from "@/utils/cart";
import { Dispatch } from "redux";
import success from "@/components/Toast/success";
import fail from "@/components/Toast/fail";
import { checkSaleTimeToday } from "@/utils/lib";

export interface IDetailState {
  curGoodsId: number;
  stockNum: number;
  number: number;
  limitAmount: number;
  buyLocking: boolean;
  detailData: IProductInfo;
}
import { getWebp } from "@/services/common";

export const handleStoreData = ({
  storeInfo,
  evaluateStoreVo
}: {
  storeInfo: any;
  evaluateStoreVo: any;
}) => {
  if (!storeInfo) {
    return {};
  }
  return {
    id: storeInfo.storeId,
    name: storeInfo.storeName,
    logo: storeInfo.storeLogoUrl,
    star: evaluateStoreVo.avgStoreEval,
    gradeName: storeInfo.gradeName,
    info: [
      { name: "商品评价", score: storeInfo.storeDesccredit },
      { name: "物流履约", score: storeInfo.storeDeliverycredit },
      { name: "售后服务", score: storeInfo.storeServicecredit }
    ],
    address: storeInfo.storeAddress,
    storePresales: storeInfo.storePresales,
    storeAftersales: storeInfo.storeAftersales
  };
};

export const handleCommentData = ({
  evaluateCount,
  evaluateStoreVo
}: {
  evaluateCount: any;
  evaluateStoreVo: any;
}) => {
  return {
    total: evaluateCount[1] + evaluateCount[2] + evaluateCount[3],
    evaluateCount,
    evaluateStoreVo,
    wellRate:
      evaluateCount[1] + evaluateCount[2] + evaluateCount[3] > 0
        ? (
            (evaluateCount[1] * 100) /
            (evaluateCount[1] + evaluateCount[2] + evaluateCount[3])
          ).toFixed(2)
        : 0
  };
};

export const handleHotData = ({
  storeRankingsList
}: {
  storeRankingsList: any;
}) => storeRankingsList;

export const handleWorkingTime = (str: string | undefined) =>
  (str || "")
    .replace("AM", "上午")
    .replace("PM", "下午")
    .replace("-", "至");

export interface ITypeImageItem {
  colorId: string;
  id: number;
  img80: string;
  img500: string;
  [key: string]: any;
}

const handleImageList: (
  list: { imageId: number; colorId: string; imageSrc: string }[]
) => {
  [key: number]: ITypeImageItem[];
}[] = list => {
  if (!list || list.length === 0) {
    return [];
  }
  let images = list.map(img => ({
    colorId: img.colorId,
    id: img.imageId,
    img80: getWebp(img.imageSrc),
    img500: getWebp(img.imageSrc)
  }));

  return R.groupBy(R.prop("colorId"), images);
};

export const handleGoodsData = data => {
  let goodsCount = R.reduce(
    (sum, item: { goodsStorage: number }) => sum + item.goodsStorage,
    0
  )(data.goodsDetail.goodsList || []);

  let storeData = handleStoreData(data);
  let evaData = handleCommentData(data);
  let hotData = handleHotData(data);
  console.log(hotData);
  let storeService = {
    workingTime: handleWorkingTime(data.storeInfo.storeWorkingtime),
    preSales: JSON.parse(data.storeInfo.storePresales || "[]"),
    afterSales: JSON.parse(data.storeInfo.storeAftersales || "[]")
  };

  let res = initData(data.goodsDetail, storeData, goodsCount);
  let canBuy = false;
  if (data) {
    canBuy =
      data.goodsDetail.goodsStatus &&
      lib.canSelloutNow(data.goodsDetail.goodsSaleTime as {}) &&
      res.number > 0;
  }
  let imgs = handleImageList(data.goodsDetail.goodsImageList);
  // console.log({
  //   storeData,
  //   goodsCount,
  //   canBuy,
  //   evaData,
  //   hotData,
  //   storeService,
  //   imgs
  // });

  return {
    ...res,
    storeData,
    canBuy,
    evaData,
    hotData,
    storeService,
    imgs
  };
};

export interface IAddressItem {
  name: string;
  value: number;
  [key: string]: any;
}

export interface ILotteryBuy {
  status: boolean; // 设为 true 时，渲染该内容
  expressPrice: string;
  currentStep: LotteryStatus; // 当前处于第几步
  endTime: string; // 结束时间
  lotteryTime: string; // 抽签时间
  closingTime: string; //收盘时间
  lotteryNum: number; //限定的中签数量

  limitNum: number; //限购

  realName: boolean; // 要求实名

  orderUserCount: number; //预约人数

  [key: string]: any;
}

export interface ISpecValueItem {
  imageSrc: string;
  specValueId: number;
  specValueName: string;
  title: string;
  [key: string]: any;
}
export interface ISpecItem {
  specId: number;
  specName: string;
  specValueList: ISpecValueItem[];
}

type TGoodsTime = { range: string; week: number } | boolean;
export interface IProductInfo {
  id: string;
  shopName: string;
  shopAddress: string;
  defaultAddress: IAddressItem[];
  expressPrice: number;
  title: string;
  titleTag?: string;

  // 限时购
  limitBuy?: {
    title?: string;
    status: boolean;
    percent?: number;
    type: number;
    endTime: string;
  };

  // 抽签购
  lotteryBuy?: ILotteryBuy;

  tags?: string[];
  price: string;
  counter?: string;
  delivery_time?: string;
  number: number;
  goodsSaleNum: number;
  goodsRate: number;
  goodsSaleTime?: { range: string; week: number } | boolean;
  discount?: {
    title: string;
    text: string;
    date: string;
  }[];
  promote?: {
    title: string;
    text: string;
  }[];
  specs?: ISpecItem[];
  specValue?: { goodsId: number; specValueIds: number[] }[];
  commendList?: {
    id: string | number;
    img: string;
    title: string;
    price: string | number;
    [key: string]: any;
  }[];
  services?: {
    key: string;
    title: string;
  }[];
  tips?: string;
  goodsId?: number;
  [key: string]: any;
}

const WEEKDAYS = ["周日", "周六", "周五", "周四", "周三", "周二", "周一"];
export const getSaleTimeWeek: (param: { week: number }) => string = ({
  week
}) => {
  if (week === 31) {
    return "工作日 (周一至周五)";
  }
  let str: string[] = [];
  week
    .toString(2)
    .padStart(7, "0")
    .split("")
    .forEach((d, idx) => (d === "1" ? str.push(WEEKDAYS[idx]) : false));
  return str.reverse().join("，");
};

export const getSaleTimeRange: (param: { range: string }) => string = ({
  range
}) =>
  range
    .split(",")
    .map(item =>
      item
        .split("-")
        .map(t => t.substr(0, 2) + ":" + t.substr(2))
        .join("-")
    )
    .join(" , ");

const enum PROMO_TYPE {
  LIMITED_DISCOUNT = 1, // 限时折扣
  SECKILL = 6 // 秒杀
}

export const initData: (
  org: any,
  store: any,
  goodsCommonCount: number
) => IProductInfo | {} = (org, store, goodsCommonCount) => {
  if (!org) {
    return {};
  }

  let goods = org.goodsList[0] || {};
  let isPromo =
    (PROMO_TYPE.LIMITED_DISCOUNT === goods.promotionType ||
      (PROMO_TYPE.SECKILL === goods.promotionType && goods.isSeckill === 1)) &&
    goods.promotionState === 1 &&
    org.joinBigSale === 1 &&
    goods.webUsable === 1;
  let prod: IProductInfo = {
    id: org.commonId,
    goodsId: org.goodsId,
    title: org.goodsName,
    subTitle: org.jingle,
    price: isPromo ? goods.webPrice0 : org.webPrice0,
    counter: goods.goodsPrice0,
    discount: org.discount,
    titleTag:
      org.promotionType * org.promotionState > 0 ? org.promotionTypeText : "",
    img: getWebp(org.goodsImageList[0].imageSrc),

    goodsImageList: org.goodsImageList,
    goodsList: org.goodsList,

    // counter: '',
    unitName: org.unitName,
    shopId: store.storeId,
    shopName: store.storeName,
    shopAddress: store.storeAddress,
    defaultAddress: [
      { name: "四川省", value: 23 },
      { name: "成都市", value: 385 },
      { name: "温江区", value: 4217 }
    ],
    expressPrice: 0,
    tags: ["特价"],
    delivery_time: "7-10",
    number: 1,
    storage: goods.goodsStorage,
    limitAmount: isPromo ? goods.limitAmount : 0,
    goodsSaleNum: org.goodsSaleNum,
    goodsRate: org.goodsRate,
    goodsSaleTime: org.goodsSaleTime
      ? { range: org.goodsSaleTime.dayTimeRange, week: org.goodsSaleTime.week }
      : false,
    // discount: [{ title: '优惠券', text: '新人立减20元', date: '2019.03.15-2019.09.14' }],
    promote: [
      { title: "促销", text: "满3件打9折；满5件打8.8折" },
      { title: "满减", text: "满5000省200；满10000省450" }
    ],
    specs: org.specJson,
    specValue: org.goodsSpecValueJson,
    saleService: store.storePresales ? JSON.parse(store.storePresales)[0] : [],
    services: [
      // {
      //   key: '退',
      //   title: '7天无理由退货',
      // },
      //TODO 修改了key title
      {
        key: "正",
        title: "正品保障"
      },
      {
        key: "保",
        title: "顺丰保价"
      },
      {
        key: "退",
        title: "不支持7天无理由退换货"
      }
    ],
    tips: "本商品无质量问题不支持退换货",
    status: org.goodsStatus,
    limitBuy: isPromo
      ? {
          title: goods.promotionType === PROMO_TYPE.SECKILL ? "秒杀" : "限时购",
          status: true,
          endTime: org.goodsList[0].promotionEndTime,
          type: isPromo ? org.promotionType : undefined
        }
      : undefined
  };
  if (prod.goodsId === 0 && org.specJson.length === 0) {
    if (org.goodsList && org.goodsList.length) {
      prod.goodsId = org.goodsList[0].goodsId;
    }
  }
  return prod;
};

// 通过商品详情数据提取存储至购物车所需信息
export const getLocalStorageConfigByData: (
  data: IProductInfo,
  cartItem: ICartItem
) => IConfirmCart = (data, cartItem) => {
  let specValue = R.find(R.propEq("goodsId", Number(cartItem.goodsId)))(
    data.specValue || []
  );

  let specInfo: string[] = [];

  let img = "";
  if (specValue && data.specs) {
    specValue.specValueIds.forEach((spec: number) => {
      (data.specs || []).forEach((item: ISpecItem) => {
        let name = item.specName;
        let detail = R.find(R.propEq("specValueId", spec))(item.specValueList);
        if (detail) {
          specInfo.push(`${name}:${detail.specValueName}`);
          img = detail.imageSrc || img;
        }
      });
    });
  }

  return {
    type: lib.isLogin() ? "online" : "offline",

    shop: {
      id: data.shopId,
      name: data.shopName,
      saleService: data.saleService
    },
    spuid: Number(data.id),
    id: Number(cartItem.goodsId),
    name: data.title,
    spec: specInfo.join(","),
    price: Number(data.price),
    num: Number(cartItem.buyNum),
    valid: true,
    storage: data.number,
    img: img || data.img,
    totalPrice: 0,
    unitName: data.unitName
  };
};

const storeDetailType = "common/setStore";

// 导出函数，用于兄弟组件调用
export const buyGoods = (
  detail: IDetailState,
  data: IProductInfo,
  dispatch: Dispatch,
  addToCart: boolean = false
) => {
  // setShowCart(true);
  if (data.number === 0) {
    fail("当前商品无库存，您可以看看其它商品");
    return;
  }
  let curGoodsId = detail.curGoodsId;
  if (curGoodsId <= 0) {
    if (detail.detailData.specs && detail.detailData.specs.length === 0) {
      curGoodsId = data.goodsId || 0;
    }
    if (curGoodsId <= 0) {
      fail("请先选择规格参数");
      return;
    }
  }
  const checkTime = () => {
    if (!data.goodsSaleTime) {
      return true;
    }

    let check = checkSaleTimeToday(data.goodsSaleTime.week);
    if (!check) {
      fail(check);
      return false;
    }
    return true;
  };
  if (!checkTime()) {
    fail("此商品不在开放销售的时间窗口中");
    return;
  }

  // 2020-03-18 数量超出限制，此处未考虑购物车中数量累加的场景
  if (
    detail.stockNum > (data.limitAmount > 0 ? data.limitAmount : data.storage)
  ) {
    fail("数量超出了限制");
    return;
  }

  dispatch({
    type: storeDetailType,
    payload: {
      buyLocking: true
    }
  });

  let cartItem = {
    buyNum: detail.stockNum,
    goodsId: String(detail.curGoodsId)
  };

  let params: ShoppingCartItem = cartDb.getShoppingCartParam(cartItem);

  // 不是添加到购物车，直接购买
  if (!addToCart) {
    let nextState = getLocalStorageConfigByData(data, cartItem);

    nextState.type = "confirm";

    cartDb.setShoppingCart(nextState, dispatch);

    cartDb.addConfirmCart(nextState);

    dispatch({
      type: storeDetailType,
      payload: {
        buyLocking: false
      }
    });
    lib.jump({ url: "/order/confirm" });
    return;
  }

  // 加购物车
  // TODO 目前加购物车再去到结算页面请求价格和运费时，没有得到购物车Id，无法计算。
  // TODO 计算运费需要正确的地址信息
  cartDb
    .cartAdd(params)
    .then(() => {
      // router.push('/order/confirm');
      success("添加购物车成功");
      cartDb.setShoppingCart(
        getLocalStorageConfigByData(data, cartItem),
        dispatch
      );
    })
    .catch(err => {
      fail(`出错啦：${err.message}！`);
    })
    .finally(() => {
      dispatch({
        type: storeDetailType,
        payload: {
          buyLocking: false
        }
      });
    });
};
