import Taro, { useState } from "@tarojs/taro";
import { CButton } from "@/components";
import { Text, View } from "@tarojs/components";
import { AtModal } from "taro-ui";
import * as db from "../../db";

export default ({ goods }) => {
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
        <Text>再次购买</Text>
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
          await db.addOrderAgain(goods);
          setOpen(false);
        }}
        content="再次购买本商品?"
      />
    </View>
  );
};
