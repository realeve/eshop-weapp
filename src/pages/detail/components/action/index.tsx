import Taro from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import "./index.scss";
import { CButton } from "@/components";
import serviceIcon from "./service.svg";

import * as cartDb from "@/utils/order/cartDB";
import * as lib from "@/utils/lib";

const fail = title =>
  Taro.showToast({
    title,
    icon: "none"
  });

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

const DetailAction = ({ data, goodsnum }) => {
  console.log(data);
  let buyData = [
    {
      buyNum: goodsnum,
      goodsId: data.goodsId || data.id
    }
  ];

  const addToCart = () => {
    let status = checkTime(data);
    if (!status) {
      return;
    }
    if (goodsnum > data.number) {
      fail("数量超出了限制");
      return;
    }

    Taro.showToast({
      title: "加入购物车对接"
    });
  };

  console.log(buyData);
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

export default DetailAction;
