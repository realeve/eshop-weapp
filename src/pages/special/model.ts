import { setStore } from "@/utils/lib";

export interface ICartModel {
  special: any;
  [key: string]: any;
}

const state: ICartModel = {
  special: null
};

export default {
  namespace: "special",
  state,
  reducers: {
    setStore
  }
};
