import Taro from "@tarojs/taro";
import "./index.scss";
import classNames from "classnames";
import { View, Text } from "@tarojs/components";

export interface IPropPrice {
  counter?: string | number;
  counterStyle?: React.CSSProperties;
  retail?: string | number;
  retailStyle?: React.CSSProperties;
  direction?: "row" | "column";
  priceClassName?: string;
  [key: string]: any;
}

/**
 * @param {string|number} counter  折扣前价格
 * @param {string|number} retail  实际价格
 * @param retailStyle 实际价格的文本样式，控制颜色，大小
 * @param counterStyle 折扣前价格的文本样式，控制颜色，大小
 * @param direction 实际价格与折扣前价格的方向  row(默认) | column
 */
const CPrice = (props: IPropPrice) => {
  const {
    counter = 0,
    retail = 0,
    counterStyle,
    retailStyle,
    className,
    priceClassName,
    direction = "row",
    ...rest
  } = props;

  return (
    <View
      className={classNames(
        "cPrice",
        { ["direction"]: direction === "column" },
        className
      )}
      {...rest}
    >
      {retail > 0 && (
        <Text
          className={classNames("retail", priceClassName)}
          style={retailStyle}
        >
          ¥ {(+retail).toFixed(2)}
        </Text>
      )}
      {counter > 0 && counter != retail && (
        <Text
          className={classNames("counter", priceClassName)}
          style={counterStyle}
        >
          ¥{(+counter).toFixed(2)}
        </Text>
      )}
    </View>
  );
};

export default CPrice;
