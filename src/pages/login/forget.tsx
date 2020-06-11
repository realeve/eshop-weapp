import Taro, { useEffect } from "@tarojs/taro";
import Forget from "./register";
export default () => {
  useEffect(() => {
    Taro.setNavigationBarTitle({
      title: "忘记密码"
    });
  }, []);
  return <Forget type="forget" />;
};
