import { IStoreItem } from "@/pages/user/order";
import { axios } from "@/utils/axios";
import { SERVICE } from "@/utils/api";
import Taro from "@tarojs/taro";

import fail from "@/components/Toast/fail";
import success from "@/components/Toast/success";

export interface IServiceItem {
  shop: string;
  shopId: number;
  ordersId: number;
  orderId: number;
  serviceId: number;
  serviceSn: number; //服务编号
  serviceState: number;
  serviceStateName: string; //服务状态

  refundId: number; // 退款主id
  refundType: number; // 退款退货类型（1为退款,2为退货）

  applyTime: string; //申请时间
  goodsState: number;
  goods: {
    goodsId: number;
    title: string;
    url: string;
    price: number;
    num: number;
  }[];
  [key: string]: any;
}

export interface IOrderGoodsList {
  basePrice: number;
  buyNum: number;
  categoryId: number;
  categoryId1: number;
  categoryId2: number;
  categoryId3: number;
  commissionAmount: number;
  commissionRate: number;
  commonId: number;
  complainId: number;
  createTime: any;
  goodsContractVoList: any[];
  goodsFullSpecs: string;
  goodsId: number;
  goodsImage: string;
  goodsName: string;
  goodsPayAmount: number;
  goodsPrice: number;
  goodsSerial: any;
  goodsType: number;
  imageSrc: string;
  joinBigSale: number;
  memberId: number;
  memberName: any;
  ordersGoodsId: number;
  ordersGoodsRefundId: number;
  ordersGoodsRefundState: number;
  ordersGoodsRefundType: number;
  ordersId: number;
  promotionTitle: string;
  refundAmount: any;
  refundId: number;
  refundSn: number;
  refundType: number;
  savePrice: number;
  showRefund: number;
  showRefundInfo: number;
  showViewRefund: number;
  storeId: number;
  storeVIPDiscount: number;
  taxAmount: number;
  taxRate: number;
  unitName: string;
}

export interface IAfterServicesListDB {
  ordersGoodsVoList: IOrderGoodsList[];
  storeInfo: IStoreItem;
  addTime: string;
  adminMessage: any;
  adminState: number;
  adminStateText: string;
  adminTime: any;
  buyerMessage: string;
  commissionRate: number;
  commonId: number;
  couponAmount: number;
  currentStateText: string;
  delayTime: any;
  enableAdminHandle: number;
  enableMemberCancel: number;
  goodsId: number;
  goodsImage: string;
  goodsName: string;
  goodsNum: number;
  goodsState: number;
  imageSrc: string;
  maxDayRefundConfirm: number;
  maxDayReturnAutoCancel: number;
  maxDayReturnAutoReceive: number;
  memberId: number;
  memberName: string;
  orderGoodsType: number;
  orderLock: number;
  ordersGoodsId: number;
  ordersId: number;
  ordersSn: number;
  ordersSnStr: string;
  ordersType: number;
  picJson: string;
  reasonId: number;
  reasonInfo: string;
  receiveMessage: any;
  receiveTime: any;
  refundAmount: number;
  refundCommissionAmount: number;
  refundDetailVo: any;
  refundId: number;
  refundMemberCancel: number;
  refundSn: number;
  refundSnStr: string;
  refundSource: number;
  refundSourceText: string;
  refundState: number;
  refundStateText: string;
  refundStateTextForSelf: string;
  refundType: number;
  resetHandleForSeller: number;
  returnMemberAutoCancel: number;
  returnSellerAutoReceive: number;
  returnType: number;
  sellerMessage: any;
  sellerState: number;
  sellerStateText: string;
  sellerStateTextForSelf: string;
  sellerTime: any;
  shipId: number;
  shipSn: any;
  shipTime: any;
  showAdminReturnHandle: number;
  showMemberReturnDelay: number;
  showMemberReturnShip: number;
  showStoreHandel: number;
  showStoreReturnReceive: number;
  showStoreReturnUnreceived: number;
  storeId: number;
  storeName: string;
}

/**
 * 退款信息——卖家处理状态
 * @field notHandle 待审核
 * @field agree 同意
 * @field notAgree 不同意
 */
export enum ERefundStatus {
  notHandle = 1,
  agree,
  notAgree
}

/**
 * 买家退货——物流状态
 * @field wait 待发货
 * @field sending为待收货
 * @field notReceive为未收到
 * @field received为已收货)
 */
export enum EGoodsState {
  wait = 1,
  sending,
  notReceive,
  received
}

/**
 * 退货类型 (1为不用退货,2为需要退货)
 * @field needReturn    需要退货
 * @field notNeedReturn 不用退货
 */
export enum EReturnStatus {
  notNeedReturn = 1,
  needReturn = 2
}

// 退款退货类型（1为退款,2为退货）
export const refundTypeList = ["", "退款", "退货退款"];

export const getServicesStatus: (
  seller: ERefundStatus,
  customer: EGoodsState
) => string = (seller: ERefundStatus, customer: EGoodsState) => {
  if (seller === ERefundStatus.notHandle) {
    return "商家申请处理中";
  } else if (seller === ERefundStatus.agree) {
    if (customer === EGoodsState.wait) {
      return "填写发货单";
    } else if (customer === EGoodsState.sending) {
      return "商家确认收货中";
    } else if (customer === EGoodsState.received) {
      return "商家已收货";
    } else if (customer === EGoodsState.notReceive) {
      return "商家拒收";
    } else {
      return "买家已退货，收货状态未知";
    }
  }
  return "退货退款失败";
};

export const getOperationStatus: (
  seller: ERefundStatus,
  customer: EGoodsState
) => string = (seller: ERefundStatus, customer: EGoodsState) => {
  if (seller === ERefundStatus.notHandle) {
    return "cancel";
  } else if (seller === ERefundStatus.agree) {
    if (customer === EGoodsState.wait) {
      return "wait";
    }
  }
  return "detail";
};

type TReturnStatus = "processing" | "success" | "fail" | "returnGoods";
export interface IReturnStep {
  desc: string[];
  step: number;
  status: TReturnStatus;
}
/**
 * 获取退货详情进度、状态、描述文字
 * @param returnType 退款退货类型（1为退款,2为退货）
 * @param seller 卖家处理状态 (1为待审核,2为同意,3为不同意)
 * @param customer 买家物流状态(1为待发货,2为待收货,3为未收到,4为已收货)
 *
 * @return step 第几步
 * @return desc 描述数组
 * @return status 交易状态
 */
export const getReturnStep: (
  returnType: EReturnStatus,
  seller: ERefundStatus,
  customer: EGoodsState
) => IReturnStep = (returnType, seller, customer) => {
  let returnData = ["买家申请退款", "商家处理退款申请", "商家同意，退款成功"];

  let step = 1;
  let desc: string[] = [];
  let status: TReturnStatus = "processing";

  // 只退款，不退货；
  if (returnType === EReturnStatus.notNeedReturn) {
    switch (seller) {
      case ERefundStatus.notHandle:
        desc = returnData;
        // 买家已申请，卖家未处理
        step = 1; // 返回至第2步，买家申请退款后，商家处理中;
        break;
      case ERefundStatus.agree:
        desc = returnData;
        // 买家已申请，卖家未处理
        step = 2; // 返回至第3步，商家处理结果展示
        status = "success";
        break;
      case ERefundStatus.notAgree:
      default:
        desc = ["买家申请退款", "商家处理退款申请", "商家不同意，退款失败"];
        step = 2;
        status = "fail";
        break;
    }
    return { step, desc, status };
  }

  // 退货退款，需经历2个流程
  let returnGoodData = [
    "买家申请退款",
    "商家处理退款申请",
    "买家退货给商家",
    "商家确定收货,退款成功"
  ];
  switch (seller) {
    case ERefundStatus.notHandle:
      desc = returnGoodData;
      // 买家已申请，卖家未处理
      step = 1; // 返回至第2步，买家申请退款后，商家处理中;
      break;
    case ERefundStatus.agree:
      desc = returnGoodData;
      // 买家已申请，卖家未处理
      step = 1; // 返回至第3步，商家处理结果展示
      status = "success";

      // 处理买家发货状态
      switch (customer) {
        case EGoodsState.wait: // 待发货
          step = 1;
          status = "returnGoods"; // 用户需要填写订单
          break;
        case EGoodsState.sending: // 待收货
          step = 2;
          break;
        case EGoodsState.received: //已收货
          step = 3;
          break;
        case EGoodsState.notReceive: //拒收货
        default:
          step = 3;
          desc = [
            "买家申请退款",
            "商家处理退款申请",
            "买家退货给商家",
            "商家拒绝收货,退款失败"
          ];
          status = "fail";
          break;
      }

      break;
    case ERefundStatus.notAgree:
      desc = [
        "买家申请退款",
        "商家不同意，退款失败",
        "买家退货给商家",
        "商家确定收货,退款成功"
      ];
      step = 1;
      status = "fail";
      break;
  }

  return { step, desc, status };
};

export const cancleRefundid = (refundId: number, refundType: number) => {
  axios({
    ...SERVICE[refundType === 1 ? "cancelRefund" : "cancelReturn"],
    data: {
      refundId
    }
  })
    .then(() => {
      success("取消成功");
    })
    .catch(e => {
      fail(e.message);
    });
};

export const cancelRefund = (refundId: number, refundType: number) =>
  Taro.showModal({
    content: `是否取消${refundTypeList[refundType]}申请?`,
    title: "取消申请?",
    cancelText: "取消",
    success: ({ confirm }) => {
      if (!confirm) {
        return;
      }
      cancleRefundid(refundId, refundType);
    }
  });

interface IRefundItemVo {
  addTime: string;
  adminMessage: any;
  adminState: number;
  adminStateText: string;
  adminTime: any;
  buyerMessage: string;
  commissionRate: number;
  commonId: number;
  couponAmount: number;
  currentStateText: string;
  delayTime: any;
  enableAdminHandle: number;
  enableMemberCancel: number;
  goodsId: number;
  goodsImage: string;
  goodsName: string;
  goodsNum: number;
  goodsState: number;
  imageSrc: string;
  maxDayRefundConfirm: number;
  maxDayReturnAutoCancel: number;
  maxDayReturnAutoReceive: number;
  memberId: number;
  memberName: string;
  orderGoodsType: number;
  orderLock: number;
  ordersGoodsId: number;
  ordersGoodsVoList: any[];

  ordersId: number;
  ordersSn: number;
  ordersSnStr: string;
  ordersType: number;
  price?: number;
  picJson: string;
  reasonId: number;
  reasonInfo: string;
  receiveMessage: any;
  receiveTime: any;
  refundAmount: number;

  refundCommissionAmount: number;
  refundDetailVo: any;
  refundId: number;
  refundMemberCancel: number;
  refundSn: number;
  refundSnStr: string;
  refundSource: number;
  refundSourceText: string;
  refundState: number;
  refundStateText: string;
  refundStateTextForSelf: string;
  refundType: number;
  resetHandleForSeller: number;
  returnMemberAutoCancel: number;
  returnSellerAutoReceive: number;

  returnType: number;
  sellerMessage: any;
  sellerState: number;
  sellerStateText: string;
  sellerStateTextForSelf: string;
  sellerTime: any;
  shipId: number;
  shipSn: any;
  shipTime: any;
  showAdminReturnHandle: number;

  showMemberReturnDelay: number;
  showMemberReturnShip: number;
  showStoreHandel: number;
  showStoreReturnReceive: number;
  showStoreReturnUnreceived: number;
  storeId: number;
  storeInfo: any;
  storeName: string;
}
export interface IRefundDetailDB {
  refundItemVo: IRefundItemVo;
  uploadRoot: string;
  refundDetailVo: any;
}
