import { setStore } from "@/utils/lib";

export interface IOrderModel {
  stateName: string;
  [key: string]: any;
}

const state: IOrderModel = {
  stateName: "这里是全局挂载的数据"
};

export default {
  namespace: "order",
  state,
  reducers: {
    setStore
  }
};
