import { useEffect, useState, useRouter } from "@tarojs/taro";
import { isLogin, jump } from "@/utils/lib";

const validUrl = ["/pages/user/order/index"];

export default () => {
  const router = useRouter();
  const [login] = useState(isLogin());
  useEffect(() => {
    if (!login && validUrl.includes(router.path || "")) {
      jump("/pages/login/index");
    }
  }, []);
  return login;
};
