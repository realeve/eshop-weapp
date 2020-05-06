import Taro from "@tarojs/taro";
import { CButton } from "@/components/";
import { getMpPrepayId } from "@/utils/cartDb";
import { pay } from "@/utils/login";

export default ({ payId, onRefresh }) => {
  return (
    <CButton
      theme="yellow"
      size="small"
      onClick={async () => {
        let res = await getMpPrepayId({ payId, predepositPay: 0 });
        pay(res, onRefresh);
      }}
      round={false}
      style="margin-left:12px"
    >
      去付款
    </CButton>
  );
};
