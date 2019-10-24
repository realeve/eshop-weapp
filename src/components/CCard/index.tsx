import Taro from "@tarojs/taro";
import { View } from "@tarojs/components";
import "./index.scss";
import classnames from "classnames";

export interface ICardProp {
  title: string | JSX.Element;
  extra?: string | JSX.Element;
  children?: JSX.Element;
  className?: string;
  [key: string]: any;
}
const CCard = ({
  title,
  extra,
  children,
  style,
  className,
  ...extend
}: ICardProp) => {
  return (
    <View className={classnames("CCard", className)} style={style}>
      <View className="head">
        <View className="title">{title}</View>
        {extra && <View className="extra">{extra}</View>}
      </View>
      <View className="content">{children}</View>
    </View>
  );
};

export default CCard;
