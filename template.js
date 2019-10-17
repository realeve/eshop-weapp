/**
 * pages模版快速生成脚本,执行命令 npm run tep `文件名`
 */

const fs = require("fs");

const dirName = process.argv[2];

if (!dirName) {
  console.log("文件夹名称不能为空！");
  console.log("示例：npm run tep test");
  process.exit(0);
}

// 页面模版
const indexTep = `import Taro, { useEffect } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import { I${titleCase(dirName)}Model } from "./model";
import { Dispatch } from "redux";
import "./index.less";
 
interface IProps extends I${titleCase(dirName)}Model {
  dispatch: Dispatch;
  [key: string]: any;
}
const ${titleCase(dirName)} = ({ dispatch, ...props }: IProps) => {
  useEffect(() => {
    console.log("这里对数据的引用", props.stateName);
    dispatch({
      type: "${dirName}/setStore",
      payload: {
        stateName: "变更数据"
      }
    });
  }, [props.stateName]);

  return (
    <View className="${dirName}-page">
      <Text>${dirName}</Text>
    </View>
  );
}; 

${titleCase(dirName)}.config = {
  navigationBarTitleText: "这是页面标题信息"
};

export default connect(({${dirName}}) => ({
  ...${dirName},
}))(${titleCase(dirName)} as any);
`;

// less文件模版
const lessTep = `@import "../../styles/index.less";

.${dirName}-page {
  width: 100%;
  height: 100%;
}  
`;

// model文件模版
const modelTep = `import * as db from "./service";
import { setStore } from "@/utils/lib";

export interface I${titleCase(dirName)}Model {
  stateName: string;
  [key:string]: any;
}

const state: I${titleCase(dirName)}Model = {
  stateName: "这里是全局挂载的数据"
};

export default {
  namespace: "${dirName}",
  state,
  reducers: {
    setStore
  },
  effects: {
    *effectsDemo(_, { call, put }) {
      const { status, data } = yield call(db.demo, {});
      if (status === "ok") {
        yield put({
          type: "setStore",
          payload: {
            topData: data
          }
        });
      }
    }
  }
}; 
`;

// service页面模版
const serviceTep = `import { axios } from "@/utils/axios";

export const demo = data => {
  return axios({
    url: "路径",
    method: "POST",
    data
  });
}; 
`;

fs.mkdirSync(`./src/pages/${dirName}`); // mkdir $1
process.chdir(`./src/pages/${dirName}`); // cd $1

fs.writeFileSync("index.tsx", indexTep);
fs.writeFileSync("index.less", lessTep);
fs.writeFileSync("model.ts", modelTep);
fs.writeFileSync("service.ts", serviceTep);

console.log(`模版${dirName}已创建,请到models目录中手动增加models`);

function titleCase(str) {
  const array = str.toLowerCase().split(" ");
  for (let i = 0; i < array.length; i++) {
    array[i] =
      array[i][0].toUpperCase() + array[i].substring(1, array[i].length);
  }
  const string = array.join(" ");
  return string;
}

process.exit(0);
