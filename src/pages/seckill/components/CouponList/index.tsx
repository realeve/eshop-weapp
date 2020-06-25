import Taro, { useState } from "@tarojs/taro";
import useFetch from "@/components/hooks/useFetch";
import { CEmpty } from "@/components/";
import { SECKILL } from "@/utils/api";
import "./index.scss";
import CouponItem from "../CouponItem";
import BuyTime from "../BuyTime";
import { IPropItem } from "../../limit";
import * as moment from "dayjs";
import { View } from "@tarojs/components";

interface IPropData {
  id: string | number;
  [key: string]: any;
}

// 电子优惠券信息
const initData = [
  {
    id: 1,
    img: "/sport/goods1.png",
    hour: "10:00",
    title:
      "悦之品 海鲜礼盒提货券 礼品卡送礼 海鲜礼券 电子券 电子券电子券电子券",
    tip: "礼品企业团购员工福利",
    total: "200",
    rest: "0",
    price: "1245",
    counter: "1233"
  },
  {
    id: 2,
    img: "/sport/goods1.png",
    hour: "11:00",
    title: "悦之品 海鲜礼盒提货券 礼品卡送礼 海鲜礼券 电子券",
    tip: "礼品企业团购员工福利",
    total: "200",
    rest: 0,
    price: "1245",
    counter: "1233"
  },
  {
    id: 3,
    img: "/sport/goods1.png",
    hour: "10:00",
    title: "悦之品 海鲜礼盒提货券 礼品卡送礼 海鲜礼券 电子券",
    tip: "礼品企业团购员工福利",
    total: "200",
    rest: "80",
    price: "1245",
    counter: "1233"
  },
  {
    id: 4,
    img: "/sport/goods1.png",
    hour: "11:00",
    title: "悦之品 海鲜礼盒提货券 礼品卡送礼 海鲜礼券 电子券",
    tip: "礼品企业团购员工福利",
    total: "200",
    rest: "80",
    price: "1245",
    counter: "1233"
  },
  {
    id: 5,
    img: "/sport/goods1.png",
    hour: "12:00",
    title: "悦之品 海鲜礼盒提货券 礼品卡送礼 海鲜礼券 电子券",
    tip: "礼品企业团购员工福利",
    total: "200",
    rest: "30",
    price: "1245",
    counter: "1233"
  },
  {
    id: 6,
    img: "/sport/goods1.png",
    hour: "12:00",
    title: "悦之品 海鲜礼盒提货券 礼品卡送礼 海鲜礼券 电子券",
    tip: "礼品企业团购员工福利",
    total: "200",
    rest: "0",
    price: "1245",
    counter: "1233"
  },
  {
    id: 7,
    img: "/sport/goods1.png",
    hour: "13:00",
    title: "悦之品 海鲜礼盒提货券 礼品卡送礼 海鲜礼券 电子券",
    tip: "",
    total: "200",
    rest: "30",
    price: "1245",
    counter: "1233"
  },
  {
    id: 8,
    img: "/sport/goods1.png",
    hour: "13:00",
    title: "悦之品 海鲜礼盒提货券 礼品卡送礼 海鲜礼券 电子券",
    tip: "",
    total: "200",
    rest: "30",
    price: "1245",
    counter: "1233"
  },
  {
    id: 9,
    img: "/sport/goods1.png",
    hour: "14:00",
    title: "悦之品 海鲜礼盒提货券 礼品卡送礼 海鲜礼券 电子券",
    tip: "",
    total: "200",
    rest: "30",
    price: "1245",
    counter: "1233"
  },
  {
    id: 10,
    img: "/sport/goods1.png",
    hour: "15:00",
    title: "悦之品 海鲜礼盒提货券 礼品卡送礼 海鲜礼券 电子券",
    tip: "",
    total: "200",
    rest: "30",
    price: "1245",
    counter: "1233"
  },
  {
    id: 11,
    img: "/sport/goods1.png",
    hour: "16:00",
    title: "悦之品 海鲜礼盒提货券 礼品卡送礼 海鲜礼券 电子券",
    tip: "",
    total: "200",
    rest: "30",
    price: "1245",
    counter: "1233"
  }
];
const limitTime: IPropItem[] = [
  {
    id: 1,
    data: "28日",
    hour: "10:00",
    title: "end"
  },
  {
    id: 2,
    data: "28日",
    hour: "11:00",
    title: "end"
  },
  {
    id: 3,
    data: "28日",
    hour: "12:00",
    title: "start"
  },
  {
    id: 4,
    data: "28日",
    hour: "13:00",
    title: "selling"
  },
  {
    id: 5,
    data: "28日",
    hour: "14:00",
    title: "before"
  },
  {
    id: 6,
    data: " ",
    hour: "16:00",
    title: "before"
  },
  {
    id: 7,
    data: "28日",
    hour: "17:00",
    title: "before"
  },
  {
    id: 8,
    data: "28日",
    hour: "18:00",
    title: "before"
  },
  {
    id: 9,
    data: "28日",
    hour: "19:00",
    title: "before"
  },
  {
    id: 10,
    data: "28日",
    hour: "20:00",
    title: "before"
  }
];

const handleDetail = data => {
  // console.log('detail', data);
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
  let { dist } = data || {};

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
    <View>
      {list && (
        <BuyTime limitTime={list} onClick={setCurrent} current={current} />
      )}
      <View className="popular">
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
      </View>
    </View>
  );
};
export default CouponList;
