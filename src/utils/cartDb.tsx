import { axios } from "@/utils/axios";
import { API, CLIENT_TYPE, LocalStorageKeys } from "@/utils/setting";
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
  let num = R.reduce((sum, item: IShoppingCartItem) => sum + item.total.num, 0)(
    res
  );
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
