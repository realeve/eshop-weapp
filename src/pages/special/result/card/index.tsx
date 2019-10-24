import Taro from "@tarojs/taro";
import "./index.scss";
import CCard, { ICardProp } from "@/components/CCard";
import classnames from "classnames";

const SpecialCard = ({ className, ...prop }: ICardProp) => {
  return (
    <CCard className={classnames("SpecialCard", className)} {...prop}></CCard>
  );
};

export default SpecialCard;
