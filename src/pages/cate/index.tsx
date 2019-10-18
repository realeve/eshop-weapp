import Taro, { useEffect } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import { ICateModel } from "./model";
import { Dispatch } from "redux";
import "./index.scss";

interface IProps extends ICateModel {
  dispatch: Dispatch;
  [key: string]: any;
}

const Index = ({ dispatch, ...props }: IProps) => {
  useEffect(() => {
    console.log("这里对数据的引用", props.stateName);
    dispatch({
      type: "cate/setStore",
      payload: {
        stateName: "变更数据"
      }
    });
  }, [props.stateName]);

  return (
    <View className="index-page">
      <Text>cate{props.stateName}</Text>
    </View>
  );
};

Index.config = {
  navigationBarTitleText: "类目页"
};

export default connect(({ cate }: { cate: ICateModel }) => ({
  ...cate
}))(Index as any);
