import Taro, { useRouter } from "@tarojs/taro";
import { connect } from "@tarojs/redux";

import { API } from "@/utils/setting";
import { useFetch } from "@/components/";
import { handleSubscribe } from "./db";
import { Swiper, SwiperItem, View, Image } from "@tarojs/components";
import "./index.scss";
import SpecialAction from "./components/Actions";

interface IProps {
  [key: string]: any;
}
const Special = (props: IProps) => {
  const {
    params: { id: specialId }
  } = useRouter();
  const { data: subscribe, loading, error, reFetch } = useFetch({
    param: { url: `${API.SP_SUBSCRIBER_INFO}/${specialId}` },
    callback: handleSubscribe,
    valid: () => specialId > "0"
  });
  console.log(subscribe);

  return (
    <View className="special-page">
      <Swiper
        className="main"
        indicatorColor="#999"
        circular
        autoplay
        indicatorDots
        indicatorActiveColor="rgb(178, 42, 49)"
      >
        {subscribe &&
          subscribe.thumbList.map(item => (
            <SwiperItem key={item}>
              <Image className="img" src={item} />
            </SwiperItem>
          ))}
      </Swiper>
      <SpecialAction />
    </View>
  );
};

Special.config = {
  navigationBarTitleText: "最新预约"
};

export default connect(({ common }) => common)(Special as any);
