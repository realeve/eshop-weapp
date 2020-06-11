import Taro from "@tarojs/taro";

const fail = title =>
  Taro.showToast({
    title,
    icon: "none",
    duration: 2000
  }).then(() => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve("done");
      }, 2000);
    });
  });

export default fail;
