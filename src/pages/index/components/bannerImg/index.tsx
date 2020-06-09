import Taro, { useState, useEffect } from "@tarojs/taro";
import { Image, View } from "@tarojs/components";
import "./index.scss";
import Skeleton from "taro-skeleton";
import * as R from "ramda";

import { jump } from "@/utils/lib";

export interface IProps {
  special: {
    batchId: number;
    imageUrl: string;
  };
}

const BannerImg = ({ special }: IProps) => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (R.isNil(special)) {
      setLoading(true);
      return;
    }
    setLoading(special.batchId <= 0);
  }, [special]);

  return (
    <Skeleton loading={loading} row={1} rowHeight={240} animate>
      {loading ? (
        <View> 载入中</View>
      ) : (
        <Image
          src={((special && special.imageUrl) || "").replace(
            "statictest",
            "statictest"
          )}
          className="bannerImg"
          // style="height:480px;"
          style={{ height: "480px" }}
          mode="scaleToFill"
          onClick={() => {
            jump({
              url: "/pages/special/index?id=" + special.batchId
            });
          }}
        />
      )}
    </Skeleton>
  );
};

export default BannerImg;
