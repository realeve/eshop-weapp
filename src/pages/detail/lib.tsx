import * as lib from "@/utils/lib";
import * as R from "ramda";
import { LotteryStatus } from "@/pages/special/result/step";

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
    img80: img.imageSrc,
    img500: img.imageSrc
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
  console.log({
    storeData,
    goodsCount,
    canBuy,
    evaData,
    hotData,
    storeService
  });

  return {
    ...res,
    storeData,
    canBuy,
    evaData,
    hotData,
    storeService
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

type TGoodsTime = { range: string; week: number; text: string } | null;
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
    status: boolean;
    percent: number;
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
  goodsSaleTime?: TGoodsTime;
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
    icon: string;
    subTitle: string;
  }[];
  tips?: string;
  goodsId?: number;
  imgs: {
    [key: number]: ITypeImageItem[];
  }[];
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

export const initData: (
  org: any,
  store: any,
  goodsCommonCount: number
) => IProductInfo | {} = (org, store, goodsCommonCount) => {
  if (!org) {
    return {};
  }

  let goodsSaleTime: TGoodsTime = null;

  if (org.goodsSaleTime) {
    let saleTime = {
      range: org.goodsSaleTime.dayTimeRange,
      week: org.goodsSaleTime.week
    };
    goodsSaleTime = {
      ...saleTime,
      text: getSaleTimeWeek(saleTime) + " " + getSaleTimeRange(saleTime)
    };
  }

  let prod: IProductInfo = {
    id: org.commonId,
    goodsId: org.goodsId,
    title: org.goodsName,
    subTitle: org.jingle,
    titleTag:
      org.promotionType * org.promotionState > 0 ? org.promotionTypeText : "",
    img: org.goodsImageList[0].imageSrc,
    price: org.webPrice0,

    goodsImageList: org.goodsImageList,
    goodsList: org.goodsList,

    // counter: '',
    unitName: org.unitName,
    shopId: store.id,
    shopName: store.name,
    shopAddress: store.address,
    defaultAddress: [
      { name: "四川省", value: 23 },
      { name: "成都市", value: 385 },
      { name: "温江区", value: 4217 }
    ],
    expressPrice: 0,
    tags: ["特价"],
    delivery_time: "7-10",
    number: goodsCommonCount,
    goodsSaleNum: org.goodsSaleNum,
    goodsRate: org.goodsRate,
    goodsSaleTime,
    discount: [
      { title: "优惠券", text: "新人立减20元", date: "2019.03.15-2019.09.14" }
    ],
    promote: [
      { title: "促销", text: "满3件打9折；满5件打8.8折" },
      { title: "满减", text: "满5000省200；满10000省450" }
    ],
    specs: org.specJson,
    specValue: org.goodsSpecValueJson,
    saleService: JSON.parse(store.storePresales || "[]"),
    services: [
      // {
      //   key: '退',
      //   title: '7天无理由退货',
      // },
      {
        key: "正",
        title: "正品保障",
        icon: "zheng",
        subTitle: "中国印钞造币旗下品牌，央企出品，保证正品"
      },
      {
        key: "邮",
        title: "顺丰包邮",
        icon: "you",
        subTitle: "该商品通过顺丰速运为您提供快捷的配送服务"
      },
      {
        key: "保",
        title: "全额保价",
        icon: "bao",
        subTitle:
          "在配送时，我们会对商品进行全额保价，让您远在千里之外，享受无忧服务"
      }
    ],
    tips: "本商品无质量问题不支持退换货",
    status: org.goodsStatus,
    imgs: handleImageList(org.goodsImageList) // 图片列表
  };
  if (prod.goodsId === 0 && org.specJson.length === 0) {
    if (org.goodsList && org.goodsList.length) {
      prod.goodsId = org.goodsList[0].goodsId;
    }
  }
  return prod;
};
