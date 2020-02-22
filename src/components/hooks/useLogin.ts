import { useEffect, useState, useRouter } from "@tarojs/taro";
import { isLogin, jump } from "@/utils/lib";
export default () => {
  const router = useRouter();
  const [login] = useState(isLogin());
  useEffect(() => {
    console.log("router", router);
    if (!login && ["/pages/user/order/index"].includes(router.path || "")) {
      jump("/pages/login/index");
    }
  }, []);
  return null;
};
