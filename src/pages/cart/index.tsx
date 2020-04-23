import Taro, { useEffect, useState } from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import { ICartModel } from "./model";
import { Dispatch } from "redux";
import "./index.scss";
import { CEmpty, CPrice } from "@/components";
import { IGlobalModel } from "@/models/common";
import CartGroup from "./components/CCartGroup";
import * as api from "@/utils/cartDb";
import { AtModal, AtModalHeader, AtModalContent, AtModalAction } from "taro-ui";
import { ShoppingCartItem } from "@/utils/cart";

interface IProps extends ICartModel {
  dispatch: Dispatch;
  [key: string]: any;
}
// const GoodsItem = ({ goods }) => <View>goods</View>;

// const ShopItem = ({ data: { shop, detail, total } }) => (
//   // let { shop, detail, total } = data;
//   // console.log("shop", shop);
//   <View>
//     <Text>,,,{shop.name}</Text>
//     {detail.map(goods => (
//       <GoodsItem key={goods.id} goods={goods} />
//     ))}
//     <Text>
//       {total.num} {total.price}
//     </Text>
//   </View>
// );
// const Summary = ({ total }) => <View>summary</View>;

const Cart = ({ isLogin, shoppingCart, dispatch }) => {
  // console.log("connected", isLogin, shoppingCart);
  const [isEmpty, setIsEmpty] = useState(true);
  const [isOpened, setIsOpened] = useState(false);
  const [action, setAction] = useState({
    // args:{},
    exe: () => new Promise((resolve, reject) => {})
  });
  useEffect(() => {
    setIsEmpty(
      !(shoppingCart && shoppingCart.total && shoppingCart.total.num > 0)
    );
  }, [(shoppingCart || { total: {} }).total]);

  const onChange = {
    isOk: true,
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
    addGoods: ({ cartid, spu, num }) => {
      console.log("addGoods", { cartid, spu, num });
      setAction({
        exe: () =>
          new Promise(() => {
            // let cartItem = {
            //   buyNum: num,
            //   goodsId: String(spu)
            // };
            // let params: ShoppingCartItem = api.getShoppingCartParam(cartItem);
          })
      });
    },
    delGoods: cartid => {
      console.log("delGoods", cartid);
      setAction({
        exe: () =>
          new Promise(() => {
            api.cartDel([cartid], dispatch);
          })
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
      exe: () => new Promise((resolve, reject) => {})
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
            closeOnClickOverlay
            // title="标题"
            cancelText="取消"
            confirmText="确认"
            // onClose={this.handleClose}
            onCancel={() => resetAction()}
            onConfirm={() => handleConfirm()}
            content="R U SURE?"
          />
          {shoppingCart.data.map(data => (
            <CartGroup data={data} callback={onChange} key={data.shop.id} />
          ))}
          <View>
            <View>
              <Text>商品数量</Text>
              <Text>{shoppingCart.total.num}</Text>
            </View>
            <View>
              <Text>总价</Text>
              <CPrice retail={shoppingCart.total.price}></CPrice>
            </View>
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
