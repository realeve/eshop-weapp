import Taro, { useState } from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import "./index.scss";
import DCard from "../card";

import { AtTabs, AtTabsPane } from "taro-ui";
import { IProductInfo } from "../../lib";

const DetailContent = ({ data }: { data: IProductInfo }) => {
  const [current, setCurrent] = useState(0);
  return (
    <DCard className="detail_page_content">
      <AtTabs
        tabList={[{ title: "商品详情" }, { title: "售后服务" }]}
        current={current}
        onClick={setCurrent}
      >
        <AtTabsPane current={this.state.current} index={0}>
          safd
        </AtTabsPane>
        <AtTabsPane current={this.state.current} index={1}>
          asdf
        </AtTabsPane>
      </AtTabs>
    </DCard>
  );
};

export default DetailContent;
