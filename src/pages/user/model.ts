import * as db from "./service";
import { setStore } from "@/utils/lib";

export interface IUserModel {
  stateName: string;
  [key:string]: any;
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
