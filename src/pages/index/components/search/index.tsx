import Taro, { useState } from "@tarojs/taro";
import { AtSearchBar } from "taro-ui";
import { View } from "@tarojs/components";
import "./index.scss";
import { jump } from "@/utils/lib";
import classname from "classname";

export interface ISearchProps {
  pos: number;
  className?: string;
  style?: string;
  fixed?: boolean;
  value?: string;
  [key: string]: any;
}
const Search = ({
  pos,
  className,
  style,
  fixed = false,
  value = ""
}: ISearchProps) => {
  let [keyword, setKeyword] = useState(value);

  return (
    <View
      className={classname("searchWrap", `searchWrap${pos}`, className, {
        search_header: fixed
      })}
      style={style}
    >
      <AtSearchBar
        value={keyword}
        onChange={(e: string) => {
          setKeyword(e);
        }}
        onActionClick={() => {
          if (keyword.trim().length === 0) {
            return;
          }
          jump(`/pages/search/index?keyword=${keyword}`);
        }}
        placeholder="请输入搜索关键词"
      />
    </View>
  );
};

export default Search;
