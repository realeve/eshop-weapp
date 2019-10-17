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

export interface IGlobalModel {
  user: any;
  special: {
    batchId: string;
    imageUrl: string;
    type: string;
  };
  cateList: ICateItem[];
  collectionList: ICollection;
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
  }
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
          componentD,
          componentE
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

        dispatch({
          type: namespace + "/setStore",
          payload
        });

        console.log(componentC, componentD, componentE);
      });

      // 载入用户登录信息
      // await loadUserInfo(dispatch);
      // return history.listen(({ pathname, search }) => {

      // });
    }
  }
};
