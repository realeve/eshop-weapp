import Taro, { Component } from "@tarojs/taro";
import "./h5Button.scss";
import classnames from "classnames";
import { AtButton } from "taro-ui";
import { View } from "@tarojs/components";

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
      <View style={style}>
        <AtButton
          className={classnames(className, {
            ["cButton" + theme]: theme,
            ["cButton" + size]: size,
            cButtonRect: !round
          })}
          onClick={onClick}
          disabled={disabled}
        >
          {children}
        </AtButton>
      </View>
    );
  }
}
