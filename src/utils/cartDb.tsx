import { axios } from "@/utils/axios";
import { API, CLIENT_TYPE, LocalStorageKeys, PAYMENT } from "@/utils/setting";
import {
  IShoppingCart,
  ICartStoreVoList,
  ICartSpuVoList,
  ICartItems,
  ICartItemsResponse,
  ShoppingCartItem,
  ICartItem,
  ICartItemVoList,
  IShoppingCartItem,
  ICartDetail,
  TCartType,
  ILocalStorageCartDetail,
  IShopInfo,
  IShoppingCartCount
} from "./cart";
import * as R from "ramda";
import * as lib from "@/utils/lib";
import { Dispatch } from "redux";
import Taro from "@tarojs/taro";

import fail from "@/components/Toast/fail";
import success from "@/components/Toast/success";

export interface IBuyGoodsItemVoList {
  allowSend: number;
  appPrice0: number;
  appPrice1: number;
  appPrice2: number;
  appUsable: number;
  bargainOpenId: number;
  basePrice: number;
  batchNum0: number;
  batchNum0End: number;
  batchNum1: number;
  batchNum1End: number;
  batchNum2: number;
  batchNumState: number;
  book: any;
  bundlingId: number;
  buyNum: number;
  cartId: number;
  categoryId: number;
  categoryId1: number;
  categoryId2: number;
  categoryId3: number;
  chainId: number;
  chainName: string;
  commonId: number;
  contractItem1: number;
  contractItem10: number;
  contractItem2: number;
  contractItem3: number;
  contractItem4: number;
  contractItem5: number;
  contractItem6: number;
  contractItem7: number;
  contractItem8: number;
  contractItem9: number;
  couponAmount: number;
  distributionOrders: {
    addTime: string;
    commissionRate: number;
    commonId: number;
    distributionOrdersId: number;
    distributionOrdersType: number;
    distributionStorePay: number;
    distributionStorePayTime: string;
    distributorId: number;
    finishTime: string;
    memberId: number;
    ordersFinishTime: string;
    ordersGoodsId: number;
    storeId: number;
  };
  downAmount: number;
  finalAmount: number;
  foreignTaxAmount: number;
  foreignTaxRate: number;
  freightTemplateId: number;
  freightVolume: number;
  freightWeight: number;
  giftVoList: [];
  goodsContractVoList: [];
  goodsFreight: number;
  goodsFullSpecs: string;
  goodsId: number;
  goodsModal: number;
  goodsName: string;
  goodsPrice: number;
  goodsPrice0: number;
  goodsPrice1: number;
  goodsPrice2: number;
  goodsSerial: number | any;
  goodsStatus: number;
  goodsStorage: number;
  groupPrice: number;
  imageName: string;
  imageSrc: string;
  isForeign: number;
  isGift: number;
  isLevelMarketing: number;
  isOwnShop: number;
  isSecKill: number;
  isStoreVIPDiscount: number;
  itemAmount: number;
  joinBigSale: number;
  limitAmount: number;
  payAmount: number;
  pointsMoneyAmount: number;
  promotionBeginTime: string;
  promotionEndTime: string;
  promotionId: number;
  promotionTitle: string;
  promotionType: number;
  promotionTypeText: string;
  savePrice: number;
  seckillGoodsId: number;
  shopCommitmentAmount: number;
  shopCommitmentRate: number;
  spuBuyNum: number;
  spuImageSrc: string;
  storageStatus: number;
  storeId: string;
  storeName: string;
  storeVIPDiscount: number;
  trysApplyId: number;
  trysPostUseState: number;
  trysSendUseState: number;
  unitName: string;
  variableItemAmount: number;
  virtualOverdueRefund: number;
  webPrice0: number;
  webPrice1: number;
  webPrice2: number;
  webUsable: number;
  wechatPrice0: number;
  wechatPrice1: number;
  wechatPrice2: number;
  wechatUsable: number;
}

/**
 *
 * @param data 根据单件商品的Id及数量获取 添加到购物车时所需的 axios 请求参数
 */
export const getShoppingCartParam: (
  data: ICartItem | ICartItem[]
) => ShoppingCartItem = data => ({
  buyData: JSON.stringify(
    R.type(data) === "Array" ? R.clone(data) : [R.clone(data)]
  ),
  bundlingId: 0,
  clientType: CLIENT_TYPE.web,
  timestamp: lib.timestamp()
});

export const cartAdd: (
  items: ICartItems
) => Promise<ICartItemsResponse> = items =>
  axios({
    method: "post",
    url: API.CART_ADD as string,
    data: items
  });

export const cartEdit: ({
  cartId,
  buyNum
}: {
  cartId: string;
  buyNum: number;
}) => Promise<{ success: boolean; num?: number }> = ({ cartId, buyNum }) =>
  axios({
    ...(API.CART_EDIT as {}),
    data: {
      cartId,
      buyNum,
      clientType: CLIENT_TYPE.web
    }
  }).then((res: { goodsStorage?: number; error?: string }) => {
    // console.log(res, 'resress数据信息');
    if (!R.isNil(res.goodsStorage)) {
      return { success: false, num: res.goodsStorage };
    }
    return {
      success: true
    };
  });

export const cartDel: (
  cartId: string[],
  dispatch: Dispatch
) => undefined | Promise<void> = (cartId, dispatch) => {
  if (cartId.length === 0) {
    return;
  }
  return axios({
    ...(API.CART_DEL as {}),
    data: {
      cartId: cartId.join(","),
      clientType: CLIENT_TYPE.web
    }
  }).then(async () => {
    let data = await readShoppingCart();
    refreshShoppingCart(data, dispatch);
  });
};

// 购物车数据转换，用于前台显示
export const convertCartData: (
  data: IShoppingCart
) => IShoppingCartCount = data => {
  // 有效商品
  let res = data.cartStoreVoList.map(handleCartItem);

  let cartData = combineCartData(res);
  return {
    ...cartData,
    type: "online"
  };
};

const readShoppingCart = () =>
  axios({
    ...(API.CART_LIST as {}),
    data: {
      clientType: CLIENT_TYPE.web
    }
  }).then(convertCartData);

// 购物车数据转换
let handleCartItem: (res: ICartStoreVoList) => IShoppingCartItem = res => {
  let detail = R.map((item: ICartSpuVoList) =>
    item.cartItemVoList.map((cartItem: ICartItemVoList) => ({
      spuid: String(cartItem.commonId),
      id: String(cartItem.goodsId),
      name: cartItem.goodsName,

      cartId: cartItem.cartId,

      spec: cartItem.goodsFullSpecs,

      price: cartItem.goodsPrice,
      num: cartItem.buyNum,

      valid: cartItem.goodsStatus == 1,
      storage: cartItem.goodsStorage,
      img: cartItem.imageSrc,
      totalPrice: cartItem.itemAmount,
      unitName: cartItem.unitName
    }))
  )(res.cartSpuVoList);

  return {
    total: {
      num: res.buyNum,
      price: res.cartAmount
    },
    shop: {
      id: res.storeId,
      name: res.storeName
    },

    detail: R.flatten(detail)
  };
};

export const combineCartData = (res: IShoppingCartItem[]) => {
  let num = R.reduce(
    (sum, item: IShoppingCartItem) => sum + item.total.num,
    0
  )(res);
  let price = R.reduce(
    (sum, item: IShoppingCartItem) => sum + item.total.price,
    0
  )(res);

  return {
    total: { num, price },
    data: res
  };
};

export const refreshShoppingCart = (
  data: IShoppingCartCount,
  dispatch: Dispatch
) => {
  dispatch({
    type: "common/setStore",
    payload: {
      shoppingCart: {
        loading: false,
        ...data
      }
    }
  });
};

/**
 * 从localstorage 读取购物车信息,没有时默认为空
 */
export const getShoppingCart: () => ILocalStorageCartDetail[] = () => {
  let res: ILocalStorageCartDetail[] = JSON.parse(
    Taro.getStorageSync(LocalStorageKeys.shoppingCart) || "[]"
  );

  // 需将购买数据转换为数值型，否则做加法运算时会出现 '1'+'2' === '12' 的 bug
  return R.map((item: ILocalStorageCartDetail) => {
    item.num = Number(item.num);
    item.id = String(item.id);
    return item;
  }, res);
};

/**
 * 添加商品至购物车，存储至本地数据
 * @param data 商品基础信息,可以为单件商品 或 商品数组
 */
export const setShoppingCart = async (
  data: ILocalStorageCartDetail | ILocalStorageCartDetail[],
  dispatch: Dispatch
) => {
  // 1.判断是单条数据还是多条数据（数组）
  let res = R.clone(
    lib.getType(data) === "array" ? data : [data]
  ) as ILocalStorageCartDetail[];

  res = res.map(item => {
    let id = String(item.id);
    // 可能还需要添加其它字段
    return {
      ...item,
      id
    };
  });

  // 合并购物车数量
  const combineCartItems: (
    data: ILocalStorageCartDetail[]
  ) => ILocalStorageCartDetail = data => {
    let num = R.reduce(
      (sum, item: ILocalStorageCartDetail) => sum + Number(item.num || 0),
      0
    )(data);
    return { ...data[0], num };
  };

  const calcTotal = (detail: ICartDetail[]) => {
    let num = R.reduce((sum, item: ICartDetail) => sum + item.num, 0)(detail);
    let price = R.reduce(
      (sum, item: ICartDetail) => sum + item.price * item.num,
      0
    )(detail);

    return {
      num,
      price
    };
  };

  const loadLocalStorageToState: (
    data: ILocalStorageCartDetail[]
  ) => IShoppingCartCount = data => {
    let shopData = R.groupBy<ILocalStorageCartDetail>(item => item.shop.name)(
      R.filter((value: ILocalStorageCartDetail) => !R.isNil(value.shop))(data)
    );

    let res: IShoppingCartItem[] = R.values(shopData).map(item => {
      let shop = item[0].shop;
      let detail = item.map(({ shop, ...goodsDetail }) => goodsDetail);
      let total = calcTotal(detail);

      return {
        shop,
        detail,
        total
      };
    });

    let cartData = combineCartData(res);
    return {
      ...cartData,
      type: "offline"
    };
  };

  /**
   * 合并购物车数据
   * @param cart1 新添加数据
   * @param cart2 历史数据
   */
  const combineShoppingData: (
    cart1: ILocalStorageCartDetail[],
    cart2: ILocalStorageCartDetail[]
  ) => ILocalStorageCartDetail[] = (cart1, cart2) => {
    // 合并数据
    let newState = [...cart1, ...cart2];

    // 以 商品spuid 分组
    let spuRes = R.groupBy(R.prop<string>("id"), newState);
    let spuArr = R.values(spuRes);

    // 数据合并，相同购物车数据添加至一起
    let res = spuArr.map(combineCartItems);

    // 需要刷新的id
    let goodsIdNeedRefresh = R.pluck("id")(cart1);

    // 为新增数据更新时间戳
    return res.map((item: ILocalStorageCartDetail) => {
      if (goodsIdNeedRefresh.includes(item.id)) {
        item.timestamp = lib.timestamp();
      }
      return item;
    });
  };

  // 2019-09-30 libin 只在未登录状态下存储数据
  // 存储当前合并结果至本地
  let state: IShoppingCartCount = {};
  if (!lib.isLogin()) {
    // 2.获取历史数据
    let prevState = getShoppingCart();

    // 3.合并购物车数据
    let nextState = combineShoppingData(res, prevState);
    Taro.setStorage({
      key: LocalStorageKeys.shoppingCart,
      data: JSON.stringify(nextState)
    });
    state = loadLocalStorageToState(nextState);
  } else {
    state = await readShoppingCart();
  }

  // let state = loadLocalStorageToState(nextState);
  // // 更新store
  refreshShoppingCart(state, dispatch);
};

export const loadShoppingCart = async (dispatch: Dispatch) => {
  // 载入中
  dispatch({
    type: "setStore",
    payload: {
      shoppingCart: {
        loading: true,
        data: []
      }
    }
  });

  // 载入完毕
  let data = await readShoppingCart();
  dispatch({
    type: "setStore",
    payload: {
      shoppingCart: {
        loading: false,
        ...data
      }
    }
  });
};

// 生成订单号之后清空确认数据
export const clearConfirmCart = (dispatch: Dispatch) => {
  dispatch({
    type: "common/setStore",
    payload: {
      confirmCart: []
    }
  });
};

export const addConfirmCart = (dispatch: Dispatch, confirmCart) => {
  dispatch({
    type: "common/setStore",
    payload: {
      confirmCart
    }
  });
  Taro.setStorageSync(LocalStorageKeys.confirm, JSON.stringify(confirmCart));
};

export const updateShoppingCart = (nextState: any[]) =>
  Taro.setStorageSync(LocalStorageKeys.confirm, JSON.stringify(nextState));

// 立即购买
export const getConfirmCart = () => {
  let str = Taro.getStorageSync(LocalStorageKeys.confirm) || "[]";

  return JSON.parse(str);
};

/**
 * 从localstorage 读取购物车信息,用于下单
 */
export const getShoppingCartAxiosParam: () =>
  | boolean
  | { buyData: string; clientType: string } = () => {
  let res: ILocalStorageCartDetail[] = getConfirmCart();

  if (res.length === 0) {
    return false;
  }

  console.log(res);

  // 需将购买数据转换为数值型，否则做加法运算时会出现 '1'+'2' === '12' 的 bug
  let data = R.map(
    (item: ILocalStorageCartDetail) => ({
      buyNum: item.num,
      goodsId: item.id
    }),
    res
  );

  return {
    buyData: JSON.stringify(data),
    clientType: CLIENT_TYPE.web,
    isCart: 0,
    isExistBundling: 0,
    isGroup: 0
  };
};

export interface IBookingDetail {
  buyData: string;
  isCart?: number;
  isExistBundling?: number;
  isGroup?: number;
  bargainOpenId?: number;
}

export interface IRecievingAddress {
  addressId: number;
  memberId: number;
  realName: string;
  areaId1: number;
  address1: string;
  areaId2: number;
  address2: string;
  areaId3: number;
  address3: string;
  areaId4: number;
  areaId: number;
  areaInfo: string;
  address: string;
  mobPhone: string;
  telPhone: string;
  isDefault: number;
}

export interface IOrderAddress extends IRecievingAddress {
  createTm?: number;
  memberId: number;
  modifyTm?: null;
  telPhone: string;
}

export interface IBooking {
  address: IOrderAddress;
  allowOffline: number;
  allowPointsMoney: number;
  buyStoreVoList?: {
    buyGoodsSpuVoList: {
      buyGoodsItemVoList: IBuyGoodsItemVoList[];
      commonId: number;
      goodsName: string;
      imageSrc: string;
    }[];
    buyItemAmount: number;
    buyItemExcludejoinBigSaleAmount: number;
    buyStoreExcludejoinBigSaleAmount: number;
    cartBundlingVoList: [];
    conform: any;
    foreignTaxAmount: number;
    freightAmount: number;
    isOnline: number;
    isOwnShop: number;
    itemCount: number;
    sellerId: number;
    storeId: number;
    storeName: string;
    voucherVoList: [];
  }[];
  groupPrice?: number;
  invoiceContentList: string[];
  isCart: number;
  isExistTrys: number;
  isForeign: number;
  isGroup: number;
  idCard: string;
  memberPoints: number;
  memberPointsCanUse: number;
  memberPointsMoney: number;
  mobile: string;
  paymentTypeCode?: string;
  pointsMoneyValue: number;
  realName: string;
  shipTimeTypeList: { name: string; id: number }[];
}

export const step1Detail: (
  params: IBookingDetail
) => Promise<IBooking> = params =>
  axios({
    method: "post",
    url: API.BUY_STEP1 as string,
    data: params
  });

/**
 *
 *
 * @export
 * @interface IOrder
 *
 * @example buyData: JSON.stringify(buyData:IBuyData)
 */
export interface IOrder {
  clientType: CLIENT_TYPE;
  buyData: string;
}

export interface ICalcFreight {
  address: {
    addressId: number;
    realName: string;
  };
  freightAmount: number;
  storeList: {
    storeId: number;
    freightAmount: number;
    goodsList: {
      goodsId: number;
      allowSend: number;
    }[];
  }[];
}

export const calcFreight: (data: IOrder) => Promise<ICalcFreight> = data =>
  axios({
    method: "post",
    url: API.CALC_FREIGHT as string,
    data
  });

export interface ICalcResult {
  buyGoodsItemAmount: number;
  storeTotalDiscountAmount: number | null;
  platTotalDiscountAmount: number | null;
  taxAmount: number | null;
  storeList: {
    storeId: number;
    buyAmount2: number;
  }[];
}

export const calcFee: (data: IOrder) => Promise<ICalcResult> = data =>
  axios({
    method: "post",
    url: API.CALC as string,
    data
  });

export interface IOrderReq {
  clientType: CLIENT_TYPE;
  buyData: string;
}

export const step2Order: (
  data: IOrderReq
) => Promise<{ payId: number }> = data =>
  axios({
    method: "post",
    url: API.BUY_STEP2 as string,
    data
  });

export interface IPaymentreq {
  clientType: CLIENT_TYPE;
  payId: number;
}

export interface IPaymentResp {
  payAmount: number;
  payId: number;
  predepositAmount: number;
  allowPredeposit: number;
  paymentList: [
    {
      paymentCode: string;
      paymentName: string;
    },
    {
      paymentCode: string;
      paymentName: string;
    }
  ];
}

export const getPayment: (data: IPaymentreq) => Promise<IPaymentResp> = data =>
  axios({
    ...(API.BUY_STEP3 as {}),
    data
  });

export interface IPayReq {
  payId: number;
  predepositPay: number;
}

export const getAlipayPrepayId: <T>(
  payment: string,
  data: IPayReq
) => Promise<T> = (payment, data) => {
  let url =
    payment === PAYMENT.alipay
      ? API.BUY_STEP4_ALIPAY
      : payment === PAYMENT.wechat
      ? API.BUY_STEP4_WECHAT
      : false;
  if (!url) {
    fail("不支持的支付方式");
    throw `不支持的支付方式：${payment}`;
  }
  return axios({
    method: "post",
    url: url as string,
    data
  });
};

export const getUnionpaySignature: <T>(data: IPayReq) => Promise<T> = data =>
  axios({
    ...(API.BUY_STEP4_UNIONPAY as {}),
    data
  });
export const postPay: (payId: string) => Promise<number> = payId =>
  axios({
    url: API.BUY_POST as string,
    method: "post",
    data: { payId }
  });

export type InvoiceType = {
  type: string;
  title: string;
  username: string;
  sn: string;
  content: string;
  mount: number;
  email: string;
  [key: string]: any;
};

export const getFlatBooking: (booking: IBooking) => IBuyGoodsItemVoList[] = ({
  buyStoreVoList
}) => {
  return !buyStoreVoList
    ? []
    : R.flatten(
        buyStoreVoList.map(({ buyGoodsSpuVoList }) =>
          R.flatten(
            buyGoodsSpuVoList.map(({ buyGoodsItemVoList }) => [
              ...buyGoodsItemVoList
            ])
          )
        )
      );
};
