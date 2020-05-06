import Taro from "@tarojs/taro";
import { CButton } from "@/components";
import { Text, View } from "@tarojs/components";
import { cancelRefund } from "../interface";

export default ({ data, refresh }) => (
  <View>
    <CButton
      theme="yellow"
      size="small"
      round={false}
      onClick={() => cancelRefund(data.refundId, data.refundType, refresh)}
    >
      <Text>取消申请</Text>
    </CButton>
  </View>
);
