import Taro from "@tarojs/taro";
import { View, Swiper, SwiperItem, Image, Text } from "@tarojs/components";
import "./index.scss";
import { CPrice } from "@/components";
import * as R from "ramda";
import DCard from "../card";
import { getWebpSuffix } from "@/services/common";
import { jump } from "@/utils/lib";

export default ({ data = [], title }) => (
  <DCard className="home-pin__wrap">
    {title && <View className="home-pin__title">{title}</View>}
    <Swiper
      className="home-pin__swiper"
      autoplay={{
        enabled: true,
        delay: 3000,
        waitForTransition: true,
        disableOnInteraction: true,
        stopOnLastSlide: false,
        reverseDirection: true
      }}
      indicatorDots
      indicatorActiveColor="#b98a4e"
    >
      {R.splitEvery(3, data).map((group, index) => (
        <SwiperItem key={index + ""} className="home-pin__swiper-item">
          {group.map(item => (
            <View
              key={item.commonId}
              className="home-pin__item"
              onClick={() => {
                jump({ url: "/pages/detail/index?id=" + item.commonId });
              }}
            >
              <Image
                mode="aspectFit"
                className="home-pin__item-img"
                src={(item.imageSrc || item.imageUrl) + getWebpSuffix()}
              />
              <View className="home-pin__item-info">
                <CPrice
                  retail={item.goodsPrice || item.appPrice0}
                  // retailStyle="font-size:16px;"
                  retailStyle={{ fontSize: "16px" }}
                />
                <Text className="goodsName">
                  {item.goodsName.length > 5
                    ? item.goodsName.slice(0, 5) + "..."
                    : item.goodsName}
                </Text>
              </View>
            </View>
          ))}
        </SwiperItem>
      ))}
    </Swiper>
  </DCard>
);
