import Taro, { useState } from "@tarojs/taro";
import useFetch from "@/components/hooks/useFetch";
import { CEmpty } from "@/components/";
import { SECKILL } from "@/utils/api";
import "./index.scss";
import CouponItem from "../CouponItem";
import BuyTime from "../BuyTime";
import * as moment from "dayjs";
import { View, ScrollView } from "@tarojs/components";

interface IPropData {
  id: string | number;
  [key: string]: any;
}

export const handleDetail = data => {
  let dist = [];
  try {
    dist = data.seckillGoodsCommonList.map(item => ({
      id: item.commonId,
      img: item.imageSrc,
      hour: moment(item.startTime).format("HH:mm"),
      title: item.goodsName,
      tip: "",
      total: item.goodsStorage,
      rest: item.salesPercentage,
      price: item.seckillGoodsPrice,
      counter: item.goodsPrice,
      state: { value: item.scheduleState, text: item.scheduleStateText }
    }));
  } catch (err) {
    console.error(err);
  }
  return { dist };
};

const CouponList: (prop: IPropData) => React.ReactElement = ({ id, list }) => {
  // const [currentHour, setCurrentHour] = useState(new Date().getHours() + ':00');
  // const [state, setstate] = useState(0);
  const [current, setCurrent] = useState(id);

  const { data } = useFetch({
    param: {
      ...(SECKILL.detail as {}),
      data: { page: 1, scheduleId: current }
    },
    callback: data => handleDetail(data)
  });

  // 获取限购时间段数据
  // const getdata = (hour: string) => {
  //   let nextState = R.clone(initData);
  //   if (nextState.length == 0) {
  //     return;
  //   }
  //   nextState = nextState.filter(item => item.hour == hour);
  //   // setDist(nextState);
  // };

  // useEffect(() => {
  //   getdata(currentHour);
  // }, [currentHour]);

  return (
    <View className="coupon_wrap">
      {list && (
        <BuyTime limitTime={list} onClick={setCurrent} current={current} />
      )}
      <ScrollView scrollY className="popular">
        {data && data.dist ? (
          (data.dist || []).map(item => (
            <CouponItem
              state={item.state}
              current={current}
              data={item}
              key={item.id}
            />
          ))
        ) : (
          <CEmpty type="goods" />
        )}
      </ScrollView>
    </View>
  );
};
export default CouponList;
