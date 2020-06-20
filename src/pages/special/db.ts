import { initShare } from "./../../utils/weixin";
import * as R from "ramda";
import { Dispatch } from "redux";
import { axios } from "@/utils/axios";
import { API } from "@/utils/setting";
import * as lib from "@/utils/lib";
import { getWebp } from "@/services/common";
import * as wx from "@/utils/weixin";

export const DENY_CODE: {
  [key: number]: string;
} = {
  0: "未登录",
  1: "未实名认证",
  2: "申购中",
  3: "您已申购",
  4: "申购未开始",
  5: "申购已结束，请下次再来",
  6: "其他批次中过签",
  9999: "没有权限"
};

export type TOrderState =
  | "signed"
  | "unsigned"
  | "lucky"
  | "unlucky"
  | "payed"
  | "lost"
  | "other";

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

export enum SUBSCRIBE_STATUS {
  NOT_START,
  SUBSCRIBING,
  LOTTERY,
  NEED_PAY,
  END
}
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

export const getTimeDescByScribe = (scribe: ISubscribe | null) => {
  if (!scribe) {
    return false;
  }

  let now = lib.now();

  // if (now > scribe.drawTime) {
  //   return false;
  // }
  // return {
  //   title: '公布摇号',
  //   time: scribe.drawTime,
  // };

  // 超过支付时间，活动结束
  if (now > scribe.payExpireTime) {
    return false;
  }

  if (now > scribe.drawTime) {
    return {
      title: "支付截止",
      time: scribe.payExpireTime
    };
  }

  if (now > scribe.endTime) {
    return {
      title: "公布摇号",
      time: scribe.drawTime
    };
  }

  if (now > scribe.beginTime) {
    return {
      title: "预约结束",
      time: scribe.endTime
    };
  }

  if (now < scribe.beginTime) {
    return {
      title: "预约开始",
      time: scribe.beginTime
    };
  }
};

export const getPhase = subscribe =>
  SUBSCRIBE_PHASE.findIndex(p => p.includes(subscribe ? subscribe.state : 0));

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
  console.log(sp);
  if (!sp) {
    return sp;
  }
  sp.denyCode = sp.denyCode < 0 ? 9999 : sp.denyCode;
  sp.state = sp.state < 0 ? 9999 : sp.state;
  sp.isWin = sp.state <= 20 ? 0 : sp.isWin;

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
    item.detail = item.detail.filter(img => img).map(item => getWebp(item));
    return item;
  });
  let thumbList = [sp.mainImage1, sp.mainImage2, sp.mainImage3].map(item =>
    getWebp(item)
  );
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
      "subscribeTime",
      "subscriberSn",
      "drawTime",
      "endTime",
      "phone",
      "subscribeQuantity",
      "commonId",
      "remainDrawTime",
      "issueQuantity"
    ],
    sp
  );
  dispatch({
    type: "special/setStore",
    payload: {
      special
    }
  });

  // 微信分享
  wx.initShare({
    title: special.goodsName,
    subTitle: special.goodsName + "正在火热预约中，点击查看详情",
    img: special.mainImage1
  });
  return { ...special, imgList, thumbList };
};

export const doSubscribe = async (id: number): Promise<ISubscribe> =>
  await axios({
    method: "put",
    url: `${API.SUBSCRIBE}/${id}`
  });

export const getMySubscribeOrder = async (orderid: number) =>
  await axios({
    ...(API.MY_SUBSCRIBE_ORDER as {})
  });

export interface IGoodsCommon {
  imageName: string;
  imageSrc: string;
  jingle: string;
  specJson: string;
  stateRemark: string;
  storeId: number;
  unitName: string;
  updateTime: string;
  web: number;
  webPrice0: number;
  webUsable: number;
}

export interface IGoods {
  colorId: number;
  goodsCommon: IGoodsCommon;
  goodsFullSpecs: string;
  goodsPrice0: number;
  goodsStorage: number;
  imageName: string;
  imageSrc: string;
  web: number;
  webPrice0: number;
  webUsable: number;
}

export interface ISpecialtyBatch {
  activityId: number;
  autoStartEnd: number;
  beginTime: string;
  drawTime: string;
  endTime: string;
  goodsPrice: number;
  id: number;
  isDel: number;
  issueQuantity: number;
  payExpireTime: string;
  payQuantity: number;
  phone: string;
  sendQuantity: number;
  state: number;
  subscribeQuantity: number;
}

export interface IMySubscribe {
  activityId: number;
  batchId: number;
  commonId: number;
  computeId: number | null;
  createDate: number;
  goods: IGoods;
  goodsId: number;
  id: number;
  isDel: number;
  isExpired: number | null;
  isPay: number | null;
  isWin: number;
  orderId: number;
  orderSn: number;
  payId: number;
  payTime: number;
  specialtyBatch: ISpecialtyBatch;
  subscribeState: number;
  subscribeStateStr: string;
  subscribeTime: number;
  subscriberId: number;
  subscriberSn: number;
}

/**
 *
 * @param params {page,pageSize,subscribeState}
 */
export const getMySubscribe: (
  param: any
) => Promise<IMySubscribe[]> = async params =>
  await axios({
    ...(API.MY_SUBSCRIBE as {}),
    params
  });

/**
 *
 * @param data {orderId,addressId}
 */
export const updateSubscribeAddress = async (data: any) =>
  await axios({
    ...(API.UPDATE_SPECIAL_ADDRESS as {}),
    data
  }).catch(error => error);

export interface ICompute {
  activityId: number;
  baseNumber: number;
  batchId: number;
  createBy: null;
  createDate: number;
  id: number;
  isDel: number;
  issueQuantity: number;
  luckyNumbers: null;
  reverseBaseNumber: number;
  seed: null;
  shenZhenIndicator: number;
  smallMediumIndicator: number;
  step: null;
  subscribeTotal: number;
}

export const getSubscribeCompute: (
  id: number
) => Promise<ICompute> = async id =>
  await axios({
    url: `${(API.SP_SUBSCRIBER_COMPUTE as { url: string }).url}/${id}`
  }).then((d: { compute: ICompute }) => d.compute);
