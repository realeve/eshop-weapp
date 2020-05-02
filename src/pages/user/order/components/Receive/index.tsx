import Taro from "@tarojs/taro";
import * as db from "../../db";
import { CButton } from "@/components/";

export default ({ orderId, onRefresh }) => {
  const receive = () => {
    Taro.showModal({
      title: "提示",
      content: "确认收货?",
      success: ({ confirm }) => {
        if (!confirm) {
          return;
        }

        db.receiveOrder(orderId, onRefresh);
      }
    });
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
