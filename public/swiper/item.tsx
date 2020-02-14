import Taro from "@tarojs/taro";
import { View } from "@tarojs/components";
import classNames from "classnames";
import Swipers from "./swiper";

import "swiper/dist/css/swiper.min.css";

let INSTANCE_ID = 0;

export default class CSwiperItem extends Taro.Component {
  render() {
    const cls = classNames("swiper-slide", this.props.className);
    return (
      <View
        className={cls}
        style={this.props.style}
        item-id={this.props.itemId}
      >
        {this.props.children}
      </View>
    );
  }
}
