import * as db from "./service";
import { setStore } from "@/utils/lib";

export interface IFindModel {
  stateName: string;
  [key:string]: any;
}

const state: IFindModel = {
  stateName: "这里是全局挂载的数据"
};

export default {
  namespace: "find",
  state,
  reducers: {
    setStore
  },
  effects: {
    *effectsDemo(_, { call, put }) {
      const { status, data } = yield call(db.demo, {});
      if (status === "ok") {
        yield put({
          type: "setStore",
          payload: {
            topData: data
          }
        });
      }
    }
  }
}; 
