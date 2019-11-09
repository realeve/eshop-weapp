import Taro from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import "./index.scss";

// mode?: 'scaleToFill' | 'aspectFit' | 'aspectFill' | 'widthFix' | 'top' |
// 'bottom' | 'center' | 'left' | 'right' | 'top left' | 'top right' |
// 'bottom left' | 'bottom right',

const Find = () => {
  return (
    <View className="find-page">
      <Image
        src="https://www.cbpc.ltd/ccgold/static/find.jpg"
        mode="widthFix"
        className="img"
      />
    </View>
  );
};

Find.config = {
  navigationBarTitleText: "发现"
};

export default Find;
