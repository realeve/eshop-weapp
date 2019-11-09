import Taro, { useRouter } from "@tarojs/taro";
import { connect } from "@tarojs/redux";

import { API } from "@/utils/setting";
import { handleSubscribe, ISubscribe } from "./db";
import { View, Text, Image, Swiper } from "@tarojs/components";
import "./index.scss";
import SpecialAction from "./components/Actions";
import { jump } from "@/utils/lib";
import Skeleton from "taro-skeleton";
import useFetch from "@/components/hooks/useFetch";
// , CSwiperItem, CSwiper

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
    <View className="special-page">
      {/* {subscribe && (
        <CSwiper
          className="swiperCard"
          circular
          autoplay
          interval={1000}
          indicatorDots
          indicatorActiveColor="#b98a4e"
          displayMultipleItems={1.6}
        >
          {subscribe.thumbList.map((item, id) => (
            <CSwiperItem key={item}>
              <Image
                className="img"
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
            </CSwiperItem>
          ))}
        </CSwiper>
      )} */}
      <Skeleton loading={loading} row={2} avatar>
        <SpecialAction data={subscribe || {}} />
      </Skeleton>
      <Text>adfasdf{specialId}</Text>
    </View>
  );
};

Special.config = {
  navigationBarTitleText: "最新预约"
};

// export default Special;

export default connect(({ common }) => ({
  user: common.user
}))(Special as any);
