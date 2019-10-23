import Taro, { useRouter, useState, useEffect } from "@tarojs/taro";

import { View, Image } from "@tarojs/components";

import { AtTabs, AtTabsPane } from "taro-ui";

import "./index.scss";
import { connect } from "@tarojs/redux";
import SpecialAction from "../components/Actions";
import { API } from "@/utils/setting";
import { useFetch } from "@/components/";
import { handleSubscribe, ISubscribe } from "../db";
import Skeleton from "taro-skeleton";

interface IProps {
  [key: string]: any;
}
const SpecialDetail = ({ dispatch, special }: IProps) => {
  const {
    params: { id }
  } = useRouter();

  const { data: subscribe, loading } = useFetch<ISubscribe>({
    param: { url: `${API.SP_SUBSCRIBER_INFO}/${id}` },
    callback: e => handleSubscribe(e, dispatch),
    valid: () => id > "0" && !special
  });

  const [current, setCurrent] = useState(Number(id) || 0);

  const [tabList, setTabList] = useState((special && special.imgList) || []);
  useEffect(() => {
    let imgs = subscribe && subscribe.imgList;
    if (imgs) {
      setTabList(imgs);
    }
  }, [subscribe]);

  return (
    <View className="special-page__detail">
      <AtTabs
        current={current}
        tabList={tabList}
        onClick={setCurrent}
        className="detail"
      >
        {tabList.map((item, idx) => (
          <AtTabsPane current={current} index={idx} key={item.title}>
            {/* <ScrollView scrollY className="imgWrapper"> */}
            {item.detail.map(
              item =>
                item && (
                  <Image
                    src={item}
                    key={item}
                    mode="widthFix"
                    className="img"
                  />
                )
            )}
            {/* </ScrollView> */}
          </AtTabsPane>
        ))}
      </AtTabs>

      <Skeleton loading={loading} row={2} avatar>
        <SpecialAction className="action" data={special || subscribe} />
      </Skeleton>
    </View>
  );
};

SpecialDetail.config = {
  navigationBarTitleText: "最新预约-详情"
};

export default connect(({ special }) => special)(SpecialDetail as any);
