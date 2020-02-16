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

const enum LINK_TYPE {
  NONE = "none", //无操作
  SUBSCRIPTION = "theme", // 预约活动
  COMBINE = "special", // 系列商品
  GOODS = "goods", // 单个商品
  CATEGORY = "category", // 商品分类
  KEYWORD = "keyword" // 搜索关键字
}

export interface ICarouselItem {
  id: number;
  img: string;
  href: string;
}
const getComponentUrl = (type: string, value: string) => {
  if (!type || !value || type === LINK_TYPE.NONE) {
    return "";
  }

  if (type === LINK_TYPE.SUBSCRIPTION) {
    return `/pages/special/index?id=${value}`;
  }

  if (type === LINK_TYPE.COMBINE) {
    return "";
  }

  if (type === LINK_TYPE.GOODS) {
    return `/pages/detail/index?id=${value}`;
  }

  if (type === LINK_TYPE.CATEGORY) {
    return `/pages/cate-sub/cate-sub/index?categoryId=${value}`;
  }

  if (type === LINK_TYPE.KEYWORD) {
    return `/pages/search/index?keyword=${value}`;
  }

  return "";
};

export const loadCarsouel = () =>
  axios(API.INDEX_PRODUCTS).then(data => {
    let res =
      data.componentSlider && data.componentSlider.length === 1
        ? data.componentSlider[0].webSliderJsonMap.sliderPic.map(
            (d: any, idx: number) => ({
              id: idx,
              img: `${d.imageUrl}`, //?x-oss-process=image/resize,h_200`,
              href: getComponentUrl(d.linkType, d.linkValue)
            })
          )
        : [];
    return res;
  });
