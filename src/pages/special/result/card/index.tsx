import Taro from "@tarojs/taro";
import "./index.scss";
import CCard, { ICardProp } from "@/components/CCard";
import classnames from "classnames";

const SpecialCard = (prop: ICardProp) => {
  const { className, children, title } = prop;
  return (
    <CCard className={classnames("SpecialCard", className)} title={title}>
      {children}
    </CCard>
  );
};

export default SpecialCard;
