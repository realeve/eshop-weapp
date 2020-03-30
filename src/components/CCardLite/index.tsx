import Taro from "@tarojs/taro";
import { View } from "@tarojs/components";
import "./index.scss";
import classnames from "classnames";
import { TReactNode } from "@/components";
const CardLite = ({
  className,
  style,
  children
}: {
  className?: string;
  style?: any;
  children?: TReactNode;
}) => {
  return (
    <View className={classnames("cardLite", className)} style={style}>
      {children}
    </View>
  );
};

export default CardLite;
