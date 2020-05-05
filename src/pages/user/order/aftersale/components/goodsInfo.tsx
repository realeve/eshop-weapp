export type IPropState =
  | "processing"
  | "returnGoods"
  | "confirm"
  | "fail"
  | "success";

export interface IPropGoodItem {
  order_id: number;
  orderSn: number;
  shop_name: string;
  shopId: number;
  ordersGoodsVoList: any[];
  refundId: number;
  refundType: number;

  title: string;
  imageSrc: string;
  type: string;

  state: number; // 商品退货在途状态
  sellerState: number; // 卖家处理状态

  sellerTime: string;

  price: number;
  refundAmount: number;
  refundSn: number;

  number: number;

  // express: number;
  reimburse_reason: string;
  reimburse_type: number;
  returnType: number;
  reimburse_explain: string;
}

export const typeText = ["退款退货", "退款"];
export interface IPropGoodData {
  data: IPropGoodItem;
  [key: string]: any;
}

export interface IPropImgInfo {
  id: number;
  img: string;
  title: string;
  price: number;
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
