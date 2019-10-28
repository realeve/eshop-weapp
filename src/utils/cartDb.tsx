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

const readShoppingCart = axios({
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
