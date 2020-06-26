// import { isLogin } from "./../utils/lib";
import Taro from "@tarojs/taro";
import { setStore, setUserStore, jump, randomStr } from "@/utils/lib";
import * as db from "../services/common";
import { Dispatch } from "redux";
import { ICateItem } from "@/pages/index/components/cateList";
import { ICollection } from "@/pages/index/components/collectionList";
import { LocalStorageKeys } from "@/utils/setting";
import {
  IShoppingCartCount,
  loadShoppingCart,
  IConfirmCart
} from "@/utils/cartDb";
import { loadMember, loginWx } from "@/pages/login/db";

import { get as getGlobalData } from "@/utils/global_data";
import * as wx from "@/utils/weixin";

import { OSS_URL } from "@/utils/setting";
import * as R from "ramda";

export { Dispatch };
export interface RouteData {
  pathname: string;
  query?: any;
  search?: string;
  state?: any;
}

export interface IMenuItem {
  menuAd: never[];
  menuId: number;
  menuItemList: {
    itemData: {
      data: string;
      image: string;
      imageUrl: string;
      name: string;
      type: string;
    };
    itemId: number;
    itemMore: {
      data: string;
      image: string;
      imageUrl: string;
      name: string;
      type: string;
    };
    itemName: string;
    itemType: number;
    menuId: number;
    subitemData: {
      data: string;
      image: string;
      imageUrl: string;
      name: string;
      type: string;
    }[];
  }[];
  menuName: string;
}

export interface IGlobalUser {
  avatar: string;
  uid: number;
  account: string;
  memberName: string;
  trueName: string;
  phone: string;
  sex: string;
  birthday: null;
  authState: number;
  isRealNamePassed: boolean;
  authMessage: string;
  [key: string]: any;
}

export interface IOrderNum {
  needPay: number;
  needSend: number;
  needReceive: number;
  needConfirm: number;
  refund: number;
  [key: string]: any;
}

export interface IGlobalModel {
  user: IGlobalUser; // 用户全局状态
  isLogin: boolean; // 是否登录
  miniProgram: { isBinding: boolean; isConfirmed: boolean }; // 小程序设定,isBinding：是否已经绑定微信；isConfirmed：不再询问是否绑定
  special: {
    batchId: string;
    imageUrl: string;
    type: string;
  }; // 特品信息
  cateList: ICateItem[]; // 主页菜单列表
  collectionList: ICollection;
  newProduct: ICollection; // 新品
  menuList: IMenuItem[]; // 分类
  orderNum: IOrderNum;
  shoppingCart: IShoppingCartCount; // 购物车
  confirmCart: IConfirmCart[]; // 立即购买商品确认
  normalList: db.ICarouselItem[]; //普品专题列表
  specialList: db.ICarouselItem[]; //三联播
  buyLocking: boolean;
  orderTrigger: string;
  appVersion: string;
  seckill: {};
}

const state = {
  user: Taro.getStorageSync(LocalStorageKeys.user) || {},
  isLogin: false,
  miniProgram: Taro.getStorageSync(LocalStorageKeys.user),
  special: {
    batchId: "0",
    imageUrl: "",
    type: ""
  },
  shoppingCart: {
    loading: true,
    total: { num: 0, price: 0 },
    data: [],
    type: "offline"
  },
  confirmCart: [],
  cateList: [],
  collectionList: {
    data: [],
    titleCh: "",
    titleEn: ""
  },
  newProduct: {
    data: [],
    titleCh: "",
    titleEn: ""
  },
  menuList: [],
  orderNum: {},
  normalList: [],
  specialList: [],
  curCateId: 0,
  buyLocking: false,
  orderTrigger: randomStr(),
  appVersion: "V 1.0",
  seckill: {
    title: "",
    remainSeconds: 0,
    endTime: "",
    type: "seckill"
  }
};

// 载入登录信息
export const loadUserInfo = async (dispatch: Dispatch) => {
  let user = Taro.getStorageSync(LocalStorageKeys.user) || { memberName: "" };

  Reflect.deleteProperty(user, "token");
  if (user.memberName.length === 0) {
    user = await loadMember(dispatch).catch(() => ({}));
  } else {
    if (!user.weixinIsBind) {
      await wx.bindWXInfo(dispatch); // 绑定完之后会发起重新获取用户身份信息的调用，绑定成功后不执行该模块
    }
  }

  dispatch({
    type: "setStore",
    payload: {
      user,
      isLogin: user && user.uid > 0
    }
  });
  return user;
};

const namespace = "common";
export const updateStore = namespace + "/setStore";

const handleData = (data, webp) => {
  let res = R.clone(data);
  let suffix = db.getWebpSuffix(webp);

  res.data = res.data.map(item => {
    if (!item.imageUrl.includes("://")) {
      item.imageUrl = OSS_URL + item.imageUrl + suffix;
    } else {
      item.imageUrl += suffix;
    }
    return item;
  });
  return res;
};

export default {
  namespace,
  state,
  reducers: {
    setStore,
    setUserStore,
    resetUser: ({ user, ...state }) => {
      return {
        ...state,
        user: {},
        isLogin: false,
        token: "",
        shoppingCart: {
          loading: false,
          total: { num: 0 }
        }
      };
    }
  },
  subscriptions: {
    async setup({ dispatch }: { dispatch: Dispatch }) {
      let webp = getGlobalData("webp");
      db.loadHome().then(res => {
        let {
          componentA: special, // 特品
          componentB, // 商品分类
          componentC, //精选推荐
          componentD, //新品发售
          componentF, // 三联播
          componentG, // 普品专题列表
          componentAppVersion, // 系统版本
          componentI // 秒杀
        } = res;

        let appVersion = componentAppVersion.androidVersion;
        let payload: {
          appVersion: string;
          [key: string]: any;
        } = {
          appVersion: "V " + appVersion
        };

        if (special) {
          payload = {
            ...payload,
            special: {
              ...special,
              imageUrl: db.getWebp(special.imageUrl, webp)
            }
          };
        }
        if (componentB) {
          payload = { ...payload, cateList: componentB.data };
        }
        if (componentC) {
          payload = {
            ...payload,
            collectionList: handleData(componentC, webp)
          };
        }
        if (componentD) {
          payload = {
            ...payload,
            newProduct: handleData(componentD, webp)
          };
        }
        if (componentF) {
          payload = {
            ...payload,
            specialList: db.handleSpecialItem(componentF, webp)
          };
        }
        if (componentG) {
          payload = {
            ...payload,
            normalList: db.handleSpecialItem(componentG, webp)
          };
        }

        if (componentI) {
          let res = {
            seckillTime: 71200,
            seckillName: "12点场",
            seckillGoodsCommonVoList: [
              {
                seckillCommonId: 222,
                seckillGoodsId: 0,
                goodsName: "心语系列银手镯玫瑰款",
                imageSrc:
                  "https://static.ccgold.cn/image/2c/0d/2c0d930b5b29aec1e17acc023d44b617.jpg",
                goodsId: 0,
                commonId: 50,
                goodsPrice: 370,
                seckillGoodsPrice: 259,
                goodsStorage: 12,
                limitAmount: 0,
                scheduleId: 66,
                startTime: "2020-06-25 12:00:00",
                endTime: "2020-06-26 12:00:00",
                scheduleState: 1,
                verifyRemark: null,
                scheduleStateText: "已开抢",
                storeName: null,
                scheduleName: null,
                goodsSaleNum: 1,
                salesPercentage: 7,
                isNotice: 0
              },
              {
                seckillCommonId: 221,
                seckillGoodsId: 0,
                goodsName: "竹报平安银挂饰",
                imageSrc:
                  "https://static.ccgold.cn/image/84/6f/846f24096990e6f8373dbcf100422073.jpg",
                goodsId: 0,
                commonId: 77,
                goodsPrice: 98,
                seckillGoodsPrice: 66,
                goodsStorage: 8,
                limitAmount: 0,
                scheduleId: 66,
                startTime: "2020-06-25 12:00:00",
                endTime: "2020-06-26 12:00:00",
                scheduleState: 1,
                verifyRemark: null,
                scheduleStateText: "已开抢",
                storeName: null,
                scheduleName: null,
                goodsSaleNum: 0,
                salesPercentage: 0,
                isNotice: 0
              },
              {
                seckillCommonId: 220,
                seckillGoodsId: 0,
                goodsName: "熊猫亲子吊坠套装",
                imageSrc:
                  "https://static.ccgold.cn/image/d2/b2/d2b2d135d35fb688f979936e6c1aad35.jpg",
                goodsId: 0,
                commonId: 8,
                goodsPrice: 216,
                seckillGoodsPrice: 152,
                goodsStorage: 49,
                limitAmount: 0,
                scheduleId: 66,
                startTime: "2020-06-25 12:00:00",
                endTime: "2020-06-26 12:00:00",
                scheduleState: 1,
                verifyRemark: null,
                scheduleStateText: "已开抢",
                storeName: null,
                scheduleName: null,
                goodsSaleNum: 0,
                salesPercentage: 0,
                isNotice: 0
              },
              {
                seckillCommonId: 219,
                seckillGoodsId: 0,
                goodsName: "牍书茶盏",
                imageSrc:
                  "https://static.ccgold.cn/image/4e/ed/4eed5187c0fe7d8585dba39fd41e0505.jpg",
                goodsId: 0,
                commonId: 34,
                goodsPrice: 900,
                seckillGoodsPrice: 630,
                goodsStorage: 19,
                limitAmount: 0,
                scheduleId: 66,
                startTime: "2020-06-25 12:00:00",
                endTime: "2020-06-26 12:00:00",
                scheduleState: 1,
                verifyRemark: null,
                scheduleStateText: "已开抢",
                storeName: null,
                scheduleName: null,
                goodsSaleNum: 0,
                salesPercentage: 0,
                isNotice: 0
              },
              {
                seckillCommonId: 218,
                seckillGoodsId: 0,
                goodsName: "心语心经款银手镯",
                imageSrc:
                  "https://static.ccgold.cn/image/0f/36/0f36d11a356988e6462277027dabf078.jpg",
                goodsId: 0,
                commonId: 54,
                goodsPrice: 370,
                seckillGoodsPrice: 259,
                goodsStorage: 9,
                limitAmount: 0,
                scheduleId: 66,
                startTime: "2020-06-25 12:00:00",
                endTime: "2020-06-26 12:00:00",
                scheduleState: 1,
                verifyRemark: null,
                scheduleStateText: "已开抢",
                storeName: null,
                scheduleName: null,
                goodsSaleNum: 0,
                salesPercentage: 0,
                isNotice: 0
              }
            ]
          };

          let seckill = db.handleSecGoodsList(res || componentI);
          payload = {
            ...payload,
            seckill
          };
          console.log(seckill);
        }

        dispatch({
          type: "setStore",
          payload
        });
        // 热卖产品，后端暂无返回
        // console.log(componentE);
      });

      // 跑马灯
      // db.loadCarsouel().then(carousel => {
      //   dispatch({
      //     type: "setStore",
      //     payload: {
      //       carousel
      //     }
      //   });
      // });

      // 商品分类列表
      db.loadMenuList().then(menuList => {
        let menus = menuList.map(item => ({
          name: item.menuName,
          id: item.menuId,
          cates: item.menuItemList.map(menu => ({
            id: menu.itemId,
            name: menu.itemName,
            categoryList: menu.subitemData.map(sub => ({
              id: sub.data,
              name: sub.name,
              url:
                sub.imageUrl.replace("statictest", "statictest") +
                db.getWebpSuffix(webp) // 开发者模式
            }))
          }))
        }));
        dispatch({
          type: "setStore",
          payload: { menuList: menus }
        });
      });

      let token = getGlobalData("token");
      const isLogin = token.length > 0;
      if (isLogin) {
        // 载入用户登录信息
        await loadUserInfo(dispatch).then(() => {
          // 载入购物车信息
          loadShoppingCart(dispatch, true);
        });
      }
      loginWx(dispatch, true);
    }
  }
};
