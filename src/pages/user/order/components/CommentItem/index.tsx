import Taro, { useEffect } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import { AtRate, AtTextarea } from "taro-ui";
import useSetState from "@/components/hooks/useSetState";
import { CImageUpload } from "@/components";
import "./index.scss";

export interface IUploadImgInfo {
  name: string;
  url: string;
}

export interface IGoodsComment {
  id: number;
  rate: number;
  comment: string;
  type?: string;
  img?: IUploadImgInfo[];
  [key: string]: any;
}

export default ({ goods, onChange }) => {
  const [state, setState] = useSetState({
    rate: 0,
    comment: "",
    img: "",
    id: goods.id
  });

  useEffect(() => {
    onChange(state);
  }, [state]);

  return (
    <View className="comment">
      <View className="at-input">
        <View className="at-input__container vcenter">
          <View className="vcenter">
            <Image src={goods.img} style={{ width: "50px", height: "50px" }} />
            <View className="at-input__title">商品评分：</View>
          </View>
          <View className="at-input__input">
            <AtRate
              value={state.rate}
              onChange={rate => {
                setState({ rate });
              }}
            />
          </View>
        </View>
      </View>
      <View style={{ padding: "0 16px" }}>
        <AtTextarea
          placeholder="亲，分享一下收到商品的感受吧"
          value={state.comment}
          onChange={comment => setState({ comment: comment.detail.value })}
          autoFocus
          maxLength={500}
          height={100}
        />
      </View>
      <View className="at-input">
        <View className="at-input__container">
          <View className="at-input__title" style={{ marginBottom: "10px" }}>
            评价图片
          </View>
          <View className="at-input__input">
            <CImageUpload
              onUpload={imgs =>
                setState({
                  img: imgs.map(({ name }) => name).join(",")
                })
              }
            />
          </View>
        </View>
      </View>
    </View>
  );
};
