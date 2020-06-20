import Taro from "@tarojs/taro";
export default title =>
  Taro.showToast({ title, duration: 2000 }).then(() => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve("done");
      }, 2000);
    });
  });
