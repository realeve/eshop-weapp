import { ICarouselItem } from "@/services/common";
import { axios } from "@/utils/axios";
import { API } from "@/utils/setting";

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

export const handleSpecialItem: (data: any[]) => ICarouselItem[] = data =>
  data.map(item => ({
    img: item.imageUrl,
    id: item.data,
    href: `/pages/index/special_detail/index?id=${item.data}`
  }));

// 首页特品产品详情列表
export interface ISpecialItem {
  commonId: number;
  img: string;
  title: string;
  price: string;
}
