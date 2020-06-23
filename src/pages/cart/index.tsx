import Taro, { useEffect, useState } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import { ICartModel } from "./model";
import { Dispatch } from "redux";
import "./index.scss";
import { CEmpty, CPrice, CButton } from "@/components";
import { IGlobalModel } from "@/models/common";
import CartGroup from "./components/CCartGroup";
import * as api from "@/utils/cartDb";
import { AtModal } from "taro-ui";
import * as R from "ramda";
import * as lib from "@/utils/lib";

interface IProps extends ICartModel {
  dispatch: Dispatch;
  [key: string]: any;
}
export interface IGoodsItem extends api.ICartDetail {
  checked?: boolean;
  [key: string]: any;
}

const Cart = ({ isLogin, shoppingCart, dispatch }) => {
  const [selected, setSelected] = useState({ num: 0, price: 0, carts: [] });
  const [isEmpty, setIsEmpty] = useState(true);
  const [isOpened, setIsOpened] = useState(false);
  const [action, setAction] = useState({
    // args:{},
    exe: async () => {},
    content: ""
  });

  useEffect(() => {
    setIsEmpty(
      !(shoppingCart && shoppingCart.total && shoppingCart.total.num > 0)
    );
    setSelected(recalTotal(selected.carts));
  }, [(shoppingCart || { total: {} }).total, selected.carts]);

  const adjustCart = (cartId, buyNum) => {
    let prevState = R.clone(shoppingCart);
    let { data, total, loading, ...restCart } = prevState;
    let type = "common/setStore";
    dispatch({
      type,
      payload: {
        shoppingCart: { loading: true, data, total, ...restCart }
      }
    });
    total = { num: 0, price: 0 };
    data = data.map(({ shop, detail }) => {
      let _num = 0;
      let _price = 0;
      detail = detail.map(goods => {
        let { price, num, totalPrice, ...rest } = goods;
        if (goods.cartId != cartId) {
          _num += goods.num;
          _price += goods.totalPrice;
          return goods;
        }
        _num += buyNum;
        _price += price * buyNum;
        return {
          price,
          num: buyNum,
          totalPrice: price * buyNum,
          ...rest
        };
      });
      total = { num: total.num + _num, price: total.price + _price };
      return {
        shop,
        detail,
        total: { num: _num, price: _price }
      };
    });
    dispatch({
      type,
      payload: {
        shoppingCart: { loading: false, data, total, ...restCart }
      }
    });
  };
  const recalTotal = carts => {
    if (!carts || carts.length === 0) {
      return [];
    }
    let allGoods = (
      R.flatten(shoppingCart.data.map(({ detail }) => detail)) || []
    ).filter(g => carts.includes(g.cartId));
    let num = R.reduce((sum, goods) => (sum += goods.num), 0)(allGoods);
    let price = R.reduce(
      (sum, goods) => (sum += goods.num * goods.price),
      0
    )(allGoods);
    return { num, price, carts };
  };
  const addSelected = (cartId, withDraw = false) => {
    let allGoods = selected.carts;
    let arr = R.type(cartId) === "Array" ? cartId : [cartId];
    if (withDraw) {
      allGoods = R.filter(g => !arr.includes(g))(allGoods);
    } else {
      allGoods = R.union(allGoods, arr);
    }
    setSelected(recalTotal(allGoods));
  };
  const getCartsByShop = id => {
    return R.flatten(
      (
        shoppingCart.data.filter(({ shop }) => shop.id === id) || []
      ).map(({ detail }) => detail.map(d => d.cartId))
    );
  };

  const onChange = {
    selectShop: shop => {
      console.log("select shop", shop);
      let carts = getCartsByShop(shop);
      addSelected(carts);
    },
    deselectShop: shop => {
      console.log("deselect shop", shop);
      let carts = getCartsByShop(shop);
      addSelected(carts, true);
    },
    selectGoods: cartId => {
      console.log("selectGoods", cartId);
      addSelected(cartId);
    },
    deselectGoods: cartId => {
      console.log("deselectGoods", cartId);
      addSelected(cartId, true);
    },
    addGoods: ({ cartId, id, buyNum, idx }) => {
      console.log("addGoods", { cartId, id, buyNum, idx });
      api.cartEdit({ cartId, buyNum }).then(res => {
        if (res.success) {
          adjustCart(cartId, buyNum);
          return;
        }
        Taro.showToast({
          title: "超出库存上限:" + res.num,
          icon: "none",
          duration: 2000
        });
      });
    },
    delGoods: cartid => {
      console.log("delGoods", cartid);
      setAction({
        content: "确定要从购物车中删除这件商品吗？",
        exe: () => api.cartDel([cartid], dispatch)
      });
      setIsOpened(true);
    }
  };

  const handleConfirm = () => {
    action.exe();
    resetAction();
  };

  const resetAction = () => {
    setAction({
      content: "",
      exe: async () => {}
    });
    setIsOpened(false);
  };

  const onSubmit = () => {
    if (!isLogin || selected.num <= 0) {
      return;
    }
    let data = (
      R.flatten(shoppingCart.data.map(({ detail }) => detail)) || []
    ).filter(g => selected.carts.includes(g.cartId));

    // 生成订单后跳转
    let cartData = R.flatten(data).map(item => ({
      ...item,
      type: "confirm" // 订单确认
    }));
    api.addConfirmCart(dispatch, cartData);

    let goodsIds = cartData.map(item => item.cartId);
    api.cartDel(goodsIds, dispatch).then(() => {
      api.removeShoppingCartByIds(
        cartData.map(item => item.id),
        dispatch
      );
    });

    // window.localStorage.setItem(LocalStorageKeys.confirm, JSON.stringify(cartData));
    lib.jump("/pages/order/confirm/index");
  };

  return (
    <View className="cart-page">
      {isEmpty ? (
        <CEmpty type="cart" />
      ) : (
        <View>
          <AtModal
            isOpened={isOpened}
            // closeOnClickOverlay
            title="提示"
            cancelText="取消"
            confirmText="确认"
            // onClose={this.handleClose}
            onCancel={() => resetAction()}
            onConfirm={() => handleConfirm()}
            content={action.content}
          />
          {shoppingCart.data.map(data => (
            <CartGroup
              data={data}
              callback={onChange}
              key={String(data.shop.id)}
            />
          ))}
          <View className="summary">
            <View className="alignRow">
              <Text>合计：</Text>
              <CPrice retail={selected.price}></CPrice>
            </View>
            <CButton
              theme="gardient"
              round={false}
              disabled={!isLogin && selected.num === 0}
              style={{ height: "35px", lineHeight: "35px", fontSize: "15px" }}
              onClick={onSubmit}
            >
              {selected.num > 0 ? `结算(${selected.num})` : "未选择结算商品"}
            </CButton>
          </View>
        </View>
      )}
    </View>
  );
};

Cart.config = {
  navigationBarTitleText: "购物车"
};

export default connect(
  ({ common: { isLogin, shoppingCart } }: { common: IGlobalModel }) => ({
    isLogin,
    shoppingCart
  })
)(Cart as any);
