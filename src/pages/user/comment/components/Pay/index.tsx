import Taro, { useState, useEffect } from "@tarojs/taro";
import * as db from "../db";
import { CButton } from "@/components/";

export default ({ orderId, onRefresh }) => {
  return (
    <CButton theme="yellow" size="small" round={false} style="margin-left:12px">
      去付款
    </CButton>
  );
};
