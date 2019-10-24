import Taro, { Component } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import PropTypes from "prop-types";
import classNames from "classnames";
import "./index.scss";

export default class AtSteps extends Component {
  handleClick() {
    let { onChange } = this.props;
    onChange && onChange(...arguments);
  }

  render() {
    const { style, className, items, current } = this.props;

    return (
      <View className="cStep">
        <View className={classNames("at-steps", className)} style={style}>
          {items.map((item, i) => (
            <View
              key={item.title}
              className={classNames(
                "at-steps__item",
                `at-steps__item--${i <= current ? "active" : "inactive"}`
              )}
              onClick={this.handleClick.bind(this, i)}
            >
              <View className="at-steps__circular-wrap">
                {i !== 0 && <View className="at-steps__left-line"></View>}
                {item.status ? (
                  <View
                    className={classNames({
                      "at-icon": true,
                      "at-icon-check-circle": item.status === "success",
                      "at-icon-close-circle": item.status === "error",
                      "at-steps__single-icon": true,
                      "at-steps__single-icon--success":
                        item.status === "success",
                      "at-steps__single-icon--error": item.status === "error"
                    })}
                  ></View>
                ) : (
                  <View className="at-steps__circular">
                    <View className="border" />
                    {item.icon && (
                      <Text
                        className={classNames("at-icon", {
                          [`at-icon-${item.icon.value}`]: item.icon.value,
                          "at-steps__circle-icon": true
                        })}
                      ></Text>
                    )}
                  </View>
                )}
                {i !== items.length - 1 && (
                  <View
                    className={classNames("at-steps__right-line", {
                      grey__line: i === current
                    })}
                  ></View>
                )}
              </View>
              <View className="at-steps__title">{item.title}</View>
              <View className="at-steps__desc">{item.desc}</View>
            </View>
          ))}
        </View>
      </View>
    );
  }
}

AtSteps.defaultProps = {
  customStyle: "",
  className: "",
  current: 0,
  items: [],
  onChange: () => {}
};

AtSteps.propTypes = {
  customStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  className: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
  current: PropTypes.number,
  items: PropTypes.array,
  onChange: PropTypes.func
};
