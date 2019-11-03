export let DEV: boolean =
  process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test";

/**
 * 开发环境
 * {"token":"eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJiN2EyOGVjZTZkNDA0ODU0YTBiZTlhMzkzZTM0YWU0MSIsInN1YiI6IndlYiIsImlhdCI6MTU3MDI0NDQ4NywiZXhwIjoxNTcwODQ5Mjg3LCJwYXJhbXMiOnsidWlkIjoyMDAwMDI0LCJ1bmFtZSI6InVfMDAyMzE1NjUwMTM4IiwiZnAiOiI2OTM1NTIwYWY0MmY2NTg2MjNiNDJhNzg2ZGMxMmI5YyIsInJwIjoxfX0.hgHXoVNa8DGRHkSqRQ8A5vw8B5ApbQ5QES-McJBlFB0","avatar":"http://shop.vlink.ltd/upload/image/07/a6/07a6861b7566ac1611546fd93584ca5a.png","uid":2000024,"account":"微信","memberName":"u_002315650138","trueName":"*宾","phone":"18628123455","sex":"男","birthday":"2000-01-01","authState":30,"isRealNamePassed":true,"authMessage":"已通过"}
 */
// const SETTING: { [key: string]: string } = {
//   host: "https://shop.vlink.ltd/api",
//   oss: "https://nctest-upload.oss-cn-hangzhou.aliyuncs.com",
//   base: "/",
//   publicPath: "/",
//   IM: "https://shop.vlink.ltd:3000/member",
//   invoice: "http://web.hydzfp.com/ei_access/html/downloadMobilePdf.do"
// };

/**
 * 测评环境
 * {"token":"eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJiZWZiMjI5ZjI1MzE0MDY4YjhhMjI5N2QyOWJhOGE3MiIsInN1YiI6IndhcCIsImlhdCI6MTU3MDI0NTIwOCwiZXhwIjoxNTcwODUwMDA4LCJwYXJhbXMiOnsidWlkIjoxNiwidW5hbWUiOiJ1XzAwMTUxNTY4OTQyNyIsImZwIjoiNjkzNTUyMGFmNDJmNjU4NjIzYjQyYTc4NmRjMTJiOWMiLCJycCI6MX19.EO74AForPC8nazdLVDzq4PFCnbo8D9GF2BVKxpGjEdQ","avatar":"https://statictest.ccgold.cn/image/18/ad/18ad32b1ddaa26601ba789f28b1317cd.jpg","uid":16,"account":"微信","memberName":"u_001515689427","trueName":"*宾","phone":"18628123455","sex":"保密","birthday":null,"authState":30,"isRealNamePassed":true,"authMessage":"已通过"}
 */
// const SETTING: { [key: string]: string } = {
//   host: "https://apitest.ccgold.cn/api",
//   oss: "https://statictest.ccgold.cn",
//   base: "/",
//   publicPath: "/",
//   IM: "https://imtest.ccgold.cn/member",
//   invoice: "http://web.hydzfp.com/ei_access/html/downloadMobilePdf.do"
// };

/**
 * 生产环境
 */
const SETTING: { [key: string]: string } = {
  host: "https://api.ccgold.cn/api",
  oss: "https://static.ccgold.cn",
  base: "/",
  publicPath: "/",
  IM: "https://im.ccgold.cn/member",
  invoice: "http://web.hydzfp.com/ei_access/html/downloadMobilePdf.do"
};

// https://www.ccgold.cn/index.html
// https://w3.ccgold.cn/index.html

// 全局平台销售客服ID；
export const GLOBAL_SELLER = 1;

export const UPLOAD_URL = SETTING.host + "/member/image/upload";

// 后台api部署域名
const host: string = SETTING.host;
const domain = host;

export const OSS_URL = SETTING.oss;

export const IM = SETTING.IM;
export const INVOICE = SETTING.invoice;

export enum CLIENT_TYPE {
  andriod = "android",
  ios = "ios",
  wap = "wap",
  wechat = "wechat",
  web = "wechat" //"web" // 从web端复制过来的涉及到client_type的接口，全部调用 wechat
}

export enum PAYMENT {
  alipay = "alipay",
  wechat = "wxpay",
  unionpay = "unionpay"
}

export { domain, host };
export { API } from "./api";

/**
 * localStorage Keys
 * @param shoppingCart 购物车
 * @param user 用户登录信息
 * @param FingerPrint 指纹
 * @param SNS 短信
 *
 */
export const LocalStorageKeys = {
  token: "token",
  shoppingCart: "booking", //购物车
  user: "user", // 用户身份
  FingerPrint: "fp", // 指纹
  SNS: "isSNSend", // 短信发送时间
  lastVisited: "lastVisited", // 上次访问页面
  phone: "phone", // 上次登录电话
  confirm: "confirm" //立即购买
};

export const copyright = {
  text: ` 2016-${new Date().getFullYear()} 中钞长城贵金属有限公司 `,
  tel: "400 8122 200"
};
