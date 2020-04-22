import Taro, { useEffect, useState } from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import { CEmpty } from "@/components";
import "./styles.scss";

const CGroup = ({ shop, detail, total }) => {
  console.log(",", shop, detail, total);
  return !shop ? (
    <CEmpty type="cart" />
  ) : (
    <View className="list">
      <Text className="shop-name">{shop.name}</Text>
      {detail &&
        detail.map(goods => (
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
                <Text className="value">{goods.totalPrice.toFixed(2)}</Text>
              </View>
            </View>
          </View>
        ))}
    </View>
  );
};

export default CGroup;
