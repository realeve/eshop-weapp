import Taro from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import "./index.scss";
import { CButton } from "@/components";
import serviceIcon from "./service.svg";

import * as cartDb from "@/utils/cartDB";
import * as lib from "@/utils/lib";
import { ShoppingCartItem, ICartItem } from "@/utils/order";
import { connect } from "@tarojs/redux";
import { IGlobalModel } from "@/models/common";

import { IProductInfo, ISpecItem } from "../../lib";
import * as R from "ramda";

// 通过商品详情数据提取存储至购物车所需信息
export const getLocalStorageConfigByData: (
  data: IProductInfo,
  cartItem: ICartItem
) => cartDb.ILocalStorageCartDetail = (data, cartItem) => {
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
    shop: {
      id: data.shopId,
      name: data.shopName
    },
    type: lib.isLogin() ? "online" : "offline",
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

const fail = title =>
  Taro.showToast({
    title,
    icon: "none"
  });

const success = title => Taro.showToast({ title });

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

const DetailAction = ({ data, goodsnum, dispatch, isLogin }) => {
  console.log(data);
  let cartItem = {
    buyNum: goodsnum,
    goodsId: data.goodsId || data.id
  };

  const addToCart = (addToCart: boolean = false) => {
    // 暂时只调试在线购物车，离线购物车暂不对接
    if (!isLogin) {
      Taro.navigateTo({
        url: "/pages/login"
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

    // 添加购物车
    let params: ShoppingCartItem = cartDb.getShoppingCartParam(cartItem);

    // 加购物车
    cartDb
      .cartAdd(params)
      .then(() => {
        success("添加购物车成功");
        cartDb.setShoppingCart(
          getLocalStorageConfigByData(data, cartItem),
          dispatch
        );
      })
      .catch(err => {
        fail(`出错啦：${err.message}！`);
      });
  };

  return (
    <View className="detail-action">
      <View className="icons">
        <Image src={serviceIcon} className="icon" />
        <View className="at-icon at-icon-shopping-cart icon"></View>
      </View>
      <View className="action">
        <CButton
          className="btn"
          theme="blackgardient"
          disabled={data.number === 0}
          onClick={addToCart}
        >
          加入购物车
        </CButton>
        <CButton
          className="btn"
          theme="gardient"
          disabled={!data.canBuy}
          onClick={() => {
            Taro.showToast({
              title: "立即购买对接"
            });
          }}
        >
          立即购买
        </CButton>
      </View>
    </View>
  );
};

export default connect(({ common: { isLogin } }: IGlobalModel) => ({
  isLogin
}))(DetailAction as any);
