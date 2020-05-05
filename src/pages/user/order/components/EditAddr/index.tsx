import Taro from "@tarojs/taro";
import { CButton } from "@/components/";
import { jump } from "@/utils/lib";
export default ({ orderId }) => {
  return (
    <CButton
      theme="yellow"
      size="small"
      round={false}
      onClick={() => {
        jump(`/pages/user/address/list?orderid=${orderId}`);
      }}
      style="margin-left:12px"
    >
      修改地址
    </CButton>
  );
};
