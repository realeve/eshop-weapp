import Taro, { useState, useEffect } from "@tarojs/taro";
import { CButton } from "@/components/";
import { getMpPrepayId } from "@/utils/cartDb";
import { pay } from "@/utils/login";
import moment from "dayjs";

export default ({ payId, onRefresh, autoCancelTime }) => {
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    loading
      ? Taro.showLoading({ title: "支付中", mask: true })
      : Taro.hideLoading();
  }, [loading]);
  return (
    <CButton
      theme="yellow"
      size="small"
      onClick={async () => {
        if (moment().isAfter(autoCancelTime)) {
          Taro.showModal({
            title: "提示",
            content: "订单付款超时",
            showCancel: false
          });
          return;
        }
        setLoading(true);
        pay(payId, onRefresh).finally(() => setLoading(false));
      }}
      round={false}
      // style="margin-left:12px"
      style={{ marginLeft: "12px" }}
    >
      去付款
    </CButton>
  );
};
