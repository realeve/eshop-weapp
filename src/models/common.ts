import Taro from "@tarojs/taro";
import { setStore } from "@/utils/lib";
import * as db from "../services/common";
import { Dispatch } from "redux";

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
}

const state = {
  user: Taro.getStorageSync("user_info") || {},
  special: {
    batchId: "0",
    imageUrl: "",
    type: ""
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
        dispatch({
          type: namespace + "/setStore",
          payload: {
            special
          }
        });

        console.log(componentB, componentC, componentD, componentE);
      });

      // 载入用户登录信息
      // await loadUserInfo(dispatch);
      // return history.listen(({ pathname, search }) => {

      // });
    }
  }
};
