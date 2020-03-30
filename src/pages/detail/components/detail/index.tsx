import Taro, { useState } from "@tarojs/taro";
import { View, Image, RichText, Text } from "@tarojs/components";
import "./index.scss";
import DCard from "../card";
import { API } from "@/utils/setting";
import useFetch from "@/components/hooks/useFetch";
import { AtTabsPane } from "taro-ui";

import Skeleton from "taro-skeleton";
import { appAfterService } from "@/utils/cbpm_doc";
import CTabs from "./tabs";

const DetailContent = ({ goods_id: id }: { goods_id: string | number }) => {
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
      <DCard>
        <CTabs
          tabList={[{ title: "商品详情" }, { title: "售后服务" }]}
          current={current}
          onClick={setCurrent}
        >
          <AtTabsPane current={current} index={0}>
            <View className="goods_detail_container">
              {(imgs || []).map(src => (
                <Image src={src} className="img" key={src} />
              ))}
            </View>
          </AtTabsPane>
          <AtTabsPane current={current} index={1}>
            <View className="goods_detail_service">
              <RichText
                space="ensp"
                nodes={appAfterService}
                style="line-height:1.5em;"
              />
            </View>
          </AtTabsPane>
        </CTabs>
      </DCard>
    </Skeleton>
  );
};

export default DetailContent;
