import Taro, { useState, useEffect } from "@tarojs/taro";
import * as db from "../db";
import { CButton } from "@/components/";

export default ({ orderId, onRefresh }) => {
  const receive = () => {
    console.log("确认收货");
  };
  return (
    <CButton
      theme="yellow"
      size="small"
      round={false}
      style="margin-left:12px"
      onClick={receive}
    >
      确认收货
    </CButton>
  );
};
