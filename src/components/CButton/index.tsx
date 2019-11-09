import Taro, { Component } from "@tarojs/taro";
import "./index.scss";
import classnames from "classnames";
import { AtButton } from "taro-ui";

export default class CButton extends Component {
  render() {
    const { children, theme = "", className, onClick } = this.props;
    return (
      <AtButton
        className={classnames(className, "cButton" + theme)}
        onClick={onClick}
      >
        {children}
      </AtButton>
    );
  }
}
