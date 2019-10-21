import Taro from "@tarojs/taro";
import { View } from "@tarojs/components";
import "./index.scss";

const CCard = ({ title, extra, children, style, ...extend }) => {
  return (
    <View className="CCard" style={style}>
      <View className="head">
        <View className="title">{title}</View>
        <View className="extra">{extra}</View>
      </View>
      <View className="content">{children}</View>
    </View>
  );
};

export default CCard;
