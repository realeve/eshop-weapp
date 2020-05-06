import Taro from "@tarojs/taro";
import { CButton } from "@/components";
import { Text, View } from "@tarojs/components";
import { jump } from "@/utils/lib";

export default ({ serviceId }) => {
  return (
    <View>
      <CButton
        theme="yellow"
        size="small"
        round={false}
        style={{ marginLeft: "12px" }}
        onClick={() => {
          jump(`/pages/user/order/aftersale/detail?sid=${serviceId}`);
        }}
      >
        <Text>服务详情</Text>
      </CButton>
    </View>
  );
};
