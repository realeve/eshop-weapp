import Taro, { Component } from "@tarojs/taro";
import { View, Text, ScrollView } from "@tarojs/components";

import "./index.scss";

export default class Banner extends Component {
  static defaultProps = {
    list: [],
    onChange: () => {}
  };

  render() {
    const { list, current } = this.props;
    // XXX 暂未实现 tab item 与内容区域的同步滚动
    return (
      <View className="cate-sub__menu">
        <ScrollView scrollX className="cate-sub-tab">
          {list.map((item, index) => (
            <View
              key={item.id}
              className="cate-sub-tab__item"
              onClick={() => this.props.onChange(index)}
            >
              <Text className="cate-sub-tab__item-txt">{item.name}</Text>
              {index === current && (
                <View className="cate-sub-tab__item-line" />
              )}
            </View>
          ))}
        </ScrollView>
        {list.length > 4 && (
          <View className="at-icon at-icon-chevron-right right" />
        )}
      </View>
    );
  }
}
