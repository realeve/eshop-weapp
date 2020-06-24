export const API = {
  CAPTCHA_BOX: "/captcha/make-box-captcha",
  SEND_SMSCODE: "/loginconnect/smscode/send-box",
  LOGIN_SMSCODE: "/loginconnect/mobile/login",
  REGISTER_MOBILE: "/loginconnect/mobile/register",

  LOGIN_WX_H5: "/wx/mp/authorize",

  MEMBER_INFO: "/member/detail",
  LOGOUT: "/logout",
  UNBIND: "/wx/mp/unbind-openid",
  REALNAME_AUTH: "/realName/authentication",
  INDEX_PRODUCTS: { method: "post", url: "/webIndexComponent" },
  SPECIAL_GOODS: { method: "post", url: "/specialGoods" },
  LOGIN_MINI_PROGRAM: { method: "post", url: "/wx/mini/login" },
  MINI_PROGRAM_BINDING: { method: "post", url: "/wx/mini/bind-openid" },
  LOGOUT_MINI_PROGRAM: { method: "post", url: "/wx/mini/logout" },

  // REALNAME_AUTH: '/member/real_name_auth/join_update',
  SP_SUBSCRIBER_INFO: "/specialtyProduct/getSubscriberInfo",
  SP_SUBSCRIBER_COMPUTE: { url: "/specialtyProduct/getComputeByBatchId" },
  SUBSCRIBE: "/specialtyProduct/doSubscribe",
  // MY_SUBSCRIBE: { url: '/specialtyProduct/getOrdersInfo' },

  MY_SUBSCRIBE_ORDER: {
    method: "post",
    url: "/specialtyProduct/getOrdersInfo"
  },
  MY_SUBSCRIBE: "/specialtyProduct/selectPersonalSubscribe",
  UPDATE_SPECIAL_ADDRESS: {
    method: "post",
    url: "/specialtyProduct/updateAddress"
  },

  MODIFY_MEMBER_NAME: "/member/membername/edit",
  ADDRESS_LIST: "/area/list",
  GOODS: { method: "post", url: "/goods" },
  GOODS_DETAIL_BODY: "/goods/body/",
  GOODS_FREIGHT: "/goods/calc/freight",
  GOODS_EXTEND: "/goods/extend",
  GOODS_EVALUATE: "/goods/evaluate/queryGoodsEvaluate",
  GOODS_GUESS: "/goods/guess/like",

  // 搜索
  SEARCH: "/search",
  SEARCH_HOT_KEWORDS: "/search/default/keyword",
  SEARCH_CUEWORD_SUGGEST: "/search/suggest.json",
  SEARCH_DEFAULT_WORD: "/search/hot/keyword",

  CATEGORY: "/category/list",
  INDEX_COMPONENT: "/appIndexComponent",
  BRAND: "/brand/recommend",
  MODIFY_MEMBER_SEX: "/member/sex/edit",
  MODIFY_MEMBER_BIRTH: "/member/birthday/edit",
  ADDRESS_DETAIL: "member/address/info",
  MODIFY_MEMBER_ADDRESS_EDIT: "/member/address/edit",
  MODIFY_MEMBER_ADDRESS_ADD: "/member/address/add",
  MODIFY_MEMBER_ADDRESS_DELETE: "/member/address/delete",
  MODIFY_MEMBER_AVATAR: "/member/avatar/edit",
  MEMBER_ADDRESS_LIST: "/member/address/list",
  MEMBER_AUTHINFO: "/member/real_name_auth/info",
  BUY_STEP1: "/member/buy/step1",
  // RECIEVING_ADDRESS: '/member/address/list',
  // ADD_ADDRESS: '/member/address/add',

  CART_ADD: "/cart/add",
  CART_LIST: { method: "post", url: "/cart/list" },
  CART_EDIT: { method: "post", url: "/cart/edit" },
  CART_DEL: { method: "post", url: "/cart/del/batch/sku" },

  CALC_FREIGHT: "/member/buy/calc/freight",
  CALC: "/member/buy/calc",
  BUY_STEP2: "/member/buy/step2",
  BUY_STEP3: { method: "post", url: "/member/buy/show/payment" },
  BUY_STEP4_ALIPAY: "/member/buy/pay/web/alipay",
  BUY_STEP4_WECHAT: "/member/buy/pay/web/wxpay",
  BUY_STEP4_MP: "/member/buy/pay/wxmini/wxpay", //"/member/buy/pay/mp",// TODO 在调试中暂时以微信原生app替代，待小程序支付申请后
  BUY_STEP4_UNIONPAY: { method: "post", url: "/member/buy/pay/union" },
  BUY_POST: "/member/buy/pay/success",
  BUY_ISPAIED: { method: "post", url: "/member/buy/pay/isSuccess" },

  // 我的收藏夹
  GOODS_FAVORITE_GOODS: "/member/goods/favorite/list",
  GOODS_FAVORITE_STORE: "/member/store/favorite/list",
  GOODS_FAVORITE_ARTICLE: "/advertorial/article/myfollow",

  SHOP_FAVORITE_ADD: { method: "post", url: "/member/store/favorite/add" },
  SHOP_FAVORITE_DEL: { method: "post", url: "/member/store/favorite/delete" },

  GOODS_FAVORITE_ADD: { method: "post", url: "/member/goods/favorite/add" },
  GOODS_FAVORITE_DEL: { method: "post", url: "/member/goods/favorite/delete" },
  GOODS_FAVORITE_IF: { method: "post", url: "/goods/favorite/member/exist" },
  MODIFY_MEMBER_PASSWORD: "/member/security/edit/pwd",
  PHONE_CHECK: "/loginconnect/smscode/check",
  MODIFY_PASSWORD: "/member/security/edit/pwd",
  MODIFY_PHONE: "/member/security/edit/mobile",
  GOODS_FAVORITE_MULTIDEL: {
    method: "post",
    url: "/member/goods/favorite/multi_delete"
  },

  //我的足迹
  GOODS_BROWSE: { method: "post", url: "/member/goodsbrowse/list" },
  GOODS_BROWSE_CLEARALL: {
    method: "post",
    url: "/member/goodsbrowse/clearall"
  },
  LOGIN_BOX: "/login-box",
  FIND_PWD: "/loginconnect/mobile/findpwd"
};

// 订单列表管理
const orderList = {
  orderStatusNumber: "/member/index", // 订单不同状态下数量显示
  list: "/member/orders/list",
  buyAgain: "/member/orders/buy/again",
  cancel: "/member/orders/cancel",
  delete: "/member/orders/delete",
  commentList: "/member/evaluate/addPage",
  addComment: "/member/evaluate/add",
  appendCommentList: "/member/evaluate/addAgainPage",
  appendComment: "/member/evaluate/addAgain",
  receive: "/member/orders/receive",
  express: "/member/orders/ship/search",

  detail: "/member/orders/info",

  evaluate: "/member/evaluate/list"
};

let convertApiConfig = (data = orderList) => {
  let res = {};
  Object.entries(data).map(([key, url]) => {
    res[key] = {
      url,
      method: "post"
    };
  });
  return res;
};

const serviceList = {
  refundList: "/member/refund/list", // 退款列表
  refunDetail: "/member/refund/info", // 退款详情
  refundByOrder: "/member/refund/all", // 退款申请页面
  addOrderRefund: "/member/refund/all/save", // 全部退款申请保存
  refundByGoodsId: "/member/refund/goods", // 单个商品退款申请页面
  refundByAll: "/member/refund/all/save", //全部退款申请保存
  addGoodsRefund: "/member/refund/goods/save", // 单个商品退款申请保存
  returnByGoodsId: "/member/return/add", // 单个商品退货申请页面
  addGoodsReturn: "/member/return/save", // 单个商品退货申请保存
  returnList: "/member/return/list", // 退货记录列表
  returnDetail: "/member/return/info", // 查看退货详情
  returnSendDetail: "/member/return/ship", //退货发货信息
  addReturnSend: "/member/return/ship/save", // 退货发货保存
  cancelRefund: "/member/refund/cancel", // 退款申请取消
  cancelReturn: "/member/return/cancel" // 退货申请取消
};

export const IM = {
  history: { im: true, method: 'post', url: '/his_msg' },//获取与某个联系人的聊天记录
  addLinkMan: { im: true, method: 'post', url: '/link_man_add' }, // 添加联系人
  getUnread: { im: true, method: 'post', url: '/get_unread_msg_count' },//获取未读消息数量
  getLinkInfo: { im: true, method: 'post', url: '/get_link_info' },//获取联系人相关信息
  getLinkList: { im: true, method: 'post', url: '/get_link_list' } //获取联系人列表

}

export const ORDER = convertApiConfig();
export const SERVICE = convertApiConfig(serviceList);

export const SPECIAL_GOODS = {
  list: "/specialtyProduct/selectPersonalSubscribe",
  history: { method: "post", url: "/specialtyProduct/query/list" }
};

/**
 * @field NORMAL 普通订单
 * @field VIRTUAL 虚拟订单
 */
export const ORDER_TYPE = {
  NORMAL: 0,
  VIRTUAL: 1
};
