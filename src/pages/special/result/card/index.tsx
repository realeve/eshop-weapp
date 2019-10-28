import Taro from "@tarojs/taro";
import "./index.scss";
import CCard, { ICardProp } from "@/components/CCard";
import classnames from "classnames";

const SpecialCard = (prop: ICardProp) => {
  const { className, ...rest } = prop;
  return (
    <CCard className={classnames("SpecialCard", className)} {...rest}></CCard>
  );
};

export default SpecialCard;
