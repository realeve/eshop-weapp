import { axios as http } from "taro-axios";
import qs from "qs";
import { host as _host, IMWS } from "./setting";
import * as R from "ramda";
import { LocalStorageKeys } from "@/utils/setting";
import Taro from "@tarojs/taro";
import {
  set as setGlobalData,
  get as getGlobalData
} from "@/utils/global_data";
import { jump, clearUser, getUid } from "@/utils/lib";
import { API } from "@/utils/api";
import fail from "@/components/Toast/fail";

// export interface GlobalAxios {
//   host: string;
//   token: string;
//   fp: string;
// }

// declare global {
//   interface Window {
//     g_axios: GlobalAxios;
//   }
// }

export const initFingerPrint = () => {
  // console.info("initFingerPrint");
  getUid().then(str => {
    // console.info("fp is ", str);
    Taro.setStorage({ key: LocalStorageKeys.FingerPrint, data: str });
    setGlobalData(LocalStorageKeys.FingerPrint, str);
  });
};

/**
 * 接口返回代码表
 *
 * @export
 * @enum {number}
 *
 * @alias success
 * @alias fail
 * @alias noauth
 * @alias unopened
 */
export const RESPONSE_CODES = {
  success: 200,
  fail: 400,
  noauth: 401,
  unopened: 402
};

export const OK_CODE = [RESPONSE_CODES.success];
export const ERROR_CODE = [
  RESPONSE_CODES.fail,
  RESPONSE_CODES.noauth,
  RESPONSE_CODES.unopened
];

export const codeMessage = {
  200: "服务器成功返回请求的数据。",
  201: "新建或修改数据成功。",
  202: "一个请求已经进入后台排队（异步任务）。",
  204: "删除数据成功。",
  400: "发出的请求有错误，服务器没有进行新建或修改数据的操作。",
  401: "用户没有权限（令牌、用户名、密码错误）。",
  403: "用户得到授权，但是访问是被禁止的。",
  404: "发出的请求针对的是不存在的记录，服务器没有进行操作。",
  406: "请求的格式不可得。",
  410: "请求的资源被永久删除，且不会再得到的。",
  422: "当创建一个对象时，发生一个验证错误。",
  500: "服务器发生错误，请检查服务器。",
  502: "网关错误。",
  503: "服务不可用，服务器暂时过载或维护。",
  504: "网关超时。"
};

// 导出数据，随机时长
export const mock = (data, time = Math.random() * 1000) =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve(data);
    }, time);
  });

export const getType = data => R.type(data).toLowerCase();

export const loadUserInfo = user => {
  if (user == null) {
    return {};
  }

  let setting = JSON.parse(user);
  setGlobalData("token", setting.token);
  return { token: setting.token };
};

const saveToken = token => {
  Taro.setStorageSync(LocalStorageKeys.token, token);
};

export const handleError = error => {
  // console.log(error);
  let config = error.config || {};
  let str = config.params || config.data || {};
  let { id, nonce, ...params } = typeof str === "string" ? qs.parse(str) : str;
  Reflect.deleteProperty(params, "tstart2");
  Reflect.deleteProperty(params, "tend2");
  Reflect.deleteProperty(params, "tstart3");
  Reflect.deleteProperty(params, "tend3");

  config.url += `${id ? id + "/" + nonce : ""}?${qs.stringify(params)}`;
  if (self) {
    return Promise.reject({
      message: error.message || "",
      description: error.message || "",
      url: (config && config.url) || "",
      params,
      status: error.response ? error.response.status || 400 : 400
    });
  } else if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    let { data, status } = error.response;
    if (status === 401) {
      // jump("/pages/login/index");
      // Taro.showToast({
      //   title: '登录已失效', //"验证码无效",
      //   icon: "none"
      // })
    }

    const errortext = (codeMessage[status] || "") + (data.msg || "");
    // notification.error({
    //   message: `请求错误 ${status}: ${config.url}`,
    //   description: errortext || '',
    //   duration: 10,
    // });
    return Promise.reject({
      status,
      message: `请求错误: ${config.url}`,
      description: `${errortext || ""}`,
      url: error.config.url || "",
      params
    });
  } else if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    // console.log(error.request);
  } else {
    // Something happened in setting up the request that triggered an Error
  }
  return Promise.reject({
    message: "请求错误",
    description: error.message || "",
    url: (config && config.url) || "",
    params,
    status: 400
  });
};

export const handleData = async ({ config, request, data, headers }) => {
  if (config.url.includes(".json")) {
    return data;
  }

  let { code, msg, datas } = data;
  // TODO:微信自动登录失败也会返回noauth，此处需要调整
  if (
    code === RESPONSE_CODES.noauth &&
    !(
      config.url.includes(API.LOGIN_MINI_PROGRAM.url) ||
      config.url.includes(API.MINI_PROGRAM_BINDING.url)
    )
  ) {
    clearUser();
    fail("登录已失效").then(() => {
      if (window.location.pathname !== "/pages/user/index") {
        jump({ url: "/pages/user/index" });
      } else {
        // 如果绑定过则刷新页面
        if ("1" == Taro.getStorageSync(LocalStorageKeys.is_bind_wx)) {
          window.location.reload();
        }
      }
    });
    return Promise.reject({
      slef: true,
      config,
      response: {
        status: code,
        statusText: msg,
        data: {}
      },
      request,
      message: msg
    });
  }

  if ((datas || {}).error) {
    return Promise.reject({
      slef: true,
      config,
      response: {
        status: code,
        statusText: msg,
        data: {}
      },
      request,
      message: msg
    });

    // throw {
    //   config,
    //   response: {
    //     status: code,
    //     statusText: msg,
    //     data: {},
    //   },
    //   request,
    //   message: msg,
    // };
  }

  if (!OK_CODE.includes(code)) {
    throw {
      slef: true,
      config,
      response: {
        status: code,
        statusText: msg,
        data: {}
      },
      request,
      message: msg
    };
  }
  if (headers.Authorization) {
    // window.g_axios.token = headers.Authorization;
    setGlobalData("token", headers.Authorization);
    saveToken(headers.Authorization);
  }
  // 刷新token
  if (typeof (datas || {}).token !== "undefined") {
    // window.g_axios.token = datas.token;
    setGlobalData("token", datas.token);
    saveToken(datas.token);

    // loadMember()

    // 移除token
    // Reflect.deleteProperty(datas, "token");
  }

  return datas || { code };
};

export const handleUrl = option => {
  if (option.url && option.url[0] === ".") {
    option.url = host + "/" + option.url.slice(1);
  }
  return option;
};

const getFp = () => Taro.getStorageSync(LocalStorageKeys.FingerPrint) || "";

export const getToken = () => {
  let token = getGlobalData("token");

  if (!token) {
    token = Taro.getStorageSync(LocalStorageKeys.token);
    setGlobalData("token", token);
  }
  return token || "";
};

// 自动处理token更新，data 序列化等
export let axios = _option => {
  let host = _option && _option.im ? IMWS : _host;

  let g_axios = getGlobalData("g_axios") || {};
  if (!g_axios.token || g_axios.token.length == 0) {
    let g_fp = getGlobalData("fp");
    let fp = g_fp || "";
    if (fp.length === 0) {
      fp = getFp();
    }
    let token = getGlobalData("token");

    if (!token) {
      token = Taro.getStorageSync(LocalStorageKeys.token);
      setGlobalData("token", token);
    }

    console.info("fp is ", fp);
    g_axios = {
      host,
      token,
      fp
    };
    setGlobalData("g_axios", g_axios);
  }

  // token为空时自动获取

  let option = R.clone(_option);

  option = handleUrl(option);

  option = Object.assign(option, {
    headers: {
      Authorization: g_axios.token,
      fp: g_axios.fp,
      ...option.headers
    },
    method: option.method || "get"
  });
  if (
    option.headers["content-type"] == "application/json" &&
    ("" + option.method).toLowerCase() === "post"
  ) {
    return http
      .post(host + option.url, option.data, option)
      .then(handleData)
      .catch(handleError);
  }

  return http
    .create({
      baseURL: host,
      timeout: 30 * 1000,
      transformRequest: [
        function(data) {
          let dataType = getType(data);
          switch (dataType) {
            case "object":
            case "array":
              // https://www.jianshu.com/p/89716216edc2 post 提交数据格式化方式
              // qs.stringify({ a: [1, 2, 3 ] }, { arrayFormat: 'indices' });
              // //  'a[0]=1&a[1]=2&a[2]=3'

              // qs.stringify( { a: [1, 2, 3 ]} , { arrayFormat: 'brackets' });
              // //  'a[]=1&a[]=2&a[]=3'

              // qs.stringify( {a: [1, 2, 3 ]}, { arrayFormat: 'repeat' } );
              // //  'a=1&a=2&a=3'
              data = qs.stringify(data, { arrayFormat: "indices" });
              break;
            default:
              break;
          }
          return data;
        }
      ]
    })(option)
    .then(handleData)
    .catch(handleError);
};
