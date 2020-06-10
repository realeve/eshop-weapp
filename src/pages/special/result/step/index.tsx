import Taro from "@tarojs/taro";
import CStep from "@/components/step";
let stetList = `未开始 预约中 抽签 购买 结束`
  .split(" ")
  .map(title => ({ title }));

/**
 * @field notStart 未开始
 * @field order 预约
 * @field lottery 抽签
 * @field buy 购买
 * @field end 结束
 */

export enum LotteryStatus {
  notStart,
  order,
  lottery,
  buy,
  end
}

const SpecialStep = ({ current }: { current: LotteryStatus }) => {
  return (
    <CStep
      items={stetList}
      current={current}
      //style="margin:20px 0 30px 0"
      style={{ margin: "20px 0 30px 0" }}
    />
  );
};

export default SpecialStep;
