import Taro, { useState } from "@tarojs/taro";
import { CButton } from "@/components";
import { Text, View } from "@tarojs/components";
import { AtModal } from "taro-ui";
import * as db from "../../db";

export default ({ orderId, onRefresh }) => {
  const [open, setOpen] = useState(false);
  return (
    <View>
      <CButton
        theme="yellow"
        size="small"
        round={false}
        style={{ marginLeft: "12px" }}
        onClick={() => {
          setOpen(true);
        }}
      >
        <Text>取消订单</Text>
      </CButton>

      <AtModal
        isOpened={open}
        title="提示"
        cancelText="取消"
        confirmText="确认"
        onClose={() => {
          setOpen(false);
        }}
        onCancel={() => {
          setOpen(false);
        }}
        onConfirm={async () => {
          await db.cancelOrder(orderId, onRefresh);
          setOpen(false);
        }}
        content="取消订单?"
      />
    </View>
  );
};
