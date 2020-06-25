// import Taro from "@tarojs/taro";
import from './index.scss';
import { View, Image } from "@tarojs/components";
import { SECKILL } from '@/utils/api';
import { CEmpty } from '@/components';
import useFetch from '@/components/hooks/useFetch';
// import Countdown, { TFormatRender } from '@/components/CountDown';
import CouponList from './components/CouponList';
import * as moment from 'moment';

export interface IPropItem {
  id: string | number;
  data?: string;
  hour: string;
  title?: string | number;
  [key: string]: any;
}

// const ClockItem = ({ time }: { time: string }) => {
//   time = time.padStart(2, '0');
//   return (
//     <>
//       {time.split('').map((item, idx) => (
//         <div key={idx} className={styles.timeItem} style={{ marginRight: 10 }}>
//           <div className={styles.time} />
//           <div className={styles.text}>{item}</div>
//         </div>
//       ))}
//     </>
//   );
// };

// export const renderClock: TFormatRender = res => {
//   let [hour, minute, second] = res.split(' ');
//   return (
//     <div className={styles.clockWrap}>
//       <ClockItem time={hour} />
//       <span>:</span>
//       <ClockItem time={minute} />
//       <span>:</span>
//       <ClockItem time={second} />
//     </div>
//   );
// };

const handleSchedule = data => {
  // console.log('handleScheduel', data);
  let bannerImg = {};
  try {
    bannerImg = {
      img: data.webSlider[0].webSliderJsonMap.sliderPic[0].imageUrl,
      href: '/detail/1',
    };
  } catch (err) {
    console.log(err);
  }
  let list = {};
  try {
    list = data.seckillScheduleList.map(item => ({
      id: item.scheduleId,
      data: moment().isSame(item.startTime, 'day') ? '今日' : moment(item.startTime).format('D日'),
      hour: moment(item.startTime).format('HH:mm'),
      // title: item.scheduleStateText,
      state: { value: item.scheduleState, text: item.scheduleStateText },
    }));
  } catch (err) {
    console.log(err);
  }
  return { list, current: data.seckillSchedule, bannerImg };
};

const LimitBuy = () => {
  const { data } = useFetch({
    param: { ...(SECKILL.list as {}) },
    callback: data => handleSchedule(data),
  });
  let { list, current, bannerImg } = data || {};
  return list && current ? (
    <View className='limit'>
      {/* <div className={styles.header}>
        秒杀专场
        <span className={styles.rest}>本场剩余</span>
        <div className={styles.countdown}>
          <Countdown
            title=""
            value={current.endTime}
            format="H m s"
            formatRender={renderClock}
            // className={classNames(styles.countdown, styles.red)}
          />
        </div>
      </div> */}
      {/* <CImgCard data={bannerImg} style={{ width: 1460, height: 402 }} /> */}
      {bannerImg && <Image src={bannerImg.img}/>}
      {/* <BuyTime /> */}
      <CouponList id={current.scheduleId} list={list} />
    </View>
  ) : (
    <CEmpty type="goods" />
  );
};
export default LimitBuy;
