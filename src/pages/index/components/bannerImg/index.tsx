import Taro from "@tarojs/taro";
import { Image } from "@tarojs/components";
import "./index.scss";

export interface IProps {
  special: {
    batchId: number;
    imageUrl: string;
  };
}

const BannerImg = ({ special }: IProps) => {
  console.log(special);
  return special.batchId > 0 ? (
    <Image
      src={special.imageUrl}
      className="bannerImg"
      mode="scaleToFill"
      onClick={() => {
        Taro.navigateTo({
          url: "/pages/special/index?id=" + special.batchId
        });
      }}
    />
  ) : null;
};

export default BannerImg;
