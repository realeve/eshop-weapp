import Taro, { useRouter, useState, useEffect } from "@tarojs/taro";

import { View, Text } from "@tarojs/components";

import "./index.scss";
import { connect } from "@tarojs/redux";
import { API, GLOBAL_SELLER } from "@/utils/setting";
import { CButton, CDot } from "@/components/";
import useFetch from "@/components/hooks/useFetch";

import SpecialPanel, { IResultProp } from "./panel";
import SpecialStep from "./step";
import SpecialCard from "./card";
import { jump } from "@/utils/lib";
import Skeleton from "taro-skeleton";

import dayjs from "dayjs";
import {
  handleSubscribe,
  ISubscribe,
  getTimeDescByScribe,
  getPhase,
  TOrderState,
  DENY_CODE
} from "../db";

interface IProps {
  [key: string]: any;
}

const dateFormat = (mill: string) => dayjs(mill).format("YYYY-MM-DD HH:mm:ss");

const getSpecialResult = (subscribe, activityId) => {
  const imInfo = { gid: subscribe.commonId, sid: GLOBAL_SELLER };

  // 已抽签未付款
  let orderType: TOrderState = subscribe.isWin
    ? subscribe.isPay
      ? "payed"
      : "lucky"
    : "unsigned";

  // 中签未付款
  if (
    orderType === "lucky" &&
    dayjs().isAfter(dateFormat(subscribe.payExpireTime))
  ) {
    orderType = "lost";
  }

  let typeDesc = "";
  if (![2].includes(subscribe.denyCode) && orderType === "unsigned") {
    orderType = "other";
    typeDesc = DENY_CODE[subscribe.denyCode];
  }

  // 已预约，未开奖
  if (subscribe.denyCode === 3 && subscribe.subscriberSn && !subscribe.isWin) {
    orderType = "signed";
  }

  // 已预约，已开奖,未显示【已中奖】，则为未中奖
  if (
    orderType === "signed" &&
    subscribe.isWin === 0 &&
    subscribe.remainDrawTime == 0
  ) {
    orderType = "unlucky";
  }
  let subText: string | null = null;

  // 如果为'unlucky' 并且待抽签
  if (
    subscribe.subscribeStateStr === null &&
    dayjs().isBefore(subscribe.drawTime)
  ) {
    orderType = "waittingDraw";
    typeDesc = "预约成功";
    subText = "请耐心等待抽签";
  }

  // 当前步骤，如果已中签，但未付款，指向结束
  let current = getPhase(subscribe);
  if (subscribe.state === 50 && orderType === "lost") {
    current = 4;
  }

  console.log({ subscribe });
  let data: IResultProp = {
    activityId,
    sn: subscribe.subscriberSn,
    lotteryDate: subscribe.drawTime,
    countDown: dateFormat(subscribe.endTime),
    phone: subscribe.phone,
    total: subscribe.subscribeQuantity || 0,
    type: orderType,
    orderId: subscribe.orderId,
    typeDesc,
    subText,
    lucky: subscribe.issueQuantity,
    payedBefore: dateFormat(subscribe.payExpireTime),
    curPeople: subscribe.subscribeQuantity || 0,
    current,
    payId: subscribe.payId,
    phases:
      subscribe.state === 9999
        ? ["活动停止"]
        : ["未开始", "预约中", "抽签", "购买", "结束"]
  };

  let limit = getTimeDescByScribe(subscribe);

  return {
    limit,
    data,
    imInfo
  };
};

// const checkOrder = (subscribe, subscribeResult) => {
//   if (!subscribe) {
//     return;
//   }
//   if ("lucky" === subscribeResult.type) {
//     if (!subscribe.payId) {
//       Taro.showToast({
//         title: `未能获得中签用户订单号，请刷新页面或联系平台客服。`
//       });
//       return;
//     }
//     jump(`/special/confirm/${subscribe.orderId}`);
//   }
//   if ("payed" === subscribeResult.type) {
//     Taro.showToast({
//       title: `该订单已支付，请在我的预约中查看。`
//     });
//   }

//   if ("signed" === subscribeResult.type) {
//     jump(`/order/lottery`);
//   }
// };

const SpecialResult = ({ dispatch, special }: IProps) => {
  const {
    params: { id }
  } = useRouter();

  const { data: subscribe, loading } = useFetch<ISubscribe>({
    param: { url: `${API.SP_SUBSCRIBER_INFO}/${id}` },
    callback: e => handleSubscribe(e, dispatch),
    valid: () => id > "0" // && !special
  });

  const [specialResult, setSpecialResult] = useState({
    data: {
      current: 0
    }
  });

  useEffect(() => {
    if (!special) {
      return;
    }
    // console.log({ special, id });
    let res = getSpecialResult(special, id);
    setSpecialResult(res);
    // console.log(res);
  }, [special]);

  // console.log("subscribe", subscribe);
  // console.log("special", special);

  return (
    <View className="special-page__result">
      <SpecialPanel data={specialResult.data} loading={!special} />
      <SpecialStep current={specialResult.data.current} />
      <Skeleton loading={!specialResult.imInfo} row={6} rowHeight={30}>
        <SpecialCard title="中签公告" className="result_container">
          <View className="result__content">
            <View className="list-item">
              <CDot />
              <Text
                //  style="margin-left:10px;font-size:14px;"
                style={{ marginLeft: "10px", fontSize: "14px" }}
              >
                本次活动共有{specialResult.data.curPeople}人预约，共抽取中签号
                {specialResult.data.lucky}个
              </Text>
            </View>
            <View className="list-item">
              <CDot />
              <Text style={{ marginLeft: "10px", fontSize: "14px" }}>
                如有疑问，请联系在线客服或者致电{specialResult.data.phone}
              </Text>
            </View>
          </View>
          <View
            className="result__footer"
            onClick={() => {
              jump({
                url: "/pages/special/rule/index"
              });
            }}
          >
            <View className="result__footer__rules">
              <View
                className="at-icon at-icon-tag"
                // style="color:#b98a4e;padding-right:5px;"
                style={{ color: "#b98a4e", paddingRight: "5px" }}
              />
              抽签规则
            </View>
            <View className="at-icon at-icon-chevron-right" />
          </View>
        </SpecialCard>
      </Skeleton>
      <View className="special__result__action">
        <CButton
          theme="gardient"
          onClick={() => {
            jump({
              url: "/pages/index/index"
            });
          }}
        >
          回到首页
        </CButton>
      </View>
    </View>
  );
};

SpecialResult.config = {
  navigationBarTitleText: "预约抽签规则"
};

export default connect(({ special }) => special)(SpecialResult as any);
