import Taro from "@tarojs/taro";
import { CStep } from "@/components";
let stetList = `未开始 预约中 抽签 购买 结束`
  .split(" ")
  .map(title => ({ title }));
const SpecialStep = ({ current }) => {
  return (
    <CStep items={stetList} current={current} style="margin:20px 0 30px 0" />
  );
};

export default SpecialStep;
