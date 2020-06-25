import { axios } from "@/utils/axios";
import { ORDER, API } from "@/utils/api";
import { CLIENT_TYPE } from "@/utils/setting";
import success from "@/components/Toast/success";
import fail from "@/components/Toast/fail";
import * as R from "ramda";
import { jump } from "@/utils/lib";
import { updateShoppingCart } from "@/utils/cartDb";
import { getWebpSuffix } from "@/services/common";

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

/**
*  @params closed   已取消 
   @params needPay  待付款
   @params payed    待发货
   @params sending  待收货
   @params complete 交易成功，待评价
   @params commented 已评价
   @params appendCommented 已追评
 */
export enum EOrderStatus {
  closed = 0, // 已取消
  needPay = 10, // 待付款
  payed = 20,
  sending = 30,
  complete = 40,
  commented = 40 + 1, // 状态为40，评价标志为1，两者相加
  appendCommented = 40 + 1 + 1, // 已追评
  over = 50 // 已完结
}

export const getStatusByName: (name: string) => number = (name: string) => {
  let res = 0;
  switch (name) {
    case "待付款":
      res = EOrderStatus.needPay;
      break;
    case "待发货":
      res = EOrderStatus.payed;
      break;
    case "待收货":
      res = EOrderStatus.sending;
      break;
    case "待评价":
      res = EOrderStatus.complete;
      break;
    case "已评价":
      res = EOrderStatus.commented;
      break;
    case "已追评":
      res = EOrderStatus.appendCommented;
      break;
    case "已取消":
      res = EOrderStatus.closed;
      break;
    default:
    case "全部订单":
      res = -1;
      break;
  }
  return res;
};

export const getNameByStatus: (status: number) => string = status => {
  let res = "";

  switch (Number(status)) {
    case EOrderStatus.needPay:
      res = "待付款";
      break;
    case EOrderStatus.payed:
      res = "待发货";
      break;
    case EOrderStatus.sending:
      res = "待收货";
      break;
    case EOrderStatus.complete:
    case EOrderStatus.commented:
    case EOrderStatus.appendCommented:
      res = "交易成功";
      break;
    case EOrderStatus.closed:
    default:
      res = "交易关闭";
      break;
  }
  return res;
};

// 订单状态
export const orderStatus = getNameByStatus;

export let convertOrderData = (data: IOrderItem[] | null) => {
  if (R.isNil(data)) {
    return [];
  }
  let res = data.map(orderItem =>
    orderItem.ordersVoList.map(item => ({
      payId: item.payId,
      shop: item.storeName,
      shopId: item.storeId,
      orderId: item.ordersId,
      orderSN: item.ordersSn,
      orderTime: item.createTime,
      autoCancelTime: item.autoCancelTime, // 自动取消时间
      autoReceiveTime: item.autoReceiveTime, // 自动收货时间
      ordersRefundState: item.ordersRefundState, // 退款状态

      payAmount: orderItem.ordersOnlineDiffAmount, // 订单还须在线支付金额金额(扣除已经使用站内余额支付的部分)，当该金额>0时，出现支付按钮

      isVirtual: item.isVirtual, // 虚拟商品

      shipSn: item.shipSn,
      shipCode: item.shipCode,

      // 发货时间
      sendTime: item.sendTime,

      type: item.paymentClientType, // 支付方式 'WEB'
      price: item.ordersAmount,
      express: item.freightAmount,

      // 此处服务端返回数据中已完成订单，无论是否评价，状态均为40，此处处理当已完成时需加上评价状态evaluationState，1为已评价
      // 如果已追评,evaluationAppendState显示为1，需再次做区分
      status:
        item.ordersState != EOrderStatus.complete
          ? item.ordersState
          : item.ordersState +
            item.evaluationState +
            item.evaluationAppendState,

      statusName: item.ordersStateName,

      invoice: {
        // TODO 接口暂无数据
      },
      goods: item.ordersGoodsVoList.map(voList => ({
        spuid: voList.commonId,
        goodsId: voList.goodsId,
        ordersGoodsId: voList.ordersGoodsId,
        title: voList.goodsName,
        url: voList.imageSrc + getWebpSuffix(),
        type: voList.goodsFullSpecs,
        price: voList.goodsPrice,
        count: voList.buyNum
      })),
      address: {
        name: item.receiverName,
        phone: item.receiverPhone,
        detail: item.receiverAreaInfo,
        address: item.receiverAddress
      }
    }))
  );
  return R.flatten(res);
};

export interface IOrderItem {
  isChain: number;
  isGroup: number;
  isVirtual: number;
  ordersOnlineDiffAmount: number;
  ordersVoList: IOrdersVoList[];
  payId: number;
  paySn: number;
}

interface IOrdersVoList {
  ordersGoodsVoList: IOrdersGoodsVoList[];
  autoCancelSecond: number;
  autoCancelTime: string;
  autoCancelTimeRemain: number;
  autoReceiveTime: any;
  autoReceiveTimeRemain: number;
  chainId: number;
  chainName: string;
  chainOrdersType: number;
  createTime: string;
  delayReceiveState: number;
  deleteState: number;
  evaluationAppendState: number;
  evaluationState: number;
  evaluationTime: any;
  finishTime: any;
  freightAmount: number;
  goId: number;
  goState: number;
  goodsName: string;
  groupId: number;
  groupNeedNum: number;
  groupRemainNum: number;
  imIsOnline: number;
  isShowRefundOrdersList: number;
  isVirtual: number;
  lockState: number;
  memberId: number;
  memberName: string;
  ordersAmount: number;
  ordersBookList: any[];
  ordersGiftVoList: any[];
  ordersId: number;
  ordersRefundId: number;
  ordersRefundState: number;
  ordersRefundType: number;
  ordersSn: number;
  ordersState: number;
  ordersStateName: string;
  ordersType: number;
  ordersTypeName: string;
  ordersTypeTag: number;
  payId: number;
  paymentClientType: string;
  paymentCode: string;

  paymentName: string;
  paymentTime: any;
  paymentTypeCode: string;
  predepositAmount: number;
  receiverAddress: string;
  receiverAreaInfo: string;
  receiverMessage: string;
  receiverName: string;

  receiverPhone: string;
  receiverPhoneEncrypt: string;
  refundAmount: any;
  refundItemVo: any;
  refundState: number;
  searchOrdersState: number;
  sellerId: number;
  sellerName: string;

  sendTime: string;

  shipCode: string;
  shipName: string;
  shipSn: string;
  shipUrl: any;
  showAutoCancelSecond: number;
  showEvaluation: number;
  showEvaluationAppend: number;
  showMemberApplyForSale: number;
  showMemberBuyAgain: number;
  showMemberCancel: number;
  showMemberComplain: number;
  showMemberDelayReceive: number;
  showMemberDelete: number;
  showMemberPay: number;
  showMemberReceive: number;
  showMemberRecoveryDelete: number;
  showMemberRefundAll: number;
  showMemberVirtualRefund: number;
  showMemberVirtualRefundWaiting: number;
  showRefundWaiting: number;
  showShipSearch: number;
  showViewRefundAll: number;
  storeAddress: any;
  storeId: number;
  storeName: string;
  storePhone: any;
}

interface IOrdersGoodsVoList {
  allowVirtualRefund: number;
  buyNum: number;
  commonId: number;
  complainId: number;
  goodsContractVoList: any[];
  goodsFullSpecs: string;
  goodsId: number;
  goodsImage: string;
  goodsName: string;
  goodsPayAmount: number;
  goodsPrice: number;
  goodsServicesList: any[];
  imageSrc: string;
  isExistLock: number;
  ordersGoodsId: number;
  ordersGoodsRefundId: number;
  ordersGoodsRefundState: number;
  ordersGoodsRefundType: number;
  ordersId: number;
  promotionTitle: string;
  refundAmount: number;
  refundId: number;
  refundSn: number;
  refundType: number;
  showMemberComplain: number;
  showRefund: number;
  showRefundInfo: number;
  showViewRefund: number;
  showViewReturn: number;
  tagTitle: string;
  unitName: string;
  virtualOrdersGoodsCodeList: any[];
  virtualRefundApplyed: number;
}

export enum EServiceStatus {
  processing, //商家处理中
  write, //填写发货单
  confirm, //商家确认收获中
  returnedFail, //退货退款失败
  returnedSuccess, //退货退款成功
  refundFail, //退款失败
  refundSuccess //退款成功
}

export const getStatusName: (name: string) => number = (name: string) => {
  let res = 0;
  switch (name) {
    case "退货退款":
      res = EServiceStatus.processing;
      break;
    case "退款":
      res = EServiceStatus.write;
      break;
    default:
    case "全部售后":
      res = -1;
      break;
  }
  return res;
};

export const getNameStatus: (status: number) => string = status => {
  let res = "";
  switch (Number(status)) {
    case EServiceStatus.processing:
      res = "取消申请";
      break;
    case EServiceStatus.write:
      res = "填写发货单";
      break;
    case EServiceStatus.confirm:
      res = "服务详情";
      break;
    case EServiceStatus.returnedFail:
      res = "服务详情";
      break;
    case EServiceStatus.returnedSuccess:
      res = "服务详情";
      break;
    case EServiceStatus.refundFail:
      res = "服务详情";
      break;
    case EServiceStatus.refundSuccess:
      res = "服务详情";
      break;
    default:
      res = "已关闭";
      break;
  }
  return res;
};

export const serviceStatus = [
  "商家申请处理中",
  "填写发货单",
  "商家确认收货中",
  "退货退款失败",
  "退货退款成功",
  "退款失败",
  "退款成功"
];

// 取消订单
export let cancelOrder = (ordersId: number | string, callback: () => void) =>
  axios({
    ...ORDER.cancel,
    data: {
      ordersId
    }
  })
    .then(() => {
      success("成功取消");
      callback && callback();
    })
    .catch(error => {
      fail(error.description);
    });

export const addOrderAgain = (
  goodsList: { goodsId: number; count: number }[]
) => {
  let goods = goodsList.map(item => ({
    id: item.goodsId,
    num: item.count,
    type: "cart"
  }));
  updateShoppingCart(goods);
  jump("/pages/order/confirm/index");
};

export const receiveOrder = (ordersId, onRefresh) => {
  axios({
    ...ORDER.receive,
    data: {
      ordersId
    }
  })
    .then(_ => {
      success("收货成功");
      onRefresh && onRefresh();
    })
    .catch(_ => {
      fail("收货失败");
    });
};
