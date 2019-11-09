import Taro from "@tarojs/taro";
import "./index.scss";
import classnames from "classnames";
import { AtButton } from "taro-ui";

const CButton = props => {
  const { children, theme = "", className, ...rest } = props; // {...rest}
  return (
    <AtButton className={classnames(className, "cButton" + theme)}>
      {children}
    </AtButton>
  );
};

export default CButton;
