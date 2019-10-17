import Taro from "@tarojs/taro";
import { Image } from "@tarojs/components";
import "./index.less";

export interface IProps {
  special: {
    batchId: number;
    imageUrl: string;
  };
}

const BannerImg = ({ special }: IProps) => {
  return special.batchId > 0 ? (
    <Image src={special.imageUrl} className="bannerImg" mode="scaleToFill" />
  ) : null;
};

export default BannerImg;
