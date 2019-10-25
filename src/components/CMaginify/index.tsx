import Taro, { useState } from "@tarojs/taro";
import { View, Text, Swiper, SwiperItem, Image } from "@tarojs/components";
import "./index.scss";
import { ITypeImageItem } from "@/pages/detail/lib";

export default function Gallery({
  data = []
}: // stared = false
{
  data: ITypeImageItem[];
  stared: boolean;
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
        autoplay
        circular
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
        {/* <View className="item-gallery__action__item">
          <View className="at-icon" style="margin-top:-10px;">
            ...
          </View>
        </View> */}
      </View>
    </View>
  );
}
