import Taro, { Component } from "@tarojs/taro";
import "./index.scss";
import classnames from "classnames";
import { Button } from "@tarojs/components";

export default class CButton extends Component {
  render() {
    const {
      children,
      theme = "",
      className,
      onClick,
      size,
      style
    } = this.props;
    return (
      <Button
        className={classnames(className, {
          ["cButton" + theme]: theme,
          ["cButton" + size]: size
        })}
        onClick={onClick}
        style={style}
      >
        {children}
      </Button>
    );
  }
}
