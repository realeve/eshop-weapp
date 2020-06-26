import Taro, { useState, useEffect } from "@tarojs/taro";
import useFetch from "@/components/hooks/useFetch";
import { CEmpty } from "@/components/";
import { SECKILL } from "@/utils/api";
import "./index.scss";
import CouponItem from "../CouponItem";
import BuyTime from "../BuyTime";
import * as moment from "dayjs";
import { View, ScrollView, Text } from "@tarojs/components";
import { AtCountdown } from "taro-ui";
import { getDhms, IHms } from "@/pages/user/order/components/CountTime";

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

const CouponList: (prop: IPropData) => React.ReactElement = ({
  id,
  list,
  current: currentData
}) => {
  const [current, setCurrent] = useState(id);

  const { data } = useFetch({
    param: {
      ...(SECKILL.detail as {}),
      data: { page: 1, scheduleId: current }
    },
    callback: data => handleDetail(data)
  });

  const [dateParam, setDateParam] = useState<IHms | {}>({});
  useEffect(() => {
    let props: IHms = getDhms(currentData.endTime) as IHms;
    setDateParam(props);
  }, [JSON.stringify(currentData)]);

  return (
    <View className="coupon_wrap">
      {list && (
        <BuyTime limitTime={list} onClick={setCurrent} current={current} />
      )}
      <ScrollView scrollY className="popular">
        <View className="at-divider">
          <View className="at-divider__content">
            {current < id ? (
              "活动已结束"
            ) : current > id ? (
              "精彩内容即将开始"
            ) : (
              <View className="countdown">
                <Text className="countdown_title">本场还剩</Text>
                <AtCountdown {...dateParam} />
              </View>
            )}
          </View>
          <View className="at-divider__line"></View>
        </View>
        {data && data.dist && data.dist.length > 0 ? (
          data.dist.map(item => (
            <CouponItem
              state={item.state}
              current={current}
              data={item}
              key={item.id}
            />
          ))
        ) : (
          <CEmpty type="goods" style={{ height: "calc(100vh - 200px)" }} />
        )}
      </ScrollView>
    </View>
  );
};
export default CouponList;
