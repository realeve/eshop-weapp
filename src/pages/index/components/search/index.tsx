import Taro, { useState } from "@tarojs/taro";
import { AtSearchBar } from "taro-ui";
import { View, Text, Image } from "@tarojs/components";
import "./index.less";
import "taro-ui/dist/style/components/search-bar.scss";
import "taro-ui/dist/style/components/button.scss";
import "taro-ui/dist/style/components/icon.scss";

import classname from "classname";

export interface ISearchProps {
  pos: number;
  [key: string]: any;
}
const Search = ({ pos }: ISearchProps) => {
  let [keyword, setKeyword] = useState("");

  return (
    <View className={classname("searchWrap", `searchWrap${pos}`)}>
      <AtSearchBar
        value={keyword}
        onChange={(e: string) => {
          console.log(e);
        }}
      />
    </View>
  );
};

export default Search;
