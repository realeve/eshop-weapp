import React from "react";
import "./index.scss";
import Countdown, { TFormatRender } from "@/components/CountDown";
import moment from "moment";
import classNames from "classnames";
import { CountTime } from "@/pages/order/user/component/OrderItem/lib";

const renderClock: TFormatRender = res => {
  let [day, , hour, , minute, , second] = res.split(" ");
  return (
    <div className="clockWrap">
      <div className={classNames("card", "cardLeft")}>{day}</div>
      <span>天</span>
      <div className="card">{hour}</div>
      <span>时</span>
      <div className="card">{minute}</div>
      <span>分</span>
      <div className={classNames("card", "cardRight")}>{second}</div>
      <span>秒</span>
    </div>
  );
};

const CardCountdown: (props: { time: string }) => React.ReactElement = ({
  time
}) => {
  return (
    <Countdown
      title=""
      className="countDown"
      value={moment(time)
        .toDate()
        .toString()}
      format="D 天 HH 时 mm 分 ss 秒"
      formatRender={renderClock}
    />
  );
};
export default CountTime;
