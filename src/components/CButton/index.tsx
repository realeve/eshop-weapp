import Taro from "@tarojs/taro";
import "./index.scss";
import classnames from "classnames";
import { AtButton } from "taro-ui";

const CButton = props => {
  const { children, theme = "", className, ...rest } = props;
  return (
    <AtButton className={classnames(className, "cButton" + theme)} {...rest}>
      {children}
    </AtButton>
  );
};

export default CButton;
