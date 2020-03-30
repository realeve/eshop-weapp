import Taro from "@tarojs/taro";
import { View } from "@tarojs/components";
import "./index.scss";
import classnames from "classnames";
import { TReactNode } from "@/components";

export interface ICardProp {
  title: TReactNode;
  extra?: TReactNode;
  children?: TReactNode;
  className?: string;
  [key: string]: any;
}
const CCard = (props: ICardProp) => {
  let { title, extra, children, style, className } = props;

  return (
    <View className={classnames("CCard", className)} style={style}>
      <View className="head">
        <View className="title">{title}</View>
        <View className="extra">{extra}</View>
      </View>
      <View className="content">{children}</View>
    </View>
  );
};

export default CCard;
