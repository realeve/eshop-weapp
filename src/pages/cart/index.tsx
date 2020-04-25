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

interface IProps extends ICartModel {
  dispatch: Dispatch;
  [key: string]: any;
}
export interface IGoodsItem extends api.ICartDetail {
  checked?: boolean;
  [key: string]: any;
}

const Cart = ({ isLogin, shoppingCart, dispatch }) => {
  // console.log("connected", isLogin, shoppingCart);
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
  }, [(shoppingCart || { total: {} }).total]);

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

  const onChange = {
    selectShop: shop => {
      console.log("select shop", shop);
    },
    deselectShop: shop => {
      console.log("deselect shop", shop);
    },
    selectGoods: spu => {
      console.log("selectGoods", spu);
    },
    deselectGoods: spu => {
      console.log("deselectGoods", spu);
    },
    addGoods: ({ cartId, id, buyNum, idx }) => {
      console.log("addGoods", { cartId, id, buyNum, idx });
      api.cartEdit({ cartId, buyNum }).then(res => {
        if (res.success) {
          // api.loadShoppingCart(dispatch);
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
        exe: async () => api.cartDel([cartid], dispatch)
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
              <CPrice retail={shoppingCart.total.price}></CPrice>
            </View>
            <CButton
              theme="gardient"
              round={false}
              style={{ height: "35px", lineHeight: "35px", fontSize: "15px" }}
            >
              结算({shoppingCart.total.num})
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
