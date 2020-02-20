import { axios } from "@/utils/axios";
import { ORDER, API } from "@/utils/api";
import { CLIENT_TYPE } from "@/utils/setting";
import success from "@/components/Toast/success";

export const orderStateList: {
  name: string;
  key: string;
  id: number;
}[] = [
  {
    name: "全部订单",
    key: "all", // 不传时显示全部订单
    id: 0
  },
  {
    name: "待付款",
    key: "new",
    id: 1
  },
  {
    name: "待发货",
    key: "pay",
    id: 2
  },
  {
    name: "待收货",
    key: "send",
    id: 3
  },
  {
    name: "待评价",
    key: "noeval",
    id: 4
  },
  // {
  //   name: '已完成',
  //   key: 'finish'
  //   ,id:5
  // },
  {
    name: "已取消",
    key: "cancel",
    id: 6
  }
];

/*
 real-实物订单，
 virtual-虚拟订单
 chain-门店订单
 foreign-海外购订单
 groups-拼团
 book-预定
 cut砍价 
*/

export enum EOrderTypes {
  real = "real",
  virtual = "virtual",
  chain = "chain",
  foreign = "foreign",
  groups = "groups",
  book = "book",
  cut = "cut"
}

export const buyAgain = (ordersId: number | string, callback?: () => void) =>
  axios({
    ...(ORDER.buyAgain as {}),
    params: {
      ordersId,
      clientType: CLIENT_TYPE.web
    }
  }).then(() => {
    success("下单成功");
    callback && callback();
  });

export const deleteOrder = (ordersId: number | string, callback?: () => void) =>
  axios({
    ...(ORDER.delete as {}),
    params: {
      ordersId,
      clientType: CLIENT_TYPE.web
    }
  }).then(() => {
    success("删除成功");
    callback && callback();
  });

export const isOrderPaid: (payId: string) => Promise<any> = payId =>
  axios({
    ...(API.BUY_ISPAIED as {}),
    data: {
      payId,
      clientType: CLIENT_TYPE.web
    }
  });

export const removeBrowse = (borwseId: number | string) => {
  return axios({
    //TODO：暂无此接口
    ...(API.GOODS_BROWSE_CLEAR as {}),
    data: { borwseId, clientType: CLIENT_TYPE.web }
  });
};

export const removeBrowseAll = () => {
  return axios({
    ...(API.GOODS_BROWSE_CLEARALL as {}),
    data: { clientType: CLIENT_TYPE.web }
  });
};
