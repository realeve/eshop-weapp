import Taro from '@tarojs/taro';
import classNames from 'classnames';
import from './index.scss';
import { CPrice, CButton } from '@/components';
import { jump } from "@/utils/lib";

export interface ICouponItem {
  title: string;
  id: string;
  hour: string;
  img: string;
  tip?: string;
  total: number;
  rest: number | string;
  price: string;
  counter: string;
}
interface ICouponData {
  data: ICouponItem;
  style?: React.CSSProperties;
  className?: string;
  state?: string;
  [key: string]: any;
}
let titleDate: {
  start: string;
  end: string;
  before: string;
  selling: string;
  taked: string;
} = { start: '立即抢购', end: '已结束', before: '开抢提醒', selling: '立即抢购', taked: '去看看' };

const STATE = [0, 1, 2];
const STATE_TITLE = ['即将登场', '抢购中', '已结束'];

const CouponItem: (prop: ICouponData) => React.ReactElement = ({
  data,
  style,
  className,
  state,
}) => {
  let restPercent = 100 - parseInt(data.rest || 0);
  let isEmpty = 0 === restPercent;
  return (
    <div className={classNames('couponItem', className)} style={style}>
      <div className='img'>
          <img src={data.img} alt="" onClick={()=> jump(`/detail/${data.id}`)} />

        {isEmpty && (
          <div className='invalid'>
            <div className='circle'>已抢完</div>
          </div>
        )}
      </div>

      <div className='content'>
          <div className='title' onClick={()=> jump(`/detail/${data.id}`)}>{data.title}</div>
        <div className='tips'>{data && data.tip}</div>
        <div className='style'>
          <div className='progress'>
            <div className='active' style={{ width: `${restPercent}%` }}></div>
          </div>
          <div className='rest'>还剩 {data.total}件</div>
        </div>

        <div className='action'>
          限购价：
          <CPrice
            retail={data.price}
            retailStyle={{ marginLeft: 10, fontSize: 18 }}
            counter={data.counter}
            counterStyle={{ marginLeft: 10, fontSize: 16 }}
          />
        </div>
        <div className='btn'>
          {!isEmpty && state.value === 1 ? (
            <CButton
              style={{ right: 0 }}
              theme="yellowGardiant"
              size="normal"
              onClick={() => {
                if (data.id) {
                  jump(`/detail/${data.id}`);
                }
              }}
            >
              {STATE_TITLE[state.value]}
            </CButton>
          ) : (
            <CButton
              style={{ right: 0 }}
              theme="white"
              size="normal"
              onClick={() => {
                if (data.id) {
                  jump(`/detail/${data.id}`);
                }
              }}
            >
              {STATE_TITLE[state.value]}
            </CButton>
          )}
        </div>
      </div>
    </div>
  );
};

export default CouponItem;
