import Taro, { useState } from "@tarojs/taro";
import { CPrice, CButton, ResponseNotice } from "@/components";
import { View, Text } from "@tarojs/components";
import "./index.scss";
import { ISubscribe, doSubscribe } from "../../db";
import classnames from "classnames";
import { jump } from "@/utils/lib";
import { OSS_URL } from "@/utils/setting";
import dayjs from "dayjs";

// https://day.js.org/docs/zh-CN/plugin/relative-time
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/zh-cn";
import fail from "@/components/Toast/fail";
dayjs.extend(relativeTime);

const getStateDesc = data => {
  if (dayjs().isBefore(data.beginTime)) {
    return `${dayjs(data.beginTime)
      .locale("zh-cn")
      .from()} 开始预约`.replace("内", "后");
  }
  if (dayjs().isBefore(data.endTime)) {
    return `${dayjs(data.endTime)
      .locale("zh-cn")
      .from()} 结束预约`.replace("内", "后");
  }
  if (dayjs().isBefore(data.drawTime)) {
    return `${dayjs(data.drawTime)
      .locale("zh-cn")
      .from()} 公布抽签`.replace("内", "后");
  }

  if (dayjs().isBefore(data.payExpireTime)) {
    return `${dayjs(data.payExpireTime)
      .locale("zh-cn")
      .from()} 停止付款`.replace("内", "后");
  }
  return "申购已结束";
};

const getBtnText = data => {
  if (dayjs().isBefore(data.beginTime)) {
    return "即将开始";
  }
  if (dayjs().isBefore(data.endTime)) {
    return "立即预约";
  }
  if (dayjs().isBefore(data.drawTime)) {
    return "即将抽签";
  }

  if (dayjs().isBefore(data.payExpireTime)) {
    return "已开始付款";
  }

  return "已结束";
};

interface IProps {
  data: ISubscribe;
  [key: string]: any;
}
const SpecialAction = ({ data = {}, className }: IProps) => {
  const [agree, setAgree] = useState(false);

  const submit = () => {
    Taro.showLoading({ title: "预约中,处理完毕后跳转结果页" });

    if (!dayjs().isBefore(data.endTime)) {
      Taro.hideLoading();
      fail("预约已结束，请下次再来").then(() => {
        // 跳转至结果页
        jump({
          url: "/pages/special/result/index",
          payload: {
            id: data.activityId
          }
        });
      });
      return;
    }

    doSubscribe(data.activityId).then(() => {
      Taro.hideLoading();

      // 跳转至结果页
      jump({
        url: "/pages/special/result/index",
        payload: {
          id: data.activityId
        }
      });
    });
  };

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
          <View className="tips">{getStateDesc(data)}</View>
        </View>
        <CButton
          disabled={dayjs().isBefore(data.beginTime)}
          onClick={() => {
            if (!agree && data.denyDesc != "已申购") {
              Taro.showToast({
                title: "请先阅读并同意《免责声明》",
                icon: "none"
              });
              return;
            }
            submit();
          }}
          theme="gardient"
          size="small"
          // style="width:100px;"
          style={{ width: "100px" }}
        >
          {getBtnText(data)}
        </CButton>
      </View>
    </View>
  );
};
export default SpecialAction;
