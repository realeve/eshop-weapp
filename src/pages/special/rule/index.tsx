import Taro from "@tarojs/taro";
import { View, RichText } from "@tarojs/components";
import "./index.scss";
import { responseText } from "@/utils/cbpm_doc";

const SpecialRule = () => (
  <View className="special_rule_page">
    <View className="rule_card">
      <RichText space="ensp" nodes={responseText} />
    </View>
  </View>
);

export default SpecialRule;
