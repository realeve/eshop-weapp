import Taro, { useState } from "@tarojs/taro";
import { View } from "@tarojs/components";

import { AtSearchBar } from "taro-ui";
import "./index.less";
import "taro-ui/dist/style/components/search-bar.scss";
import "taro-ui/dist/style/components/button.scss";
import "taro-ui/dist/style/components/icon.scss";

const Search = () => {
  let [keyword, setKeyword] = useState("");
  return (
    <AtSearchBar
      value={keyword}
      onChange={(e: string) => {
        console.log(e);
      }}
    />
  );
};

export default Search;
