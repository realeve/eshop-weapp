import Taro from "@tarojs/taro";
import { View } from "@tarojs/components";
import "./index.scss";
import * as R from "ramda";
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

const CateList = ({ data }: IProps) => {
  return (
    <View className="cateList">
      {R.splitEvery(3, data).map((row, rowId) => (
        <View className="row" key={rowId}>
          {row.map(item => (
            <View className="item" key={item.titleCh}>
              {item.titleCh}
            </View>
          ))}
        </View>
      ))}
    </View>
  );
};

export default CateList;
