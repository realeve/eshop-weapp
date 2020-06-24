import Taro from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import { CPrice, CButton } from "@/components";
import { jump } from "@/utils/lib";
import CountTime from "@/pages/user/order/components/CountTime";
import dayjs from "dayjs";
import "./preorderItem.scss";

export default ({ data }) => {
  if (!data) {
    return null;
  }
  const url = `/pages/special/index?id=${data.activityId}`;

  return (
    <View className="item">
      <View className="detail">
        <View
          className="goods"
          onClick={() => {
            jump(url);
          }}
        >
          <Image src={data.goodsItem.imageSrc} className="img" />
        </View>
        <View className="goodsInfo" key={data.goodsItem.goodsId}>
          <View className="goodsMain">
            <View className="goodsTitle">
              {data.promo}
              {data.goodsName}
            </View>
            <View className="title">
              <View className="info">
                <View className="name">预约价</View>
                <View className="value">
                  <CPrice retail={data.goodsPrice} />
                </View>
              </View>
              <View className="info">
                <View className="name">预约数量</View>
                <View className="value">{data.issueQuantity}</View>
              </View>
              <View className="info">
                <View className="name">预约开始</View>
                <View className="value">{data.beginTime}</View>
              </View>
              <View className="info">
                <View className="name">预约结束</View>
                <View className="value">{data.endTime}</View>
              </View>
              <View className="info">
                <View className="name">抽签时间</View>
                <View className="value">{data.drawTime}</View>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* {data.jingle.length > 0 && (
        <View>
          <AtDivider content="商品卖点" height="80" />
          <View className="description">{data.jingle}</View>
        </View>
      )} */}

      <View className="type">
        <View className="time">
          {data.showCountDown && dayjs().isBefore(data.drawTime) && (
            <View>
              <CountTime time={data.remainTime} />
              <Text>{data.operation}</Text>
            </View>
          )}
        </View>

        <View style={{ width: "160px" }}>
          <CButton
            theme="gardient"
            round={false}
            size="small"
            onClick={() => {
              jump(url);
            }}
          >
            {data.buttonTitle}
          </CButton>
        </View>
      </View>
    </View>
  );
};
