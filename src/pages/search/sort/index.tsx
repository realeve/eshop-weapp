import Taro from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import ImgDesc from "../img/sort.svg";
import ImgNormal from "../img/sort_normal.svg";

import "./index.scss";
import classnames from "classname";
export type IPropMode = "goods" | "comment" | "sale" | "discount" | "price";

const searchMethods: { title: string; key: IPropMode }[] = [
  { title: "综合", key: "goods" },
  { title: "人气", key: "comment" },
  { title: "销量", key: "sale" },
  { title: "折扣", key: "discount" },
  { title: "价格", key: "price" }
];

const sortState = {
  desc: "asc",
  asc: "desc"
};

export default ({ key = "goods", sort = "desc", onChange, simple = false }) => {
  return (
    <View
      className={classnames("search_sort", {
        search_sortSmall: simple
      })}
    >
      {searchMethods.map(item => (
        <View
          className={classnames("item", { itemActive: item.key === key })}
          onClick={() => {
            let nextDesc = "desc";
            if (item.key === "price") {
              let _sort =
                key === "price" && item.key === "price" ? sort : "asc";
              nextDesc = sortState[_sort];
            }
            onChange({
              key: item.key,
              sort: nextDesc
            });
          }}
          key={item.key}
        >
          <Text>{item.title}</Text>
          {item.key !== "goods" && (
            <Image
              src={item.key === key ? ImgDesc : ImgNormal}
              className={classnames("img", {
                [sort]: item.key === "price"
              })}
            />
          )}
        </View>
      ))}
    </View>
  );
};
