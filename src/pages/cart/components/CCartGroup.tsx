import Taro, { useEffect, useState } from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import { CEmpty } from "@/components";
import "./styles.scss";
import { AtCheckbox, AtInputNumber } from "taro-ui";
import * as R from "ramda";

export interface ICart {}
const CGroup = ({ data, callback }) => {
  let { shop, detail, total } = data || {};
  let {
    selectShop,
    deselectShop,
    selectGoods,
    deselectGoods,
    addGoods,
    delGoods
  } = callback || {};
  const [state, setState] = useState({ shop: 0, goods: [], numbers: [] });

  useEffect(() => {
    if (!data || !data.total || !(data.total.num > 0)) {
      return;
    }
    shop = data.shop;
    detail = data.detail;

    if (state.goods.length === detail.length) {
      return;
    }
    let goods = R.clone(state.goods);
    if (goods.length === 0) {
      goods = R.repeat("0", detail.length);
    }
    let numbers = detail.map(g => g.num);
    let _state = R.clone(state);
    Object.assign(_state, { goods, numbers });
    setState(_state);
  }, [JSON.stringify(data || { detail: "" }.detail)]);
  useEffect(() => {
    if (!callback) {
      return;
    }
    selectShop = callback.selectShop;
    deselectShop = callback.deselectShop;
    selectGoods = callback.selectGoods;
    deselectGoods = callback.deselectGoods;
    addGoods = callback.addGoods;
    delGoods = callback.delGoods;
  }, [(callback || {}).isOk]);

  const changeShop = value => {
    let _state = R.set(R.lensProp("shop"), !state.shop ? value[0] : 0, state);
    let goods = [];
    switch (_state.shop) {
      case 0:
        deselectShop(shop.id);
        goods = R.repeat("0", detail.length);
        break;

      default:
        selectShop(shop.id);
        goods = detail.map(g => g.id);
        break;
    }
    Object.assign(_state, { goods });
    setState(_state);
  };

  const changeGoods = (idx, value) => {
    let _state = R.clone(state);
    let goods = _state.goods;
    goods[idx] = goods[idx] > 0 ? "0" : value;
    let selectAll = goods.filter(g => g > 0).length === detail.length;
    Object.assign(_state, { shop: selectAll ? shop.id : 0, goods });
    setState(_state);
    switch (Number(goods[idx])) {
      case 0:
        deselectGoods(value);
        break;

      default:
        selectGoods(value);
        break;
    }
  };

  const changeNumbers = ({ cartid, spu, num }) => {
    // const changeNumbers = value => {
    console.log("change numbers", cartid, spu, num);
    addGoods({ cartid, spu, num });
  };

  return !shop ? (
    <CEmpty type="cart" />
  ) : (
    <View className="list">
      <AtCheckbox
        className="shop-name"
        options={[{ label: (shop || {}).name, value: (shop || {}).id }]}
        selectedList={state.shop ? [state.shop] : []}
        onChange={changeShop.bind(this)}
      />
      {detail &&
        state &&
        state.goods.length === detail.length &&
        detail.map((goods, idx) => (
          <View key={goods.id} className="goods-item">
            <AtCheckbox
              options={[{ label: "", value: goods.id }]}
              selectedList={[state.goods[idx]]}
              onChange={() => changeGoods(idx, goods.id)}
            />
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
                <AtInputNumber
                  min={0}
                  max={goods.storage || goods.num}
                  step={1}
                  value={state.numbers[idx]}
                  // onChange={changeNumbers.bind(this)}
                  onChange={value =>
                    changeNumbers({
                      cartid: goods.cartId,
                      spu: goods.id,
                      num: value
                    })
                  }
                />
                {/* <Text className="value">{goods.num}</Text> */}
              </View>
              <View className="sub">
                <Text className="label">小计</Text>
                <Text className="value">{goods.totalPrice.toFixed(2)}</Text>
              </View>
            </View>
          </View>
        ))}
    </View>
  );
};

export default CGroup;
