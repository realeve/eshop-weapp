import Taro, { useRouter } from "@tarojs/taro";
import { connect } from "@tarojs/redux";

import { API } from "@/utils/setting";
import { useFetch } from "@/components/";
import { handleSubscribe, ISubscribe } from "./db";
import { View, Image } from "@tarojs/components"; // Swiper,
import "./index.scss";
import SpecialAction from "./components/Actions";
import { jump } from "@/utils/lib";
import Skeleton from "taro-skeleton";
import { SwiperItem, Swiper } from "@/components/swiper/";

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

  return (
    <View className="special-page">
      {subscribe && (
        <Swiper
          className="swiperCard"
          circular
          autoplay
          interval={1000}
          indicatorDots
          indicatorActiveColor="#b98a4e"
          displayMultipleItems={1.6}
        >
          {subscribe.thumbList.map((item, id) => (
            <SwiperItem key={item}>
              <Image
                className="img"
                src={item}
                onClick={() => {
                  jump({
                    url: "/pages/special/detail",
                    payload: {
                      id
                    }
                  });
                }}
              />
            </SwiperItem>
          ))}
        </Swiper>
      )}
      <Skeleton loading={loading} row={2} avatar>
        <SpecialAction data={subscribe} />
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
