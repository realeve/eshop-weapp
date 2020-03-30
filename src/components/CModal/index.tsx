import Taro from "@tarojs/taro";
import { View } from "@tarojs/components";
import "./index.scss";
import { AtFloatLayout } from "taro-ui";
import classnames from "classnames";

export default props => {
  let { show, onClose, className, children, ...extra } = props;
  return (
    <AtFloatLayout isOpened={show} onClose={onClose} scrollY {...extra}>
      <View className={classnames("CModal", className)}>
        {/* 关闭按钮 */}
        <View className="close" onClick={onClose}>
          <View className="at-icon at-icon-close-circle"></View>
        </View>
        {children}
      </View>
    </AtFloatLayout>
  );
};
