import Taro, { useState } from "@tarojs/taro";
import { AtSearchBar } from "taro-ui";
import { View } from "@tarojs/components";
import "./index.scss";

import classname from "classname";

export interface ISearchProps {
  pos: number;
  className?: string;
  [key: string]: any;
}
const Search = ({ pos, className }: ISearchProps) => {
  let [keyword, setKeyword] = useState("");

  return (
    <View className={classname("searchWrap", `searchWrap${pos}`, className)}>
      <AtSearchBar
        value={keyword}
        onChange={(e: string) => {
          console.log(e);
        }}
        placeholder="请输入搜索关键词"
      />
    </View>
  );
};

export default Search;
