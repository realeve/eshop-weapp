import { setStore } from "@/utils/lib";
import { IModPanelItem } from "../user/address";

export interface IOrderModel {
  currentAddress: IModPanelItem | {};
  [key: string]: any;
}

const state: IOrderModel = {
  currentAddress: {},
};

export default {
  namespace: "order",
  state,
  reducers: {
    setStore,
  },
};
