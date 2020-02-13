import * as R from "ramda";
import { Dispatch } from "redux";

export const DENY_CODE: {
  [key: number]: string;
} = {
  0: "未登录",
  1: "未实名认证",
  2: "申购中",
  3: "已申购",
  4: "申购未开始",
  5: "申购已结束，请下次再来",
  6: "其他批次中过签",
  9999: "没有权限"
};

/**
 * 禁入编码：0，1
 */
export const FORBIDDEN_CODE = [0, 1, 6, 9999];

/**
 * 等待抽签状态清单：20，30
 */
export const DRAW_STATE = [10, 20, 30];

/**
 * 抽签后状态清单：40，50，100
 */
export const DRAWED_STATE = [40, 50, 100];

/**
 * 预约活动的阶段：未开始，预约，抽签，购买，结束
 * 不包括状态9999的中止
 */
export const SUBSCRIBE_PHASE = [
  [0, 9999],
  [1, 10],
  [30, 40],
  [50],
  [50, 60, 70, 100, 20, -1]
];

//活动状态：0:未发布; 1:已发布; 10:申购中; 20:申购结束;  30:抽签中; 40:抽签结束; 50:订单创建结束; 60:付款结束; 70:发货结束; 100:结束; -1:中止;
export const SUBSCRIBE_STATE: {
  [key: number]: string;
} = {
  0: "未发布",
  1: "已发布",
  10: "申购中",
  20: "申购结束",
  30: "抽签中",
  40: "抽签结束",
  50: "活动结束",
  100: "结束",
  9999: "中止"
};

export type TOrderState =
  | "signed"
  | "unsigned"
  | "lucky"
  | "unlucky"
  | "payed"
  | "lost"
  | "other";

export interface ISubscribe {
  activityId: number;
  allowSubscribe: boolean;
  autoStartEnd: number;
  beginTime: string;
  commonId: number;
  computeRuleUrl: string;
  contentUrl: string;
  createBy: string;
  createDate: string;
  denyCode: number;
  denyDesc: string;
  drawTime: string;
  endTime: string;
  goodsName: string;
  goodsId: number;
  goodsPrice: number;
  id: number;
  isDel: number;
  isExpired: number;
  isPay: number;
  isWin: number;
  issueQuantity: number;
  modifyBy: string;
  modifyDate: string;
  orderId: number;
  orderSn: string;
  payExpireTime: string;
  payId: number;
  payQuantity: number;
  phone: string;
  remainSubscribeTime: number;
  remainBeginTime: number;
  remainDrawTime: number;
  sendQuantity: number;
  state: number;
  strBeginTime: string;
  strEndTime: string;
  strPayExpireTime: string;
  subscribeQuantity: number;
  subscribeState: number;
  subscribeStateStr: string;
  subscribeTime: number;
  subscriberSn: string;
  status?: number;
  web: { banner: string; detailImgList: string[]; imgList: string[] };
  mainImage1: string;
  mainImage2: string;
  mainImage3: string;
  detailImage1: string;
  detailImage1_1: string;
  detailImage2: string;
  detailImage2_1: string;
  detailImage3: string;
  detailImage3_1: string;
  detailImage4: string;
  detailImage4_1: string;
  imgList: {
    title: string;
    detail: string[];
  }[];
  thumbList: string[];
}

/**
 * @exports 处理特品接口数据，将原接口中为-1的denyCode和state设置为9999，方便enum DENY_CODE 和 SUBSCRIBE_STATE 的调用
 *
 * @param {data}
 * @returns {ISubscribe}
 */
export const handleSubscribe: (
  data: {
    specialtyProductSubscriberVO: ISubscribe;
  },
  dispatch: Dispatch
) => ISubscribe = ({ specialtyProductSubscriberVO: sp }, dispatch) => {
  if (!sp) {
    return sp;
  }
  sp.denyCode = sp.denyCode < 0 ? 9999 : sp.denyCode;
  sp.state = sp.state < 0 ? 9999 : sp.state;

  let imgList = [
    {
      title: "文化历史",
      detail: [sp.detailImage1, sp.detailImage1_1]
    },
    {
      title: "工艺技术",
      detail: [sp.detailImage2, sp.detailImage2_2]
    },
    {
      title: "商品信息",
      detail: [sp.detailImage3, sp.detailImage3_3]
    },
    {
      title: "尺寸参数",
      detail: [sp.detailImage4, sp.detailImage4_4]
    }
  ].map(item => {
    item.detail = item.detail.filter(img => img);
    return item;
  });
  let thumbList = [sp.mainImage1, sp.mainImage2, sp.mainImage3];
  sp = { ...sp, imgList, thumbList };
  let special = R.pick(
    [
      "activityId",
      "beginTime",
      "denyCode",
      "denyDesc",
      "goodsPrice",
      "imgList",
      "thumbList",
      "isExpired",
      "isPay",
      "isWin",
      "payExpireTime",
      "payId",
      "state",
      "subscribeState",
      "subscribeStateStr",
      "subscribeTime"
    ],
    sp
  );
  dispatch({
    type: "special/setStore",
    payload: {
      special
    }
  });
  return { ...special, imgList, thumbList };
};
