import Taro, { useRouter, useState, useEffect } from "@tarojs/taro";

import { View, Text } from "@tarojs/components";

import "./index.scss";
import { connect } from "@tarojs/redux";
import { API } from "@/utils/setting";
import { CButton, CDot } from "@/components/";
import useFetch from "@/components/hooks/useFetch";
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
  console.log(subscribe);

  return (
    <View className="special-page__result">
      <SpecialPanel data={{ status, loading: special ? false : loading }} />
      <SpecialStep current={1} />
      <SpecialCard title="中签公告" className="result_container">
        <View className="result__content">
          <View className="list-item">
            <CDot />
            <Text style="margin-left:10px;">
              本次活动共有123456人预约，共抽取中签号95个
            </Text>
          </View>
          <View className="list-item">
            <CDot />
            <Text style="margin-left:10px;">
              如有疑问，请联系在线客服或者致电15647368479
            </Text>
          </View>
        </View>
        <View className="result__footer">
          <View
            className="result__footer__rules"
            onClick={() => {
              jump({
                url: "/pages/special/rule/index"
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
