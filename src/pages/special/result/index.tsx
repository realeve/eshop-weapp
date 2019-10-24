import Taro, { useRouter, useState, useEffect } from "@tarojs/taro";

import { View } from "@tarojs/components";

import "./index.scss";
import { connect } from "@tarojs/redux";
import { API } from "@/utils/setting";
import { useFetch, CButton, CDot } from "@/components/";
import { handleSubscribe, ISubscribe } from "../db";

import SpecialPanel from "./panel";
import SpecialStep from "./step";
import SpecialCard from "./card";
import { jump } from "@/utils/lib";

interface IProps {
  [key: string]: any;
}
const SpecialResult = ({ dispatch, special }: IProps) => {
  const {
    params: { id }
  } = useRouter();

  const { data: subscribe, loading } = useFetch<ISubscribe>({
    param: { url: `${API.SP_SUBSCRIBER_INFO}/${id}` },
    callback: e => handleSubscribe(e, dispatch),
    valid: () => id > "0" && !special
  });

  const status = "unlucky";

  return (
    <View className="special-page__result">
      <SpecialPanel data={{ status, loading: special ? false : loading }} />
      <SpecialStep current={1} />
      <SpecialCard title="中签公告" className="result_container">
        <View className="result__content">
          <View className="list-item">
            <CDot /> 本次活动共有123456人预约，共抽取中签号95个
          </View>
          <View className="list-item">
            <CDot /> 如有疑问，请联系在线客服或者致电15647368479
          </View>
        </View>
        <View className="result__footer">
          <View
            className="result__footer__rules"
            onClick={() => {
              jump({
                url: "/pages/special/rule"
              });
            }}
          >
            <View
              className="at-icon at-icon-tag"
              style="color:#b98a4e;padding-right:5px;"
            />
            抽签规则
          </View>
          <View className="at-icon at-icon-chevron-right" />
        </View>
      </SpecialCard>
      <CButton
        theme="gardient"
        className="special__result__action"
        onClick={() => {
          jump({
            url: "/pages/index"
          });
        }}
      >
        回到首页
      </CButton>
    </View>
  );
};

SpecialResult.config = {
  navigationBarTitleText: "预约结果"
};

export default connect(({ special }) => special)(SpecialResult as any);
