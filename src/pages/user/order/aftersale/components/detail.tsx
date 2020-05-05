import Taro from "@tarojs/taro";
import { CButton } from "@/components";
import { Text, View } from "@tarojs/components";
import * as db from "../../db";

export default ({ serviceId }) => {
  const showModal = () => {
    Taro.showModal({
      title: "提示",
      content: "取消订单?",
      success: ({ confirm }) => {
        if (!confirm) {
          return;
        }

        db.cancelOrder(serviceId, false);
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
        <Text>服务详情</Text>
      </CButton>
    </View>
  );
};
