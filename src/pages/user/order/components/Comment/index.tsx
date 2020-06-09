import Taro from "@tarojs/taro";
import { CButton } from "@/components/";
import { jump } from "@/utils/lib";

export default ({ orderId, type = "normal" }) => {
  return (
    <CButton
      theme="yellow"
      size="small"
      round={false}
      // style="margin-left:12px"
      style={{ marginLeft: "12px" }}
      onClick={() => {
        jump(`/pages/user/order/comment?id=${orderId}&type=${type}`);
      }}
    >
      {type == "normal" ? "评价" : "追加评论"}
    </CButton>
  );
};
