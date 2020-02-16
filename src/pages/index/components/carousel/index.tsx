import Taro from "@tarojs/taro";
import { Swiper, SwiperItem, Image } from "@tarojs/components";
import "./index.scss";
import { ICarouselItem } from "@/services/common";
import { jump } from "@/utils/lib";

export default ({ data = [] }: { data: ICarouselItem[] }) => (
  <Swiper
    className="carousel"
    autoplay
    indicatorDots
    indicatorActiveColor="#b98a4e"
    style="height:300px;"
  >
    {data.map((item: ICarouselItem) => (
      <SwiperItem
        key={item.id}
        className="carousel_item"
        onClick={() => {
          jump(item.href);
        }}
      >
        <Image className="carousel_item_img" src={item.img} />
      </SwiperItem>
    ))}
  </Swiper>
);
