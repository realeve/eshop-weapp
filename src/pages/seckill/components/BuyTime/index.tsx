import taro, { useState } from '@tarojs/taro';
import from './index.scss';
import { AtIcon as Icon } from 'taro-ui';
import * as R from 'ramda';
import classNames from 'classnames';

export interface IBuytimeItem {
  data?: string;
  hour?: string;
  title?: string;
  onClick?: (e: string) => void;
  maxNum?: string;
  [key: string]: any;
}
// export interface IPropItem {
//   id: string | number;
//   data?: string;
//   hour: string;
//   title?: string | number;
//   [key: string]: any;
// }

interface IBuytimeData {
  limitTime?: IBuytimeItem[];
  style?: React.CSSProperties;
  className?: string;
  Click?: (state: string) => void;
  [key: string]: any;
}

// 限购时间段说明信息
let titleDate: {
  start: string;
  end: string;
  before: string;
  selling: string;
  taked: string;
} = { start: '已开抢', end: '已结束', before: '即将开抢', selling: '抢购中', taked: '已抢完' };

const BuyTime: (props: IBuytimeData) => React.ReactElement = ({
  data = [],
  hour = true,
  title = true,
  initData = [],
  limitTime = [],
  onClick,
  Click,
  current,
  maxNum = '8',
}) => {
  const [idx, setIdx] = useState(0);
  const [curIdex, setcurIdx] = useState(current);

  // useEffect(()=>{},[])

  return (
    <div className='buytime'>
      {limitTime.length > Number(maxNum) && (
        <div
          className={classNames('prev', {
            'disabled': idx === 0,
          })}
          onClick={() => {
            setIdx(R.clamp(0, limitTime.length - Number(maxNum), idx - 1));
          }}
        >
          <Icon value="left" size="25" />
        </div>
      )}
      <div className='arrow'>
        {limitTime.map((item, index) => (
          <div
            className={classNames('time', {
              'timeActive': item.id === current,
            })}
            key={item.id}
            onClick={() => {
              setcurIdx(index);
              onClick && onClick(item.id);
            }}
            style={{ transform: `translateX(-${idx * 170}px)`, transition: 'transform .5s' }}
          >
            <div className='date'>
              {item.data}
              <span style={{ fontSize: 24 }}>{item.hour}</span>
            </div>
            <div className='title'>{item.state.text}</div>
          </div>
        ))}
      </div>
      {limitTime.length > Number(maxNum) && (
        <div
          className={classNames('next', {
            'disabled': idx === limitTime.length - Number(maxNum),
          })}
          onClick={() => {
            setIdx(R.clamp(0, limitTime.length - Number(maxNum), idx + 1));
          }}
        >
          <AtIcon type="right" style={{ fontSize: 25, border: 1 }} />
        </div>
      )}
    </div>
  );
};

export default BuyTime;
