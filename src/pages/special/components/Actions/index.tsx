import Taro, { useState } from "@tarojs/taro";
import { CButton, CPrice, ResponseNotice } from "@/components/";
import { View, Text } from "@tarojs/components";
import "./index.scss";

interface IProps {
  [key: string]: any;
}
const SpecialAction = (props: IProps) => {
  const [agree, setAgree] = useState(false);
  return (
    <View className="special__action">
      <View className="readme">
        <ResponseNotice needAgree onChange={setAgree} />
      </View>

      <View className="buy">
        <View className="text">
          <View className="price">
            <Text style={{ marginRight: 5 }}>预约价</Text>
            <CPrice retail={2000} />
          </View>
          <View className="tips">10天15小时20分后关闭预约</View>
        </View>
        <CButton
          onClick={() => {
            if (!agree) {
              Taro.showToast({
                title: "请先阅读并同意《免责声明》",
                icon: "none"
              });
              return;
            }
            console.log("立即预约");
          }}
          theme="gardient"
          className="btn"
        >
          立即预约
        </CButton>
      </View>
    </View>
  );
};
export default SpecialAction;
