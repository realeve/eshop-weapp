import Taro from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import "./index.scss";

// mode?: 'scaleToFill' | 'aspectFit' | 'aspectFill' | 'widthFix' | 'top' |
// 'bottom' | 'center' | 'left' | 'right' | 'top left' | 'top right' |
// 'bottom left' | 'bottom right',

const Find = () => {
  return (
    <View className="find-page">
      <Image src="https://static.ccgold.cn/image/9b/d6/9bd69e4e2d6aa4d3a407d6a1ef01f54b.jpg" />
    </View>
  );
};

Find.config = {
  navigationBarTitleText: "发现"
};

export default Find;
