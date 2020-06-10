import Taro from "@tarojs/taro";
import wButton from "./wButton";
import h5Button from "./h5Button";

export default Taro.getEnv() == "WEAPP" ? wButton : h5Button;
