import Taro from "@tarojs/taro";
import { View, RichText } from "@tarojs/components";
import "./index.scss";
import { help as url } from "@/utils/setting";
import useFetch from "@/components/hooks/useFetch";

export default () => {
  let { data, loading } = useFetch({
    param: { url }
  });
  console.log(data);

  return (
    <View className="help_page">
      <View className="main">
        asd
        {/* <RichText space="ensp" nodes={} /> */}
      </View>
    </View>
  );
};
