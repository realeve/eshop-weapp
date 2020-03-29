import Taro from "@tarojs/taro";
import { help as url } from "@/utils/setting";
import useFetch from "@/components/hooks/useFetch";
import { AtList, AtListItem } from "taro-ui";
import Skeleton from "taro-skeleton";
import * as lib from "@/utils/lib";

const Index = () => {
  let { data, loading } = useFetch({
    param: { url }
  });

  return (
    <Skeleton loading={loading} animate rowHeight={50} row={7}>
      <AtList>
        {data &&
          data.map(item => (
            <AtListItem
              title={item.title}
              key={item.title}
              onClick={() => {
                lib.jump(item.url);
              }}
              arrow="right"
            />
          ))}
      </AtList>
    </Skeleton>
  );
};

Index.config = {
  navigationBarTitleText: "帮助与客服"
};
export default Index;
