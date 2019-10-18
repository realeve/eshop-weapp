import Taro from "@tarojs/taro";
import "./index.scss";
import classnames from "classnames";
import { AtButton } from "taro-ui";

const CButton = ({ children, theme = "", className, ...props }) => (
  <AtButton className={classnames(className, "cButton" + theme)} {...props}>
    {children}
  </AtButton>
);

export default CButton;
