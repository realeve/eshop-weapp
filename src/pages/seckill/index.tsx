import Taro from "@tarojs/taro";
import "./index.scss";
import { View, Image } from "@tarojs/components";
import { SECKILL } from "@/utils/api";
import { CEmpty } from "@/components";
import useFetch from "@/components/hooks/useFetch";
import CouponList from "./components/CouponList";
import * as moment from "dayjs";

export interface IPropItem {
  id: string | number;
  data?: string;
  hour: string;
  title?: string | number;
  [key: string]: any;
}

const handleSchedule = data => {
  // console.log('handleScheduel', data);
  let bannerImg = {};
  try {
    bannerImg = {
      img: data.webSlider[0].webSliderJsonMap.sliderPic[0].imageUrl,
      href: "/detail/1"
    };
  } catch (err) {
    console.log(err);
  }
  let list = {};
  try {
    list = data.seckillScheduleList.map(item => ({
      id: item.scheduleId,
      data: moment().isSame(item.startTime, "day")
        ? "今日"
        : moment(item.startTime).format("D日"),
      hour: moment(item.startTime).format("HH:mm"),
      // title: item.scheduleStateText,
      state: { value: item.scheduleState, text: item.scheduleStateText }
    }));
  } catch (err) {
    console.log(err);
  }
  return { list, current: data.seckillSchedule, bannerImg };
};

const LimitBuy = () => {
  const { data } = useFetch({
    param: { ...(SECKILL.list as {}) },
    callback: data => handleSchedule(data)
  });
  let { list, current, bannerImg } = data || {};
  return list && current ? (
    <View className="limit">
      {bannerImg && (
        <Image className="img" src={bannerImg.img} mode="scaleToFill" />
      )}
      <CouponList id={current.scheduleId} list={list} />
    </View>
  ) : (
    <CEmpty type="goods" />
  );
};
export default LimitBuy;
