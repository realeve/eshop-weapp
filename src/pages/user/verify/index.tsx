import Taro, { useState } from "@tarojs/taro";
import { View } from "@tarojs/components";
import "./index.scss";
import { IGlobalModel } from "@/models/common";
import { connect } from "@tarojs/redux";
import useLogin from "@/components/hooks/useLogin";
import CButton from "@/components/CButton";
import useSetState from "@/components/hooks/useSetState";
import { AtInput, AtCheckbox } from "taro-ui";

import success from "@/components/Toast/success";
import fail from "@/components/Toast/fail";

import * as db from "./db";
import { jump } from "@/utils/lib";

const Verify = ({ user }) => {
  let isLogin = useLogin();
  const [state, setState] = useSetState({
    memberId: user.uid,
    authRealName: "",
    idCartNumber: ""
  });
  const [isAgree, setIsAgree] = useState<string>("");

  const submit = async () => {
    if (state.authRealName.trim().length == 0) {
      fail("请填写真实姓名");
      return;
    }
    if (
      state.idCartNumber.trim().length != 18 ||
      !/^\d{17}(\d|X|x)$/.test(state.idCartNumber)
    ) {
      fail("身份证信息无效");
      return;
    }
    db.realnameVerify(state).then(res => {
      success(res.errorMsg).then(() => {
        jump("/pages/user/index");
      });
    });
  };

  return (
    isLogin && (
      <View className="verify">
        <View className="main">
          <View className="verify_title">请您填写以下信息,进行验证</View>
          <View className="item">
            <View className="fieldname">姓名</View>
            <AtInput
              name="authRealName"
              placeholder="请填写您的真实姓名"
              value={state.authRealName}
              onChange={authRealName => {
                setState({ authRealName });
              }}
              clear
              autoFocus
            />
          </View>
          <View className="item">
            <View className="fieldname">身份证</View>
            <AtInput
              name="idCartNumber"
              placeholder="请填写您的身份证号码"
              value={state.idCartNumber}
              onChange={idCartNumber => {
                setState({ idCartNumber });
              }}
              clear
              autoFocus
            />
          </View>

          <AtCheckbox
            options={[
              {
                value: "agree",
                label: "确认信息真实有效"
              }
            ]}
            selectedList={[isAgree]}
            onChange={([, e]) => {
              setIsAgree(e === "agree" ? e : "");
            }}
          />

          <CButton
            theme="gardient"
            disabled={isAgree !== "agree"}
            onClick={submit}
            style={{ margin: "30px auto 0 auto" }}
          >
            提交信息
          </CButton>

          <View className="introduce">
            声明：我们会采用符合业界标准的安全防护措施来防止您的个人信息遭到未经授权的访问、公开披露、使用、修改、损坏或丢失。
            <br />
            我们努力使用各种合理的制度、技术、程序以及物理层面的措施来保护您的个人信息不被未经授权的访问、篡改、披露或破坏，包括但不限于SSL传输加密技术、信息存储加密技术、数据中心的访问权限控制等技术或措施。
          </View>
        </View>
      </View>
    )
  );
};

Verify.config = {
  navigationBarTitleText: "身份验证"
};

export default connect(({ common: { user, isLogin } }: IGlobalModel) => ({
  user,
  isLogin
}))(Verify as any);
