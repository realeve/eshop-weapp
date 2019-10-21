import Taro from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import { Dispatch } from "redux";
import "./index.scss";

interface IProps {
  dispatch: Dispatch;
  [key: string]: any;
}
const Special = (props: IProps) => {
  return (
    <View className="special-page">
      <Text>special</Text>
    </View>
  );
};

Special.config = {
  navigationBarTitleText: "预约购"
};

export default connect(({ common }) => common)(Special as any);
