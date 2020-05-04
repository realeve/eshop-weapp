import Taro from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import { AtRate } from "taro-ui";
import "./shop.scss";
import ImgStore from "@/pages/search/img/store.svg";

export default ({ rate, setRate }) => {
  return (
    rate && (
      <View className="shop">
        <View className="head">
          <Image src={ImgStore} className="logo" />
          店铺评分
        </View>
        <View className="at-input">
          <View className="at-input__container">
            <View className="at-input__title">描述相符：</View>
            <View className="at-input__input">
              <AtRate
                value={rate.description}
                onChange={description => {
                  setRate({ description });
                }}
              />
            </View>
          </View>
        </View>
        <View className="at-input">
          <View className="at-input__container">
            <View className="at-input__title">发货速度：</View>
            <View className="at-input__input">
              <AtRate
                value={rate.express}
                onChange={express => {
                  setRate({ express });
                }}
              />
            </View>
          </View>
        </View>
        <View className="at-input">
          <View className="at-input__container">
            <View className="at-input__title">服务态度：</View>
            <View className="at-input__input">
              <AtRate
                value={rate.service}
                onChange={service => {
                  setRate({ service });
                }}
              />
            </View>
          </View>
        </View>
      </View>
    )
  );
};
