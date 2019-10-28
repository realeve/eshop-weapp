import Taro from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import classNames from "classnames";
import "./index.scss";

const Menu = ({ current, list = [], onClick }) => (
  <View className="cate-menu">
    {list.map(item => {
      const active = item.id === current;
      return (
        <View
          key={item.id}
          className={classNames(
            "cate-menu__item",
            active && "cate-menu__item--active"
          )}
          onClick={() => onClick(item.id)}
        >
          <Text
            className={classNames(
              "cate-menu__item-name",
              active && "cate-menu__item-name--active"
            )}
          >
            {item.name}
          </Text>
        </View>
      );
    })}
  </View>
);

export default Menu;
