import Taro from "@tarojs/taro";
import { CButton } from "@/components/";
import { jump } from "@/utils/lib";

export default ({ orderId }) => (
  <CButton
    theme="yellow"
    size="small"
    round={false}
    style="margin-left:12px"
    onClick={() => {
      jump(`/pages/user/order/refund?id=${orderId}`);
    }}
  >
    申请退款
  </CButton>
);
