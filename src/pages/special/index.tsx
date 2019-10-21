import Taro, { useRouter } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import { connect } from "@tarojs/redux";

import "./index.scss";

interface IProps {
  [key: string]: any;
}
const Special = (props: IProps) => {
  const {
    params: { id: specialId }
  } = useRouter();

  return (
    <View className="special-page">
      <Text>特品ID-{specialId}</Text>
    </View>
  );
};

Special.config = {
  navigationBarTitleText: "预约购"
};

export default connect(({ common }) => common)(Special as any);
