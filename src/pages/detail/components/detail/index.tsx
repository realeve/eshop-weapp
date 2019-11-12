import Taro, { useState } from "@tarojs/taro";
import { View, Image, RichText } from "@tarojs/components";
import "./index.scss";
import DCard from "../card";
import { API } from "@/utils/setting";
import useFetch from "@/components/hooks/useFetch";
import { AtTabs, AtTabsPane } from "taro-ui";

import Skeleton from "taro-skeleton";
import { appAfterService } from "@/utils/cbpm_doc";

// console.log(afterService)

const DetailContent = ({ id }: { id: string | number }) => {
  const [current, setCurrent] = useState(0);
  let { data: imgs, loading } = useFetch({
    param: {
      url: `${API.GOODS_DETAIL_BODY}${id}`
    },
    callback: e =>
      ((e.goodsBody || "").match(/(http\S+\")/g) || []).map(item =>
        item.replace('"', "")
      ),
    valid: () => id
  });

  return (
    <Skeleton loading={id > 0 && loading} animate row={4} rowHeight={400}>
      <DCard className="detail_page_content">
        <AtTabs
          tabList={[{ title: "商品详情" }, { title: "售后服务" }]}
          current={current}
          onClick={setCurrent}
        >
          <AtTabsPane current={this.state.current} index={0}>
            <View className="goodsDetail">
              {(imgs || []).map(src => (
                <Image src={src} className="img" key={src} />
              ))}
            </View>
          </AtTabsPane>
          <AtTabsPane current={this.state.current} index={1}>
            <View className="goods_detail_container">
              <RichText nodes={appAfterService} />
            </View>
          </AtTabsPane>
        </AtTabs>
      </DCard>
    </Skeleton>
  );
};

export default DetailContent;
