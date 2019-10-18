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
