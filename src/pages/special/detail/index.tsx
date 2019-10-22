import Taro, { useRouter } from "@tarojs/taro";

import { Swiper, SwiperItem, View, Image } from "@tarojs/components";
import "./index.scss";
import { connect } from "@tarojs/redux";

interface IProps {
  [key: string]: any;
}
const SpecialDetail = (props: IProps) => {
  const {
    params: { id }
  } = useRouter();
  console.log(props);

  return <View className="special-page__detail">d {id}</View>;
};

SpecialDetail.config = {
  navigationBarTitleText: "最新预约-详情"
};

export default connect(({ special }) => ({
  imgList: special.imgList
}))(SpecialDetail as any);
