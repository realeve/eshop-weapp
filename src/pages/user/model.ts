import * as db from "./service";
import { setStore } from "@/utils/lib";
import { RouteData, Dispatch } from "@/models/common";

export interface IUserModel {
  stateName: string;
  [key: string]: any;
}

const state: IUserModel = {
  stateName: "这里是全局挂载的数据"
};

export default {
  namespace: "user",
  state,
  reducers: {
    setStore
  },

  subscriptions: {
    async setup({ dispatch }: { dispatch: Dispatch; history: RouteData }) {
      // 载入个人信息
      console.log(history);
    }
  }
};
