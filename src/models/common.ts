import Taro from "@tarojs/taro";
import { setStore } from "@/utils/lib";
import * as db from "../services/common";
import { Dispatch } from "redux";
import { ICateItem } from "@/pages/index/components/cateList";
import { ICollection } from "@/pages/index/components/collectionList";

export { Dispatch };
export interface RouteData {
  pathname: string;
  query?: any;
  search?: string;
  state?: any;
}

interface IMenuItem {
  menuAd: never[];
  menuId: number;
  menuItemList: {
    itemData: {
      data: string;
      image: string;
      imageUrl: string;
      name: string;
      type: string;
    };
    itemId: number;
    itemMore: {
      data: string;
      image: string;
      imageUrl: string;
      name: string;
      type: string;
    };
    itemName: string;
    itemType: number;
    menuId: number;
    subitemData: {
      data: string;
      image: string;
      imageUrl: string;
      name: string;
      type: string;
    }[];
  }[];
  menuName: string;
}

export interface IGlobalModel {
  user: any;
  special: {
    batchId: string;
    imageUrl: string;
    type: string;
  };
  cateList: ICateItem[];
  collectionList: ICollection;
  newProduct: ICollection;
  menuList: IMenuItem[];
}

const state = {
  user: Taro.getStorageSync("user_info") || {},
  special: {
    batchId: "0",
    imageUrl: "",
    type: ""
  },
  cateList: [],
  collectionList: {
    data: [],
    titleCh: "",
    titleEn: ""
  },
  newProduct: {
    data: [],
    titleCh: "",
    titleEn: ""
  },
  menuList: []
};

const namespace = "common";
export default {
  namespace,
  state,
  reducers: { setStore },
  subscriptions: {
    async setup({ dispatch }: { dispatch: Dispatch; history: RouteData }) {
      db.loadHome().then(res => {
        let {
          componentA: special,
          componentB,
          componentC,
          componentD
          // componentE
        } = res;
        let payload = {};

        if (special) {
          payload = { ...payload, special };
        }

        if (componentB) {
          payload = { ...payload, cateList: componentB.data };
        }

        if (componentC) {
          payload = { ...payload, collectionList: componentC };
        }

        if (componentD) {
          payload = { ...payload, newProduct: componentD };
        }

        dispatch({
          type: "setStore",
          payload
        });

        // 热卖产品，后端暂无返回
        // console.log(componentE);
      });

      db.loadMenuList().then(menuList => {
        let menus = menuList.map(item => ({
          name: item.menuName,
          id: item.menuId,
          cates: item.menuItemList.map(menu => ({
            id: menu.itemId,
            name: menu.itemName,
            categoryList: menu.subitemData.map(sub => ({
              id: sub.data,
              name: sub.name,
              url: sub.imageUrl
            }))
          }))
        }));
        dispatch({
          type: "setStore",
          payload: { menuList: menus }
        });
      });

      // 载入用户登录信息
      // await loadUserInfo(dispatch);
      // return history.listen(({ pathname, search }) => {

      // });
    }
  }
};
