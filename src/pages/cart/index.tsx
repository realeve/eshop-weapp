import Taro, { useEffect, useState } from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import { ICartModel } from "./model";
import { Dispatch } from "redux";
import "./index.scss";
import { CEmpty, CPrice } from "@/components";
import { IGlobalModel } from "@/models/common";
import CartGroup from "./components/CCartGroup";

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
    addGoods: (spu, num) => {
      console.log("addGoods", spu, num);
    },
    delGoods: spu => {
      console.log("delGoods", spu);
    }
  };
  return (
    <View className="cart-page">
      {isEmpty ? (
        <CEmpty type="cart" />
      ) : (
        <View>
          {shoppingCart.data.map(data => (
            <CartGroup data={data} callback={onChange} key={data.shop.name} />
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
