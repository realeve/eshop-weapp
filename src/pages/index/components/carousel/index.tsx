import Taro from "@tarojs/taro";
import { Swiper, SwiperItem, Image } from "@tarojs/components";
import "./index.scss";
import { ICarouselItem } from "@/services/common";
import { jump } from "@/utils/lib";

let { windowWidth }: Taro.getSystemInfoSync.Result = Taro.getSystemInfoSync();

/**
 * @returns 首页组件
 * @param ratio 宽高比
 * @param data 数据列表
 *
 */
export default ({
  data = [],
  ratio = "0.47"
}: {
  data: ICarouselItem[];
  ratio?: string;
}) => {
  return (
    <Swiper
      className="carousel"
      autoplay
      indicatorDots
      indicatorActiveColor="#b98a4e"
      style={`margin-bottom:8px;height:${Number(ratio) * windowWidth}px`}
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
};
