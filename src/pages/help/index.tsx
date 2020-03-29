import Taro from "@tarojs/taro";
import { View, RichText } from "@tarojs/components";
import "./index.scss";
import { help as url } from "@/utils/setting";
import useFetch from "@/components/hooks/useFetch";

import { AtList, AtListItem } from "taro-ui";
import Skeleton from "taro-skeleton";

export default () => {
  let { data, loading, error } = useFetch({
    param: { url }
  });
  console.log(data, loading, error);

  return (
    // <View className="help_page">
    <Skeleton loading={loading} animate rowHeight={125} row={7}>
      <AtList>
        <AtListItem title="标题文字" arrow="right" />
      </AtList>
    </Skeleton>
    // </View>
  );
};
