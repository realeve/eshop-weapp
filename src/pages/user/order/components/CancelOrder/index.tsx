import Taro from "@tarojs/taro";
import { CButton } from "@/components";
import { Text, View } from "@tarojs/components";
import * as db from "../../db";

export default ({ orderId, onRefresh }) => {
  const showModal = () => {
    Taro.showModal({
      title: "提示",
      content: "取消订单?",
      success: ({ confirm }) => {
        if (!confirm) {
          return;
        }

        // console.log(orderId);

        db.cancelOrder(orderId, onRefresh);
      }
    });
  };
  return (
    <View>
      <CButton
        theme="yellow"
        size="small"
        round={false}
        style={{ marginLeft: "12px" }}
        onClick={showModal}
      >
        <Text>取消订单</Text>
      </CButton>
    </View>
  );
};
