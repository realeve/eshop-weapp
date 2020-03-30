import { ICarouselItem } from "@/services/common";
import { axios } from "@/utils/axios";
import { API } from "@/utils/setting";

export const getWebp = (url, webp) =>
  webp ? `${url}?x-oss-process=image/format,webp` : url;

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

// 首页特品产品详情列表
export interface ISpecialItem {
  commonId: number;
  img: string;
  title: string;
  price: string;
}
