import Taro, { useRouter } from "@tarojs/taro";
import { connect } from "@tarojs/redux";

import { API } from "@/utils/setting";
import { useFetch } from "@/components/";
import { handleSubscribe } from "./db";
import { Swiper, SwiperItem, View, Image } from "@tarojs/components";
import "./index.scss";
import SpecialAction from "./components/Actions";
import { jump } from "@/utils/lib";

interface IProps {
  [key: string]: any;
}
const Special = ({ dispatch }: IProps) => {
  const {
    params: { id: specialId }
  } = useRouter();
  const { data: subscribe, loading } = useFetch({
    param: { url: `${API.SP_SUBSCRIBER_INFO}/${specialId}` },
    callback: e => {
      let res = handleSubscribe(e);
      dispatch({
        type: "special/setStore",
        payload: {
          imgList: res.imgList
        }
      });
      return res;
    },
    valid: () => specialId > "0"
  });

  // 加载中
  if (loading) {
    Taro.showLoading();
  } else {
    Taro.hideLoading();
  }

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
          subscribe.thumbList.map((item, id) => (
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
      <SpecialAction />
    </View>
  );
};

Special.config = {
  navigationBarTitleText: "最新预约"
};

export default connect(({ common }) => ({
  user: common.user
}))(Special as any);
