import Taro, { useState } from "@tarojs/taro";
import { CPrice, CButton, ResponseNotice } from "@/components";
import { View, Text } from "@tarojs/components";
import "./index.scss";
import { ISubscribe } from "../db";
import classnames from "classnames";
import { jump } from "@/utils/lib";
import { OSS_URL } from "@/utils/setting";

interface IProps {
  data: ISubscribe;
  [key: string]: any;
}
const SpecialAction = ({ data = {}, className }: IProps) => {
  const [agree, setAgree] = useState(false);
  return (
    <View className={classnames("special__action", className)}>
      <View className="readme">
        <ResponseNotice
          needAgree
          onChange={setAgree}
          html={
            data &&
            data.activityId &&
            `${OSS_URL}/rules/escapeClause_${data.activityId}.html`
          }
        />
      </View>

      <View className="buy">
        <View className="text">
          <View className="price">
            <Text style={{ marginRight: 5 }}>预约价</Text>
            <CPrice retail={data.goodsPrice} />
          </View>
          <View className="tips">10天15小时后关闭预约</View>
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
            Taro.showLoading({ title: "预约中,处理完毕后跳转结果页" });
            setTimeout(() => {
              Taro.hideLoading();

              // 跳转至结果页
              jump({
                url: "/pages/special/result/index",
                payload: {
                  id: data.activityId
                }
              });
            }, 1000);
          }}
          theme="gardient"
          size="small"
          // style="width:100px;"
          style={{ width: "100px" }}
        >
          立即预约
        </CButton>
      </View>
    </View>
  );
};
export default SpecialAction;
