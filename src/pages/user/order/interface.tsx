export type TGoodsItem = {
  id: number;
  name: string;
  type: string;
  img: string;
  comment?: {
    content: string;
    img: string[];
  };
};

export interface IOrderGoodsItem {
  allowVirtualRefund: number;
  buyNum: number;
  commonId: number;
  complainId: number;
  goodsContractVoList: never[];
  goodsFullSpecs: string;
  goodsId: number;
  goodsImage: string;
  goodsName: string;
  goodsPayAmount: number;
  goodsPrice: number;
  goodsServicesList: never[];
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
  [key: string]: any;
}

export interface IOrderItem {
  memberId: number;
  memberName: string;
  ordersId: number;
  ordersSn: number;
  ordersType: number;
  storeId: number;
  storeName: string;
  [key: string]: any;
}

export interface IStoreItem {
  allowForeignGoods: number;
  billCycle: number;
  billCycleType: number;
  billCyleDescription: string;
  classId: number;
  className: string;
  companyArea: string;
  companyAreaId: number;
  companyName: string;
  decorationColor: string;
  decorationId: number;
  decorationOnly: number;
  decorationState: number;
  gradeId: number;
  gradeName: string;
  hasBusinessLicence: number;
  hasFoodCirculationPermit: number;
  isOwnShop: number;
  isRecommend: number;
  sellerId: number;
  sellerName: string;
  shipCompany: string;
  state: number;
  storeAddress: string;
  storeAftersales: string;
  storeAvatar: string;
  storeAvatarUrl: string;
  storeBanner: string;
  storeBannerUrl: string;
  storeCollect: number;
  storeCommitment: string;
  storeCreateTime: string;
  storeDeliverycredit: number;
  storeDesccredit: number;
  storeEndTime: string;
  storeId: number;
  storeLogo: string;
  storeLogoUrl: string;
  storeName: string;
  storePhone: string;
  storePresales: string;
  storeSales: number;
  storeSeoDescription: string;
  storeSeoKeywords: string;
  storeServicecredit: number;
  storeTheme: string;
  storeWorkingtime: string;
  storeZy: string;
  [key: string]: any;
}

export interface IEvaluateStore {
  avgStoreEval: string;
  avgStoreEvalRate: string;
  deliveryEvalArrow: string;
  deliveryEvalRate: string;
  deliveryEvalTitle: string;
  desEvalArrow: string;
  desEvalRate: string;
  desEvalTitle: string;
  serviceEvalArrow: string;
  serviceEvalRate: string;
  serviceEvalTitle: string;
  storeDeliveryEval: string;
  storeDesEval: string;
  storeServiceEval: string;
}

export interface IDBGoodsInfo {
  ordersGoodsList: IOrderGoodsItem[];
  orders: IOrderItem;
  store: IStoreItem;
  evaluateStoreVo: IEvaluateStore;
}

export interface IGoodsInfo {
  shopName: string;
  orderid: string | number;
  shopid: string | number;
  goods: TGoodsItem[];
  [key: string]: any;
}

export interface IAppendGoodsInfo {
  commonId: number;
  content: string;
  contentAgain: string;
  days: string;
  evaluateId: number;
  evaluateNum: number;
  evaluateTime: string;
  evaluateTimeAgain: any;
  explainContent: any;
  explainContentAgain: any;
  explainTime: number;
  explainTimeAgain: number;
  goodsFullSpecs: string;
  goodsId: number;
  goodsImage: string;
  goodsImageUrl: string;
  goodsName: string;
  hasImage: number;
  images: string;
  imagesAgain: string;
  imagesAgainUrlList: string[];
  imagesUrlList: string[];
  isAnonymous: any;
  memberId: number;
  memberName: string;
  ordersId: number;
  ordersSn: number;
  ordersType: number;
  scores: number;
  storeId: number;
  storeName: string;
}

export interface IAppendComment {
  ordersId: number;
  evaluateGoodsOrderVoList: IAppendGoodsInfo[];
  store: IStoreItem;
  evaluateStoreVo: IEvaluateStore;
}
