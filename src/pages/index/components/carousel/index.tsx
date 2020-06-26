import Taro from "@tarojs/taro";
import { Swiper, SwiperItem, Image } from "@tarojs/components";
import "./index.scss";
import { ICarouselItem } from "@/services/common";
import { jump } from "@/utils/lib";

let { windowWidth }: Taro.getSystemInfoSync.Result = Taro.getSystemInfoSync();

// https://github.com/nolimits4web/swiper/blob/149daf5e98070ce3b15061f5bfb240f1e8997748/src/components/autoplay/autoplay.js#L113
// autoplay在h5中的参数配置

let autoplay = {
  enabled: true,
  delay: 3000,
  waitForTransition: true,
  disableOnInteraction: true,
  stopOnLastSlide: false,
  reverseDirection: true
};

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
  ratio?: string | number;
}) => {
  return (
    <Swiper
      className="carousel"
      autoplay={autoplay}
      params={{ autoplay }}
      indicatorDots
      indicatorActiveColor="#b98a4e"
      style={{
        marginBottom: "8px",
        height: `${Number(ratio) * windowWidth}px`
      }}
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
