import Taro from "@tarojs/taro";

const fail = title =>
  Taro.showToast({
    title,
    icon: "none",
    duration: 2000
  });

export default fail;
