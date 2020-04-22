import Taro from "@tarojs/taro";
import { CButton } from "@/components";
import { Text, View } from "@tarojs/components";
import * as db from "../../db";

export default ({ goods }) => {
  const showModal = () => {
    Taro.showModal({
      title: "提示",
      content: "再次购买本商品?",
      success: ({ confirm }) => {
        if (!confirm) {
          return;
        }
        db.addOrderAgain(goods);
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
        <Text>再次购买</Text>
      </CButton>
    </View>
  );
};
