import Taro, { useRouter } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import "./index.scss";
import * as R from "ramda";
import { CPrice } from "@/components/";
import useFetch from "@/components/hooks/useFetch";
import Skeleton from "taro-skeleton";

import { API } from "@/utils/setting";
import { ISpecialItem } from "src/services/common";
import { jump } from "@/utils/lib";

import { getWebpSuffix } from "@/services/common";

let { windowHeight } = Taro.getSystemInfoSync();

const Special = () => {
  const {
    params: { id }
  } = useRouter();
  let { data, loading } = useFetch<ISpecialItem[]>({
    param: {
      data: { specialId: id },
      ...API.SPECIAL_GOODS
    },
    callback: data => {
      if (!data.goods) {
        return [];
      }
      return data.goods.map(
        ({ goodsPrice: price, commonId, goodsName: title, imageUrl: img }) => ({
          price,
          commonId,
          title,
          img: img + getWebpSuffix()
        })
      );
    },
    valid: () => id > "0"
  });

  // console.log(data);

  return (
    <Skeleton loading={loading} animate rowHeight={windowHeight / 2} row={3}>
      <View className="detail-page">
        <View className="grid">
          {R.splitEvery(2, data || []).map((row: ISpecialItem[], rowId) => (
            <View className="row" key={rowId + ""}>
              {row.map(item => (
                <View
                  className="item"
                  key={item.commonId}
                  onClick={() => {
                    jump(`/pages/detail/index?id=${item.commonId}`);
                  }}
                >
                  <Image mode="aspectFit" src={item.img} className="img" />
                  <View className="detail">
                    <View className="title">{item.title}</View>
                    <View
                      className="subTitle"
                      //  style="justify-content:center;"
                      style={{ justifyContent: "center" }}
                    >
                      <CPrice retail={item.price} />
                    </View>
                  </View>
                </View>
              ))}
            </View>
          ))}
        </View>
      </View>
    </Skeleton>
  );
};

Special.config = {
  navigationBarTitleText: "活动商品"
};

export default Special;
