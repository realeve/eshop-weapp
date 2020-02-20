import Taro, { useState, useEffect } from "@tarojs/taro";
import { View } from "@tarojs/components";
import "./index.scss";
import Tab from "@/pages/search/tab/";
import * as db from "./db";

console.log(db);
const Order = () => {
  const [current, setCurrent] = useState(0);

  // 更新cat信息
  const handleMenu = index => {
    setCurrent(index);
  };

  return (
    <View className="user_order">
      <Tab list={db.orderStateList} current={current} onChange={handleMenu} />
    </View>
  );
};

Order.config = {
  navigationBarTitleText: "我的订单"
};

export default Order;
