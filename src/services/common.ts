import { ICarouselItem } from "@/services/common";
import { axios } from "@/utils/axios";
import { API } from "@/utils/setting";
import { get as getGlobalData } from "@/utils/global_data";
import moment from "dayjs";
let __webp = getGlobalData("webp");

export const getWebp = (url, webp = __webp) =>
  webp ? `${url}?x-oss-process=image/format,webp` : url;

export const getWebpSuffix = (webp = __webp) =>
  `?x-oss-process=image/resize,limit_0,m_fill,w_250,h_250${
    webp ? "/format,webp" : ""
  }`;

export const loadHome = () =>
  axios({
    method: "post",
    url: API.INDEX_COMPONENT as string
  });

export const loadMenuList = () =>
  axios({
    url: API.CATEGORY as string
  }).then(({ menuList }) => menuList);

export interface ICarouselItem {
  id: number;
  img: string;
  href: string;
}

export const handleSpecialItem: (
  data: any[],
  webp: boolean
) => ICarouselItem[] = (data, webp) => {
  return data.map(item => ({
    img: getWebp(item.imageUrl, webp),
    id: item.data,
    href: `/pages/index/special_detail/index?id=${item.data}`
  }));
};

interface ISecPopularList extends IPopularList {
  seckillCommonId: number;
  seckillGoodsPrice: number;
  goodsName: string;
  imageSrc: string;
  scheduleId: number;
  startTime: string;
  endTime: string;
  scheduleState: number;
  scheduleStateText: string;
  commonId: number;
  goodsPrice: number;
}

export const handleSecGoodsList = (goods: {
  seckillGoodsCommonVoList: ISecPopularList[];
  titleCh: string;
  seckillTime: number;
  seckillName?: string;
}) => {
  let data =
    goods.seckillGoodsCommonVoList && goods.seckillGoodsCommonVoList.length > 0
      ? goods.seckillGoodsCommonVoList.map((item: ISecPopularList) => ({
          commonId: item.commonId,
          imageUrl: item.imageSrc,
          goodsTitle: item.goodsName,
          goodsPrice: item.seckillGoodsPrice,
          counter: item.goodsPrice
        }))
      : undefined;
  return {
    data,
    title: goods.seckillName,
    titleEn: goods.titleCh,
    remainSeconds: goods.seckillTime,
    scheduleId: data ? goods.seckillGoodsCommonVoList[0].scheduleId : undefined,
    startTime: data ? goods.seckillGoodsCommonVoList[0].startTime : undefined,
    endTime: data
      ? goods.seckillGoodsCommonVoList[0].endTime
      : moment()
          .add(goods.seckillTime, "s")
          .format("YYYY-MM-DD HH:mm:ss"),
    state: data ? goods.seckillGoodsCommonVoList[0].scheduleState : undefined,
    stateTxt: data
      ? goods.seckillGoodsCommonVoList[0].scheduleStateText
      : undefined,
    type: "seckill"
  };
};
// 首页特品产品详情列表
export interface ISpecialItem {
  commonId: number;
  img: string;
  title: string;
  price: string;
}
