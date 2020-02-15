import Taro from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import "./index.scss";
import CButton from "@/components/CButton";
import serviceIcon from "./service.svg";

// import * as cartDb from "@/utils/cartDb";
import * as lib from "@/utils/lib";
import { ShoppingCartItem, ICartItem, IConfirmCart } from "@/utils/cart";
import { connect } from "@tarojs/redux";
import { IGlobalModel } from "@/models/common";

import { IProductInfo, ISpecItem } from "../../lib";
import * as R from "ramda";

import { AtBadge } from "taro-ui";
import fail from "./fail";
// import success from "./success";

// 通过商品详情数据提取存储至购物车所需信息
export const getLocalStorageConfigByData: (
  data: IProductInfo,
  cartItem: ICartItem
) => IConfirmCart = (data, cartItem) => {
  let specValue = R.find(R.propEq("goodsId", Number(cartItem.goodsId)))(
    data.specValue || []
  );

  let specInfo: string[] = [];

  let img = "";
  if (specValue && data.specs) {
    specValue.specValueIds.forEach((spec: number) => {
      (data.specs || []).forEach((item: ISpecItem) => {
        let name = item.specName;
        let detail = R.find(R.propEq("specValueId", spec))(item.specValueList);
        if (detail) {
          specInfo.push(`${name}:${detail.specValueName}`);
          img = detail.imageSrc || img;
        }
      });
    });
  }

  return {
    type: lib.isLogin() ? "online" : "offline",

    shop: {
      id: data.shopId,
      name: data.shopName,
      saleService: data.saleService
    },
    spuid: Number(data.id),
    id: Number(cartItem.goodsId),
    name: data.title,
    spec: specInfo.join(","),
    price: Number(data.price),
    num: Number(cartItem.buyNum),
    valid: true,
    storage: data.number,
    img: img || data.img,
    totalPrice: 0,
    unitName: data.unitName
  };
};

const checkTime = data => {
  if (!data.goodsSaleTime) {
    return true;
  }
  let check = lib.checkSaleTimeToday(data.goodsSaleTime.week);
  if (!check) {
    fail("此商品不在开放销售的时间窗口中");
    return false;
  }
  return true;
};

const DetailAction = ({
  data: state,
  goodsnum,
  dispatch,
  isLogin,
  shoppingCart
}) => {
  // 小程序中处理不了data||{}
  // 在组件还未载入时，小程序会在运行时加载组件，同时传入的所有数据：data/goodsnum均为undefined

  let data = state || {};

  const addToCart = (directBuy: boolean = false) => {
    // 暂时只调试在线购物车，离线购物车暂不对接
    if (!isLogin) {
      lib.jump({
        url: "/pages/login/index"
      });
      fail("请先登录后添加购物车");
      return;
    }

    let status = checkTime(data);
    if (!status) {
      return;
    }
    if (goodsnum > data.number) {
      fail("数量超出了限制");
      return;
    }

    // let cartItem = {
    //   buyNum: goodsnum,
    //   goodsId: data.goodsId || data.id
    // };

    // // 添加购物车
    // let params: ShoppingCartItem = cartDb.getShoppingCartParam(cartItem);

    // // 需要立即购买的商品信息；
    // const cartConfirm = getLocalStorageConfigByData(data, cartItem);

    // // 立即购买
    // if (directBuy) {
    //   cartDb.addConfirmCart(dispatch, [cartConfirm]);
    //   Taro.navigateTo({ url: "/pages/order/confirm/index" });
    //   return;
    // }

    // // 加购物车
    // cartDb
    //   .cartAdd(params)
    //   .then(() => {
    //     success("添加购物车成功");
    //     cartDb.setShoppingCart(cartConfirm, dispatch);
    //   })
    //   .catch(err => {
    //     fail(`出错啦：${err.message}！`);
    //   });
  };

  return (
    <View className="detail-action">
      <View className="icons">
        <Image src={serviceIcon} className="icon" />
        <AtBadge value={shoppingCart.total.num} maxValue={99} className="icon">
          <View
            className="at-icon at-icon-shopping-cart"
            style="font-size:24px;"
            onClick={() => {
              lib.jump({
                url: "/pages/cart/cart"
              });
            }}
          />
        </AtBadge>
      </View>
      <View className="action">
        <View className="btn">
          <CButton
            theme="blackgardient"
            disabled={data.number === 0}
            onClick={addToCart}
            size="small"
            round={false}
          >
            加入购物车
          </CButton>
        </View>
        <View className="btn">
          <CButton
            theme="gardient"
            size="small"
            disabled={!data.canBuy}
            round={false}
            onClick={() => {
              addToCart(true);
            }}
          >
            立即购买
          </CButton>
        </View>
      </View>
    </View>
  );
};

export default connect(
  ({ common: { isLogin, shoppingCart } }: IGlobalModel) => ({
    isLogin,
    shoppingCart
  })
)(DetailAction as any);
