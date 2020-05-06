export const SUBSCRIBE_STATE: {
    [key: number]: string;
  } = {
    0: '未发布',
    1: '已发布',
    10: '申购中',
    20: '申购结束',
    30: '抽签中',
    40: '抽签结束',
    50: '活动结束',
    60: '活动结束',
    70: '活动结束',
    100: '结束',
    9999: '中止',
  };

export const historyHandler = ({ list }) =>
  list.map(data => {
    let goodsItem = data.goods;
    let jingle = data.goodsCommon ? data.goodsCommon.jingle : '';
    data.status = data.state;
    data.statusName = SUBSCRIBE_STATE[data.state];
    let showCountDown = data.state >= 1 && data.state <= 50;
    let remainTime = '';
    let operation = '';
    let buttonTitle = '查看详情';
    let promo = '';

    switch (data.state) {
      case 1:
        remainTime = data.beginTime;
        operation = '开启预约';
        buttonTitle = '敬请期待';
        promo = '【敬请期待】';
        break;
      case 10:
        remainTime = data.endTime;
        operation = '关闭预约';
        buttonTitle = '我要预约';
        promo = '【火爆预约中】';
        break;
      case 20:
      case 30:
        remainTime = data.drawTime;
        operation = '即将抽签';
        promo = '【即将公布】';
        break;
      case 40:
      case 50:
        remainTime = data.payExpireTime;
        operation = '结束付款';
        promo = '【马上结束】';
        break;
      default:
        break;
    }

    data = {
      ...data,
      remainTime,
      operation,
      promo,
      buttonTitle,
      showCountDown,
      jingle,
      goodsItem,
    };
    // console.log(idx, promo, data.state, remainTime);
    return data;
  });
