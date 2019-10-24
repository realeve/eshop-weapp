import Taro from "@tarojs/taro";
import { CStep } from "@/components";

const SpecialStep = ({ current }) => {
  return (
    <CStep
      items={[{ title: "预约" }, { title: "抽签" }, { title: "购买" }]}
      current={current}
      style="margin:20px 0 30px 0"
    />
  );
};

export default SpecialStep;
