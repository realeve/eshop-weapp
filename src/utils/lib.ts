import * as R from "ramda";
import moment from "dayjs";

import { getType, axios } from "./axios";

import { API } from "./setting";
import { LocalStorageKeys } from "@/utils/setting";
import Taro from "@tarojs/taro";

// 数据去重
export let uniq: <T>(arr: Array<T>) => Array<T> = arr => R.uniq(arr);

interface IPropVariableType {
  (str: string | number): boolean;
}

export interface IProp {
  [key: string]: string | number | any;
}

export const isDateTime: IPropVariableType = str =>
  /^\d{4}(-|\/|)[0-1]\d(-|\/|)[0-3]\d$|^\d{4}(-|\/|)[0-1]\d(-|\/|)[0-3]\d [0-2][0-9]:[0-5][0-9](:[0-5][0-9])$|^[0-2][0-9]:[0-5][0-9](:[0-5][0-9])$/.test(
    String(str).trim()
  );

export const isMonth: IPropVariableType = str =>
  /^[1-9]\d{3}(|\-|\/)[0-1]\d$/.test(String(str).trim());

// 数字
export const isNumOrFloat: IPropVariableType = str =>
  /^(-|\+|)\d+(\.)\d+$|^(-|\+|)\d+$/.test(String(str));

// 整数
export const isInt: IPropVariableType = str =>
  /^(-|\+)?[1-9]\d*$/.test(String(str));

// 浮点
export const isFloat: IPropVariableType = str =>
  /^(-|\+|)\d+\.\d+$|^(-|\+|)\d+$/.test(String(str));
export const hasDecimal: IPropVariableType = str =>
  /^(-|\+|)\d+\.\d+$/.test(String(str));
export const parseNumber: {
  (str: number): number | string;
} = str => {
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
export const formatDateName = (str: string) =>
  moment(str).format("YYYY年MM月DD日");
export const formatDateTime = (str: string) =>
  moment(str).format("YYYY年MM月DD日hh时mm分ss秒");

export let dataURItoBlob = (dataURI: string) => {
  var byteString: string = atob(dataURI.split(",")[1]);
  var mimeString: string = dataURI
    .split(",")[0]
    .split(":")[1]
    .split(";")[0];
  var ab: ArrayBuffer = new ArrayBuffer(byteString.length);
  var ia: Uint8Array = new Uint8Array(ab);
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
export let dataURI2FormData: {
  (dataURI: string): FormData;
} = dataURI => {
  var data: FormData = new FormData();
  var blob: Blob = dataURItoBlob(dataURI);
  data.append("file", blob);
  return data;
};

export const getBase64 = (file: Blob) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });

/**
 * 千分位格式化数字
 * @param {数字} num
 * @param {小数位数} decimalLength
 */
export const thouandsNum: {
  (num: number, len?: number): string;
} = (num, decimalLength = 2) => {
  if (String(num).length === 0) {
    return "";
  }

  let numStr: string = Number(num).toLocaleString();
  if (numStr.includes(".")) {
    let [integer, decimal] = numStr.split(".");
    return integer + "." + decimal.padEnd(decimalLength, "0");
  }
  return numStr + "." + "".padEnd(decimalLength, "0");
};

interface Store {
  payload: any;
}

// redux中 setStore部分，自动解析数据类型
export const setStore = (state: any, store: Store) => {
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

export const setUserStore = (state: any, store: Store) => {
  let { payload } = store;
  if (typeof payload === "undefined") {
    payload = store;
  }

  if (payload && payload.isLogin && payload.user) {
    let localStore = Taro.getStorageSync(LocalStorageKeys.user);
    if (localStore) {
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
  }
  return setStore(state, store);
};

// 判断字符串是不是中文
export const isChineseWord: (str: string) => boolean = (str: string) =>
  new RegExp(/[\u00A1-\uFFFF]/).test(str);

/**
 * @param str {string} 输出字符串
 * @returns {string} 首字母大写
 */
export const capitalizeFirstLetter: (str: string) => string = (str = "") =>
  str[0].toUpperCase() + str.slice(1);

export const reg = {
  phone: /^[1][3,4,5,7,8,9][0-9]{9}$/,
  email: /^[A-Za-z0-9]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
  account: /^[0-9A-Za-z\\-_\\.]+$/,
  sn: /^[0-9]{4}$|^[0-9]{6}$/,
  password: /^.*(?=.{8,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z]).*$/
};

// 等待指定时长
export const sleep = (time: number) =>
  new Promise(resolve => setTimeout(resolve, time));

export const getAddressList = async (areaid: string | number) =>
  await axios({
    method: "get",
    url: `${API.ADDRESS_LIST}/areaId=${areaid}`
  });

const WEEKDAYS = ["周日", "周六", "周五", "周四", "周三", "周二", "周一"];
export const getSaleTimeWeek: (param: { week: number }) => string = ({
  week
}) => {
  if (week === 31) {
    return "工作日 (周一至周五)";
  }
  let str: string[] = [];
  week
    .toString(2)
    .padStart(7, "0")
    .split("")
    .forEach((d, idx) => (d === "1" ? str.push(WEEKDAYS[idx]) : false));
  return str.reverse().join("，");
};

export const getSaleTimeRange: (param: { range: string }) => string = ({
  range
}) =>
  range
    .split(",")
    .map(item =>
      item
        .split("-")
        .map(t => t.substr(0, 2) + ":" + t.substr(2))
        .join("-")
    )
    .join(" , ");

export const checkSaleTimeToday: (week: number) => boolean = week => {
  if (week > 127 || week < 0) {
    throw "销售周期设置错误";
  }
  // 此处待调试
  let today = moment().day(0);
  return (
    week
      .toString(2)
      .padStart(7, "0")
      .split("")[7 - today] === "1"
  );
};

export const canSelloutNow: (param?: {
  week?: number;
  dayTimeRange?: string;
}) => boolean = param => {
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
export const isLogin: () => boolean = () =>
  Taro.getStorageSync(LocalStorageKeys.user) !== null;

export const hidePhone = (phone: string) =>
  phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");

// 记录验证码发送状态
export const setSNSendStatus = (status: boolean | string) => {
  if (status) {
    Taro.setStorage({ key: LocalStorageKeys.SNS, data: status });
    return;
  }
  Taro.removeStorage({ key: LocalStorageKeys.SNS });
};

export const loadSNSendStatus: () => null | string = () =>
  Taro.getStorageSync(LocalStorageKeys.SNS);
