import * as R from "ramda";
import moment from "dayjs";

import { getType, axios } from "./axios";

import { API } from "./setting";
import { LocalStorageKeys } from "@/utils/setting";
import Taro from "@tarojs/taro";
export { getType, axios } from "./axios";
import {
  set as setGlobalData,
  get as getGlobalData
} from "@/utils/global_data";

export const tabConfig: {
  pagePath: string;
  text: string;
}[] = [
    {
      pagePath: "/pages/index/index",
      text: "首页"
    },
    {
      pagePath: "/pages/cate/index",
      text: "分类"
    },
    {
      pagePath: "/pages/find/index",
      text: "发现"
    },
    {
      pagePath: "/pages/cart/index",
      text: "购物车"
    },
    {
      pagePath: "/pages/user/index",
      text: "我的"
    }
  ];

// 数据去重
export let uniq = arr => R.uniq(arr);

export const isDateTime = str =>
  /^\d{4}(-|\/|)[0-1]\d(-|\/|)[0-3]\d$|^\d{4}(-|\/|)[0-1]\d(-|\/|)[0-3]\d [0-2][0-9]:[0-5][0-9](:[0-5][0-9])$|^[0-2][0-9]:[0-5][0-9](:[0-5][0-9])$/.test(
    String(str).trim()
  );

export const isMonth = str =>
  /^[1-9]\d{3}(|\-|\/)[0-1]\d$/.test(String(str).trim());

// 数字
export const isNumOrFloat = str =>
  /^(-|\+|)\d+(\.)\d+$|^(-|\+|)\d+$/.test(String(str));

// 整数
export const isInt = str => /^(-|\+)?[1-9]\d*$/.test(String(str));

// 浮点
export const isFloat = str =>
  /^(-|\+|)\d+\.\d+$|^(-|\+|)\d+$/.test(String(str));
export const hasDecimal = str => /^(-|\+|)\d+\.\d+$/.test(String(str));
export const parseNumber = str => {
  if (!hasDecimal(str)) {
    return str;
  }
  return typeof str === "string" ? parseFloat(str).toFixed(3) : str.toFixed(3);
};

export const now = () => moment().format("YYYY-MM-DD HH:mm:ss");

export const timestamp = () => moment().format("x");
export const ymd = () => moment().format("YYYYMMDD");
export const ymdFormat = mill => moment(mill).format("YYYY-MM-DD");
export const mdFormat = mill => moment(mill).format("MM-DD");
export const ymdHmsFormat = mill => moment(mill).format("YYYY-MM-DD HH:mm:ss");
export const formatDateName = str => moment(str).format("YYYY年MM月DD日");
export const formatDateTime = str =>
  moment(str).format("YYYY年MM月DD日hh时mm分ss秒");

export let dataURItoBlob = dataURI => {
  var byteString = atob(dataURI.split(",")[1]);
  var mimeString = dataURI
    .split(",")[0]
    .split(":")[1]
    .split(";")[0];
  var ab = new ArrayBuffer(byteString.length);
  var ia = new Uint8Array(ab);
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], {
    type: mimeString
  });
};

/**
 * wiki: dataURL to blob, ref to https://gist.github.com/fupslot/5015897
 * @param dataURI:base64
 * @returns {FormData}
 * 用法： axios({url,type:'POST',data}).then(res=>res.data);
 */
// 将BASE64编码图像转为FormData供数据上传，用法见上方注释。
export let dataURI2FormData = dataURI => {
  var data = new FormData();
  var blob = dataURItoBlob(dataURI);
  data.append("file", blob);
  return data;
};

/**
 * 千分位格式化数字
 * @param {数字} num
 * @param {小数位数} decimalLength
 */
export const thouandsNum = (num, decimalLength = 2) => {
  if (String(num).length === 0) {
    return "";
  }

  let numStr = Number(num).toLocaleString();
  if (numStr.includes(".")) {
    let [integer, decimal] = numStr.split(".");
    return integer + "." + decimal.padEnd(decimalLength, "0");
  }
  return numStr + "." + "".padEnd(decimalLength, "0");
};

// redux中 setStore部分，自动解析数据类型
export const setStore = (state, store) => {
  let { payload } = store;
  if (typeof payload === "undefined") {
    payload = store;
    // throw new Error('需要更新的数据请设置在payload中');
  }
  let nextState = R.clone(state);
  Object.keys(payload).forEach(key => {
    let val = payload[key];
    if (getType(val) == "object") {
      nextState[key] = Object.assign({}, nextState[key], val);
    } else {
      nextState[key] = val;
    }
  });
  return nextState;
};

export const setUserStore = (state, store) => {
  let { payload } = store;
  if (typeof payload === "undefined") {
    payload = store;
  }

  if (payload && payload.isLogin && payload.user) {
    let localStore = Taro.getStorageSync(LocalStorageKeys.user) || "{}";
    let store = { ...JSON.parse(localStore), ...payload.user };
    // 存储手机号
    Taro.setStorage({
      key: LocalStorageKeys.phone,
      data: store.phone
    });

    Taro.setStorage({
      key: LocalStorageKeys.user,
      data: JSON.stringify(store)
    });
  }
  return setStore(state, store);
};

export const clearUser = () => {
  Taro.removeStorage({ key: LocalStorageKeys.user });
  Taro.removeStorage({ key: LocalStorageKeys.token });
  let g_axios = getGlobalData("g_axios");
  g_axios = Reflect.deleteProperty(g_axios, "token");
  setGlobalData("g_axios", g_axios);
  setGlobalData("token", "");
};

// 判断字符串是不是中文
export const isChineseWord = str => new RegExp(/[\u00A1-\uFFFF]/).test(str);

/**
 * @param str {string} 输出字符串
 * @returns {string} 首字母大写
 */
export const capitalizeFirstLetter = (str = "") =>
  str[0].toUpperCase() + str.slice(1);

export const reg = {
  phone: /^[1][3,4,5,7,8,9][0-9]{9}$/,
  email: /^[A-Za-z0-9]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
  account: /^[0-9A-Za-z\\-_\\.]+$/,
  sn: /^[0-9]{4}$|^[0-9]{6}$/,
  password: /^.*(?=.{8,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z]).*$/
};

// 等待指定时长
export const sleep = time => new Promise(resolve => setTimeout(resolve, time));

export const getAddressList = areaid =>
  axios({
    method: "get",
    url: `${API.ADDRESS_LIST}/areaId=${areaid}`
  });

const WEEKDAYS = ["周日", "周六", "周五", "周四", "周三", "周二", "周一"];
export const getSaleTimeWeek = ({ week }) => {
  if (week === 31) {
    return "工作日 (周一至周五)";
  }
  let str = [];
  week
    .toString(2)
    .padStart(7, "0")
    .split("")
    .forEach((d, idx) => (d === "1" ? str.push(WEEKDAYS[idx]) : false));
  return str.reverse().join("，");
};

export const getSaleTimeRange = ({ range }) =>
  range
    .split(",")
    .map(item =>
      item
        .split("-")
        .map(t => t.substr(0, 2) + ":" + t.substr(2))
        .join("-")
    )
    .join(" , ");

export const checkSaleTimeToday = week => {
  if (week > 127 || week < 0) {
    return Promise.reject("销售周期设置错误");
  }
  // 此处待调试
  let today = Number(moment().day(0));
  return (
    week
      .toString(2)
      .padStart(7, "0")
      .split("")[7 - today] === "1"
  );
};

export const canSelloutNow = param => {
  if (!param) {
    return true;
  }
  let { week, dayTimeRange: range } = param;
  if (!week && !range) {
    return true;
  }
  if (week && !checkSaleTimeToday(week)) {
    return false;
  }
  if (range) {
    let arr = range
      .split(",")
      .map(item =>
        item.split("-").map(t => t.substr(0, 2) + ":" + t.substr(2))
      );
    let now = moment();
    if (arr) {
      let rs = arr.filter(
        a =>
          now.isAfter(moment().format("YYYY-MM-DD ") + a[0]) &&
          now.isBefore(moment().format("YYYY-MM-DD ") + a[1])
      );
      return rs && rs.length > 0;
    } else {
      return false;
    }
  }
  return true;
};

// 判断是否登录，用于购物车条件请求
export const isLogin = () => {
  let u = Taro.getStorageSync(LocalStorageKeys.user);
  // console.info(u, typeof u);
  return u && typeof u === "object";
};

export const hidePhone = phone =>
  phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");

// 记录验证码发送状态
export const setSNSendStatus = status => {
  if (status) {
    Taro.setStorage({ key: LocalStorageKeys.SNS, data: status });
    return;
  }
  Taro.removeStorage({ key: LocalStorageKeys.SNS });
};

export const loadSNSendStatus = () => Taro.getStorageSync(LocalStorageKeys.SNS);

export const setPhone = data => {
  Taro.setStorage({
    key: LocalStorageKeys.phone,
    data
  });
};

export const loadPhone = () =>
  Taro.getStorageSync(LocalStorageKeys.phone) || "";

const PAGE_WEBVIEW = "/pages/webview/webview";
function urlStringify(url, payload, encode = true) {
  const arr = Object.keys(payload).map(
    key => `${key}=${encode ? encodeURIComponent(payload[key]) : payload[key]}`
  );

  // NOTE 注意支付宝小程序跳转链接如果没有参数，就不要带上 ?，否则可能无法跳转
  return arr.length ? `${url}?${arr.join("&")}` : url;
}

/**
 * // NOTE 后端返回的 url 可能是网页链接，需要在 webview 中打开
 * 也可能是小程序自身的链接，只能用 navigate/redirect 之类的打开
 * 就需要有个地方统一判断处理
 */
export function jump(options) {
  let { url, title = "", payload = {}, method = "navigateTo" } = options;
  url = url || options;

  // tab 页面路由
  const isTabPage = tabConfig.find(item => url.includes(item.pagePath));
  if (isTabPage) {
    Taro.switchTab({ url });
    return;
  }

  if (/^https?:\/\//.test(url)) {
    Taro[method]({
      url: urlStringify(PAGE_WEBVIEW, { url, title })
    });
    return;
  }
  if (/^(|\/)pages\//.test(url)) {
    // TODO H5 不支持 switchTab，暂时 hack 下
    if (process.env.TARO_ENV === "h5" && method === "switchTab") {
      Taro.navigateBack({ delta: Taro.getCurrentPages().length - 1 });
      setTimeout(() => {
        Taro.redirectTo({ url });
      }, 100);
      return;
    }

    Taro[method]({
      url: urlStringify(url, payload)
    });
  }
}

/**
 * 处理htmlTag，供 Rich-Text组件调用，移除其中无效的空格、换行，防止出现多行空文字的bug
 * <Text></Text>
 * @params String 需要处理的html字符串
 * @returns String 返回处理的结果
 */
export const handleHtmlTags = html =>
  (String(html) || "")
    .replace(/(  +)/g, " ")
    .replace(/\r|\n/g, "")
    .replace(/>( |\t)+\</gim, "><")
    .trim();

/**
 *
 * @param body 从服务端获取html的文本数据
 * @returns 返回供 Rich-Text组件调用的字符串
 */
export const htmlFormat = body => {
  return handleHtmlTags(
    (String(body).match(/\<body\>([\s\S]*)\<\/body\>/) || [])[1] || ""
  );
};

export const randomStr = () =>
  Math.random()
    .toString(36)
    .substring(2);

export const getMemberInfo = () => {
  let localStore = Taro.getStorageSync(LocalStorageKeys.user) || "{}";
  return JSON.parse(localStore);
}
export const isWeapp = Taro.getEnv() === "WEAPP";
