import Taro from "@tarojs/taro";

const fail = title =>
  Taro.showToast({
    title,
    icon: "none"
  });

export default fail;
