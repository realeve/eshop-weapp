/**
 *
 *
 * @export
 * @interface ICartItems
 *
 * @fields   buyData: string;
 * @fields  clientType: string;
 * @fields  cartData?: string;
 * @fields  bundlingId?: number;
 *
 * @example cartData JSON.stringify([{"buyNum":3,"goodsId":91},{"buyNum":1,"goodsId":95},{"buyNum":1,"goodsId":96}])
 */
export interface ICartItems {
  buyData: string | any;
  clientType: string;
  cartData?: string;
  bundlingId?: number;
}
/**
 * 购物车商品基础信息
 * @param buyNum: 数量
 * @param goodsId: 商品id
 * @param timestamp 时间戳
 */
export interface ICartItem {
  buyNum: string | number;
  goodsId: string;
  timestamp?: string;
  [key: string]: any;
}

/**
 *
 *
 * @export
 * @interface ICartItemsResponse
 *
 * @example cartData JSON.parse('{"91":3,"95":1,"96":1}')
 */
export interface ICartItemsResponse {
  cartData: string;
}

export interface ShoppingCartItem {
  buyData: string;
  bundlingId: number;
  clientType: string;
  timestamp: string;
}

export interface ICartItemVoList {
  appPrice0: number;
  appPrice1: number;
  appPrice2: number;
  appUsable: number;
  batchNum0: number;
  batchNum0End: number;
  batchNum1: number;
  batchNum1End: number;
  batchNum2: number;
  batchNumState: number;
  bundlingId: number;
  buyBundlingItemVoList: any;
  buyNum: number;
  cartId: number;
  chainGoodsId: number;
  chainId: number;
  chainName: any;
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
  giftVoList: any[];
  goodsContractVoList: any[];
  goodsFullSpecs: string;
  goodsId: number;
  goodsModal: number;
  goodsName: string;
  goodsPrice: number;
  goodsPrice0: number;
  goodsPrice1: number;
  goodsPrice2: number;
  goodsStatus: number;
  goodsStorage: number;
  goodsType: number;
  imageName: any;
  imageSrc: any;
  isBook: any;
  isChain: any;
  isForeign: any;
  isGift: any;
  isSecKill: any;
  isStoreVIPDiscount: any;
  isVirtual: any;
  itemAmount: any;
  joinBigSale: any;
  limitAmount: number;
  memberId: number;
  promotionBeginTime: any;
  promotionEndTime: any;
  promotionTitle: string;
  promotionType: number;
  promotionTypeText: string;
  realCommonId: number;
  realGoodsId: number;
  seckillGoodsId: number;
  spuBuyNum: number;
  spuImageSrc: string;
  storageStatus: number;
  storeId: number;
  storeName: string;
  storeVIPDiscount: number;
  unitName: string;
  webPrice0: number;
  webPrice1: number;
  webPrice2: number;
  webUsable: number;
  wechatPrice0: number;
  wechatPrice1: number;
  wechatPrice2: number;
  wechatUsable: number;
}

export interface IVoucherTemplateVoList {
  addTime: string;
  appUsable: number;
  expiredState: number;
  giveoutNum: number;
  haveCreated: number;
  limitAmount: number;
  limitAmountText: string;
  limitMemberGradeLevel: number;
  limitMemberGradeName: string;
  memberIsReceive: number;
  sellerId: number;
  sellerName: string;
  storeId: number;
  storeName: string;
  templateCurrentStateSign: string;
  templateCurrentStateText: string;
  templateDescribe: string;
  templateId: number;
  templatePrice: number;
  templateStartTime: string;
  templateState: number;
  templateTitle: string;
  templateType: number;
  templateTypeText: string;
  totalNum: number;
  updateTime: string;
  usableClientType: string;
  usableClientTypeText: string;
  useEndTime: string;
  useEndTimeText: string;
  useStartTime: string;
  useStartTimeText: string;
  usedNum: number;
  validDays: number;
  voucherCenterRecommend: number;
  webUsable: number;
  wechatUsable: number;
  withoutState: number;
}

export interface ICartSpuVoList {
  batchNum0: number;
  batchNum0End: number;
  batchNum1: number;
  batchNum1End: number;
  batchNum2: number;
  bundlingId: number;
  buyNum: number;
  cartItemVoList: ICartItemVoList[];
  chainId: number;
  commonId: number;
  goodsModal: number;
  goodsName: string;
  goodsStatus: number;
  goodsType: number;
  imageSrc: string;
  isValid: number;
  realCommonId: number;
}

export interface ICartStoreVoList {
  buyNum: number;
  cartAmount: number;
  cartBundlingVoList: any[];
  cartItemVoList: ICartItemVoList[];
  chainId: number;
  chainName: any;
  conformList: any[];
  isOnline: number;
  sellerId: number;
  storeId: number;
  storeName: string;
  cartSpuVoList: ICartSpuVoList[];
  voucherTemplateVoList: IVoucherTemplateVoList[];
}

/**
 * 购物车接口返回的数据
 */
export interface IShoppingCart {
  cartDbMaxCount: number;
  cartStoreVoList: ICartStoreVoList[];
  skuCount: number;
}

export type TCartType = "offline" | "online" | "confirm";

export interface IShoppingCartCount {
  total: {
    num: number;
    price: number;
  };
  data: IShoppingCartItem[];
  loading?: boolean;
  type: TCartType; // 离线或在线模式
  [key: string]: any;
}

export interface ICartDetail {
  // cartid?: string;
  cartId?: string;
  checked?: boolean;
  spuid: string;
  id: string;
  name: string;
  spec: string;
  price: number;
  num: number;
  valid?: boolean;
  storage: number;
  img: string;
  totalPrice?: number;
  unitName: string;
}

export interface IConfirmCart extends ICartDetail {
  shop: {
    id: number;
    name: string;
    saleService?: { num: number; name: string }[];
  };
}

export interface IShoppingCartItem {
  total: {
    num: number;
    price: number;
  };
  shop: {
    id: number;
    name: string;
  };
  detail: ICartDetail[];
}

export interface IShopInfo {
  tags?: string[];
  name: string;
  id: number;
  logo: string;
  [keys: string]: any;
}
export interface ILocalStorageCartDetail extends ICartDetail {
  shop: IShopInfo;
  type: TCartType; // 离线或在线模式
  [key: string]: any;
}
