import Taro, { useState } from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import "./index.scss";
import Skeleton from "taro-skeleton";
import DCard from "../card";
import { useFetch } from "@/components";
import { API } from "@/utils/setting";
import { AtAvatar } from "taro-ui";

const DetailComment = ({ id: commonId }: { id: string }) => {
  const [evalLv, setEvalLv] = useState<number>(0);

  const { data, loading } = useFetch({
    param: {
      url: API.GOODS_EVALUATE as string,
      params: {
        evalLv,
        commonId
      }
    },
    callback: e => e.evaluateGoodsVoList[0] || null
  });

  console.log("评价", data);

  return (
    <Skeleton loading={loading} animate row={2} avatar>
      <DCard className="detail_page_comment">
        <View className="title">
          <Text>用户评价</Text>
          <Text>更多</Text>
        </View>
        {data && (
          <View className="commentItem">
            <View className="avatar">
              <AtAvatar size="small" circle image={data.memberAvatarUrl} />
            </View>
            <View className="detail">
              <View className="username">
                <Text>{data.memberNameHidden}</Text>
                <Text className="time">{data.evaluateTime}</Text>
              </View>
              <View className="content">{data.content}</View>
            </View>
          </View>
        )}
      </DCard>
    </Skeleton>
  );
};

export default DetailComment;
