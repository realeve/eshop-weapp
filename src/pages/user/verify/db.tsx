import { axios } from "@/utils/axios";
import { API } from "@/utils/setting";

export const AUTH_STATE: { [key: number]: string } = {
  10: "认证中",
  20: "认证未通过",
  30: "认证通过",
  90: "未认证"
};

export const realnameVerify = (data: any): Promise<any> =>
  axios({
    method: "post",
    url: API.REALNAME_AUTH as string,
    headers: { "content-type": "application/json" },
    data
  });
