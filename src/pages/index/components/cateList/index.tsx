import Taro from "@tarojs/taro";
import { View } from "@tarojs/components";
import "./index.scss";
import * as R from "ramda";

import { jump } from "@/utils/lib";

export interface ICateItem {
  commonId: number;
  data: string;
  imageUrl: null;
  summary: null;
  titleCh: string;
  titleEn: string;
  type: string;
}

export interface IProps {
  data: ICateItem[];
  [key: string]: any;
}

const CateList = ({ data = [], dispatch }: IProps) => {
  return (
    <View className="cateList">
      {R.splitEvery(3, data.slice(0, 6)).map((row, rowId) => (
        <View className="row" key={rowId + ""}>
          {row.map(item => (
            <View
              className="item"
              key={item.name}
              onClick={() => {
                dispatch({
                  type: "common/setStore",
                  payload: {
                    curCateId: item.id
                  }
                });
                jump(`/pages/cate/index`);
              }}
            >
              {item.name}
            </View>
          ))}
        </View>
      ))}
    </View>
  );
  // return (
  //   <View className="cateList">
  //     {R.splitEvery(3, data).map((row, rowId) => (
  //       <View className="row" key={rowId + ""}>
  //         {row.map(item => (
  //           <View className="item" key={item.titleCh} onClick={() => {}}>
  //             {item.titleCh}
  //           </View>
  //         ))}
  //       </View>
  //     ))}
  //   </View>
  // );
};

export default CateList;
