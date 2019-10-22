import { setStore } from "@/utils/lib";

export interface ICartModel {
  imgList: {
    title: string;
    detail: string[];
  }[];
  [key: string]: any;
}

const state: ICartModel = {
  imgList: []
};

export default {
  namespace: "special",
  state,
  reducers: {
    setStore
  }
};
