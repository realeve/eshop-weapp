import Taro, { useEffect, useState } from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import { CEmpty, CPrice } from "@/components";
import "./styles.scss";
import { AtCheckbox, AtInputNumber, AtSwipeAction } from "taro-ui";
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

    let goods = R.clone(state.goods);
    if (goods.length === 0) {
      goods = R.repeat("0", detail.length);
    }
    let numbers = detail.map(g => g.num);
    let _state = R.clone(state);
    Object.assign(_state, { goods, numbers });
    setState(_state);
  }, [JSON.stringify(data || { detail: "" }.detail)]);

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
        goods = detail.map(g => g.cartId);
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

  return !shop ? (
    <CEmpty type="cart" />
  ) : (
    <View className="list">
      <AtCheckbox
        options={[{ label: (shop || {}).name, value: (shop || {}).id }]}
        selectedList={state.shop ? [state.shop] : []}
        onChange={changeShop.bind(this)}
      />
      {detail &&
        state &&
        state.goods.length === detail.length &&
        detail.map((goods, idx) => (
          <AtSwipeAction
            autoClose={true}
            key={goods.id}
            onClick={() => delGoods(goods.cartId)}
            options={[
              {
                text: "删除",
                style: {
                  backgroundColor: "#FF4949"
                }
              }
            ]}
          >
            <View className="goods-item">
              <View className="check">
                <AtCheckbox
                  options={[{ label: "", value: goods.cartId }]}
                  selectedList={[state.goods[idx]]}
                  onChange={() => changeGoods(idx, goods.cartId)}
                />
              </View>

              <Image
                src={`${goods.img}?x-oss-process=image/resize,w_200`}
                className="goods-img"
              />
              <View className="goods-desc">
                <Text className="goods-name">{goods.name}</Text>
                <View className="alignColumn">
                  {goods.spec.length > 0 && (
                    <View className="spec">{goods.spec}</View>
                  )}

                  <View className="sub alignRow">
                    <CPrice retail={goods.price} />
                    {/* <Text className="value">{goods.price.toFixed(2)}</Text> */}
                    <AtInputNumber
                      className="input"
                      min={1}
                      max={goods.storage || goods.num}
                      step={1}
                      value={state.numbers[idx]}
                      onChange={value =>
                        addGoods({
                          cartId: goods.cartId,
                          id: goods.id,
                          buyNum: value,
                          idx
                        })
                      }
                    />
                  </View>
                </View>
              </View>
            </View>
          </AtSwipeAction>
        ))}
    </View>
  );
};

export default CGroup;
