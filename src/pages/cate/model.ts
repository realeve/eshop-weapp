import * as db from "./service";
import { setStore } from "@/utils/lib";

export interface ICateModel {
  stateName: string;
}

const state: ICateModel = {
  stateName: "这里是全局挂载的数据"
};

export default {
  namespace: "cate",
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
