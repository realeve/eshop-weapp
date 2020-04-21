import Taro, { useEffect } from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import { ICartModel } from "./model";
import { Dispatch } from "redux";
import "./index.scss";
import { CEmpty, CPrice } from "@/components";
import { IGlobalModel } from "@/models/common";

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
  let isEmpty = !(
    shoppingCart &&
    shoppingCart.total &&
    shoppingCart.total.num > 0
  );
  return (
    <View className="cart-page">
      {isEmpty ? (
        <CEmpty type="cart" />
      ) : (
        <View>
          {shoppingCart.data.map(data => {
            let { shop, detail, total } = data;
            return (
              <View key={shop.id} className="shop-item">
                <Text className="shop-name">{shop.name}</Text>
                {detail.map(goods => (
                  <View key={goods.id} className="goods-item">
                    <Image
                      src={`${goods.img}?x-oss-process=image/resize,w_200`}
                      className="goods-img"
                    />
                    <View className="goods-desc">
                      <Text className="goods-name">{goods.name}</Text>
                      <View className="sub">
                        <Text className="label">单价</Text>
                        <Text className="value">{goods.price.toFixed(2)}</Text>
                      </View>
                      <View className="sub">
                        <Text className="label">数量</Text>
                        <Text className="value">{goods.num}</Text>
                      </View>
                      <View className="sub">
                        <Text className="label">小计</Text>
                        <Text className="value">
                          {goods.totalPrice.toFixed(2)}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))}
                <View className="shop-total">
                  <View>
                    <Text>数量</Text>
                    <Text>{total.num}</Text>
                  </View>
                  <View>
                    <Text>店铺小计</Text>
                    <Text>{total.price}</Text>
                  </View>
                </View>
              </View>
            );
          })}
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
