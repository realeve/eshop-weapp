import Taro from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import "./index.scss";
import Skeleton from "taro-skeleton";
import DCard from "../card";
import useFetch from "@/components/hooks/useFetch";
import { API } from "@/utils/setting";
import { AtAvatar } from "taro-ui";
import { ymdFormat } from "@/utils/lib";

const DetailComment = ({ id: commonId }: { id: string }) => {
  const { data, loading } = useFetch({
    param: {
      url: API.GOODS_EVALUATE as string,
      params: {
        evalLv: 0,
        commonId
      }
    },
    callback: e => e.evaluateGoodsVoList[0] || null,
    valid: () => commonId
  });

  return (
    <Skeleton loading={commonId > "0" && loading} animate row={2} avatar>
      <DCard className="detail_page_comment">
        <View className="detail_page_comment_title">
          <Text>用户评价</Text>
          <Text>更多</Text>
        </View>
        {data && (
          <View className="detail_page_comment_item">
            <View className="detail_page_comment_avatar">
              <AtAvatar size="small" circle image={data.memberAvatarUrl} />
            </View>
            <View className="detail_page_comment_detail">
              <View className="detail_page_comment_detail_username">
                <Text>{data.memberNameHidden}</Text>
                <Text className="detail_page_comment_username_time">
                  {ymdFormat(data.evaluateTime)}
                </Text>
              </View>
              <Text className="detail_page_comment_detail_content">
                {data.content}
              </Text>
            </View>
          </View>
        )}
      </DCard>
    </Skeleton>
  );
};

export default DetailComment;
