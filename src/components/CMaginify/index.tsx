import Taro, { useState } from "@tarojs/taro";
import { View, Text, Swiper, SwiperItem, Image } from "@tarojs/components";
import "./index.scss";
import { ITypeImageItem } from "@/pages/detail/lib";
import { jump, isWeapp } from "@/utils/lib";

let autoplay = {
  enabled: true,
  delay: 3000,
  waitForTransition: true,
  disableOnInteraction: true,
  stopOnLastSlide: false,
  reverseDirection: true
};
export default function Gallery({
  data = [],
  circular = true
}: // stared = false
{
  data: ITypeImageItem[];
  stared: boolean;
  circular: boolean;
  [key: string]: any;
}) {
  const [current, setCurrent] = useState(0);
  const [stared, setStared] = useState(false);

  const handleChange = e => {
    const { current } = e.detail;
    setCurrent(current);
  };

  return (
    <View className="cMaginify">
      <Swiper
        className="item-gallery__swiper"
        onChange={handleChange}
        indicatorColor="#fff"
        indicatorActiveColor="#b98a4e"
        indicatorDots
        autoplay={autoplay}
        params={{ autoplay }}
        circular={circular}
      >
        {data.map(item => (
          <SwiperItem key={item.id} className="item-gallery__swiper-item">
            <Image
              className="item-gallery__swiper-item-img"
              src={item.img500}
            />
          </SwiperItem>
        ))}
      </Swiper>
      <View className="item-gallery__indicator">
        <Text className="item-gallery__indicator-txt">
          {`${current + 1}/${data.length}`}
        </Text>
      </View>
      {!isWeapp && (
        <View className="item-gallery__back">
          <View
            className="item-gallery__action__item"
            onClick={() => {
              Taro.navigateBack();
            }}
          >
            <View
              className="at-icon at-icon-chevron-left"
              style={{ marginLeft: "-4px" }}
            ></View>
          </View>
        </View>
      )}
      <View className="item-gallery__action">
        <View
          className="item-gallery__action__item"
          onClick={() => {
            setStared(!stared);
            Taro.showToast({ title: `${stared ? "取消" : ""}收藏成功` });
          }}
        >
          <View className={`at-icon at-icon-star${stared ? "-2" : ""}`}></View>
        </View>
        <View
          className="item-gallery__action__item"
          onClick={() => {
            jump({
              url: "/pages/index/index"
            });
          }}
        >
          <View className="at-icon at-icon-home" />
        </View>
      </View>
    </View>
  );
}
