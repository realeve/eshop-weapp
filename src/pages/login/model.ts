import * as db from "./service";
import { setStore } from "@/utils/lib";

export interface ILoginModel {
  stateName: string;
  [key:string]: any;
}

const state: ILoginModel = {
  stateName: "这里是全局挂载的数据"
};

export default {
  namespace: "login",
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
