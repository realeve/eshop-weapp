import Taro, { useRouter, useState } from "@tarojs/taro";
import { connect } from "@tarojs/redux";

import { API } from "@/utils/setting";
import { useFetch } from "@/components/";
import { handleSubscribe } from "./db";
import { Swiper, SwiperItem, View, Image } from "@tarojs/components";
import "./index.scss";
import SpecialAction from "./components/Actions";
import { jump } from "@/utils/lib";
import Skeleton from "taro-skeleton";

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

  // const [current, setCurrent] = useState(1);

  return (
    <View className="special-page">
      <Swiper
        className="swiperCard"
        circular
        autoplay
        indicatorDots
        indicatorActiveColor="#b98a4e"
        // current={current}
        // onChange={e => setCurrent(e.detail.current)}
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
      <Skeleton loading={loading} row={2} avatar>
        <SpecialAction />
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
