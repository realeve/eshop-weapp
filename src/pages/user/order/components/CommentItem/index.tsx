import Taro, { useEffect } from "@tarojs/taro";
import { View, Image, Text } from "@tarojs/components";
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
    id: (goods && goods.id) || null
  });

  useEffect(() => {
    onChange(state);
  }, [state]);

  if (!goods) {
    return null;
  }
  return (
    <View className="comment">
      <View className="at-input">
        {!goods.comment && (
          <View className="at-input__container vcenter">
            <View className="vcenter">
              <Image
                src={goods.img}
                style={{ width: "50px", height: "50px" }}
              />
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
        )}
        {goods.comment && (
          <View>
            <View className="at-input__container vcenter">
              <View className="vcenter">
                <Image
                  src={goods.img}
                  style={{ width: "50px", height: "50px" }}
                />
              </View>
              <View className="vcenter">
                <View>{goods.name}</View>
                <View>{goods.type}</View>
              </View>
            </View>
            <View style={{ margin: "10px 0" }}>
              <View
                className="at-icon at-icon-message"
                style={{ marginRight: "8px" }}
              />
              已发表评论
            </View>
            <View className="vcenter">
              <View>{goods.comment.content}</View>
              <View>
                {goods.comment.img.map(img => (
                  <Image
                    src={img}
                    key={img}
                    style={{ width: "150px", height: "150px" }}
                  />
                ))}
              </View>
            </View>
            <View className="append">
              <View
                className="at-icon at-icon-message"
                style={{ marginRight: "8px" }}
              />
              追加评论
            </View>
          </View>
        )}
      </View>
      <View style={{ padding: "0 16px" }}>
        <AtTextarea
          placeholder="亲，分享一下收到商品的感受吧"
          value={state.comment}
          onChange={comment => {
            //: comment.detail.value
            setState({ comment });
          }}
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
                  img: imgs.map(({ name }) => name)
                })
              }
            />
          </View>
        </View>
      </View>
    </View>
  );
};
