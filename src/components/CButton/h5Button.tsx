import Taro, { Component } from "@tarojs/taro";
import "./wButton.scss";
import classnames from "classnames";
import { AtButton } from "taro-ui";

export default class CButton extends Component {
  render() {
    const {
      children,
      theme = "",
      className,
      onClick,
      size,
      style,
      round = true,
      disabled = false
    } = this.props;
    return (
      <AtButton
        className={classnames(className, {
          ["cButton" + theme]: theme,
          ["cButton" + size]: size,
          cButtonRect: !round
        })}
        onClick={onClick}
        style={style}
        disabled={disabled}
      >
        {children}
      </AtButton>
    );
  }
}
