import Taro, { useEffect } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import { IUserModel } from "./model";
import { Dispatch } from "redux";
import "./index.scss";

interface IProps extends IUserModel {
  dispatch: Dispatch;
  [key: string]: any;
}
const User = ({ dispatch, ...props }: IProps) => {
  useEffect(() => {
    console.log("这里对数据的引用", props.stateName);
    dispatch({
      type: "user/setStore",
      payload: {
        stateName: "变更数据"
      }
    });
  }, [props.stateName]);

  return (
    <View className="user-page">
      <Text>user</Text>
    </View>
  );
};

User.config = {
  navigationBarTitleText: "这是页面标题信息"
};

export default connect(({ user }) => ({
  ...user
}))(User as any);
