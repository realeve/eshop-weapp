import Taro, { useRouter } from "@tarojs/taro";
import { connect } from "@tarojs/redux";

import { API } from "@/utils/setting";
import { handleSubscribe, ISubscribe } from "./db";
import { View, Text, Image, Swiper, SwiperItem } from "@tarojs/components"; // , Swiper, SwiperItem
import "./index.scss";
import SpecialAction from "./components/Actions";
import { jump } from "@/utils/lib";
import Skeleton from "taro-skeleton";
import useFetch from "@/components/hooks/useFetch";
// import * as R from "ramda";
// import { CSwiperItem, CSwiper } from "@/components/";

import CSwiper from "@/components/swiper/index";
import CSwiperItem from "@/components/swiper/item";

const isWEB = Taro.getEnv() === Taro.ENV_TYPE.WEB;

interface IProps {
  [key: string]: any;
}
const Special = ({ dispatch }: IProps) => {
  const {
    params: { id: specialId }
  } = useRouter();
  const { data: subscribe, loading } = useFetch<ISubscribe>({
    param: { url: `${API.SP_SUBSCRIBER_INFO}/${specialId}` },
    callback: e => handleSubscribe(e, dispatch),
    valid: () => specialId > "0"
  });
  console.log(loading, subscribe);

  return (
    <View className="special_page">
      {/* web 端 */}
      {isWEB && subscribe && (
        <Swiper
          className="swiper_card"
          circular
          autoplay
          interval={30000}
          indicatorDots
          indicatorColor="#999"
          indicatorActiveColor="#b98a4e"
          displayMultipleItems={1.2}
        >
          {subscribe.thumbList.map((item, id) => (
            <SwiperItem key={item}>
              <Image
                className="swiper_img"
                src={item}
                onClick={() => {
                  jump({
                    url: "/pages/special/detail/index",
                    payload: {
                      id,
                      specialId
                    }
                  });
                }}
              />
            </SwiperItem>
          ))}
        </Swiper>
      )}

      {!isWEB && subscribe && (
        <Swiper
          className="swiper_card"
          circular
          autoplay
          interval={3000}
          indicatorDots
          indicatorColor="#999"
          indicatorActiveColor="#b98a4e"
          // displayMultipleItems={1.2}
        >
          {subscribe.thumbList.map((item, id) => (
            <SwiperItem key={item}>
              <Image
                className="swiper_imgWeapp"
                src={item}
                onClick={() => {
                  jump({
                    url: "/pages/special/detail/index",
                    payload: {
                      id,
                      specialId
                    }
                  });
                }}
              />
            </SwiperItem>
          ))}
        </Swiper>
      )}

      <Skeleton loading={loading} row={2} avatar>
        <SpecialAction data={subscribe || {}} />
      </Skeleton>
    </View>
  );
};

Special.config = {
  navigationBarTitleText: "最新预约"
};

export default connect(({ common }) => ({
  user: common.user
}))(Special as any);
