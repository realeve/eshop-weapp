import Taro, { useState, useEffect } from "@tarojs/taro";
import { CButton } from "@/components/";

export default ({ orderId, onRefresh }) => {
  return (
    <CButton theme="yellow" size="small" round={false} style="margin-left:12px">
      修改地址
    </CButton>
  );
};
