import Taro, { useEffect } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import { IFindModel } from "./model";
import { Dispatch } from "redux";
import "./index.scss";

interface IProps extends IFindModel {
  dispatch: Dispatch;
  [key: string]: any;
}
const Find = ({ dispatch, ...props }: IProps) => {
  useEffect(() => {
    console.log("这里对数据的引用", props.stateName);
    dispatch({
      type: "find/setStore",
      payload: {
        stateName: "变更数据"
      }
    });
  }, [props.stateName]);

  return (
    <View className="find-page">
      <Text>find</Text>
    </View>
  );
};

Find.config = {
  navigationBarTitleText: "这是页面标题信息"
};

export default connect(({ find }) => ({
  ...find
}))(Find as any);
