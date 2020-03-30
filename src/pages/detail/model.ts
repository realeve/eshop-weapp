import { setStore } from "@/utils/lib";

export interface IDetailModel {
  stateName: string;
  [key: string]: any;
}

const state: IDetailModel = {
  stateName: "这里是全局挂载的数据"
};

export default {
  namespace: "detail",
  state,
  reducers: {
    setStore
  }
};
