import { updateToken } from "./../../utils/lib";
import { LocalStorageKeys } from "./../../utils/setting";
import { axios } from "@/utils/axios";
import { API } from "@/utils/setting";
import { Dispatch } from "redux";
import Taro from "@tarojs/taro";
import {
  set as setGlobalData,
  get as getGlobalData
} from "@/utils/global_data";
import { clearUser, isLogin, isWeapp, updateToken } from "@/utils/lib";
import { loadShoppingCart } from "@/utils/cartDb";
import * as wx from "@/utils/weixin";

/**
 * @exports
 * @enum CLIENT_TYPE 客户端类型
 * @alias WEB = 'wap', //'windows',
 * @alias WAP = 'wap',
 * @alias IOS = 'ios',
 * @alias ANDROID = 'android',
 * @alias WECHAT = 'wechat',
 * @alias MINIPROGRAM = 'miniprogram',
 */
export const CLIENT_TYPE = {
  WEB: "web", //'windows',
  WAP: isWeapp ? "miniprogram" : "wap",
  IOS: "ios",
  ANDROID: "android",
  WECHAT: isWeapp ? "wechat" : "wap",
  MINIPROGRAM: isWeapp ? "miniprogram" : "wap"
};

/**
 * @exports
 * @enum SMS_TYPE 短信类型
 * @alias REGISTER = 注册
 * @alias LOGIN = 登录
 * @alias FIND_PASSWORD = 找回密码
 * @alias MOBILE_BIND = 绑定手机
 * @alias MOBILE_AUTH = 手机认证
 * @alias ADMIN_ADD_MEMBER = 后台管理员新增会员
 * @alias ADMIN_EDIT_MEMBER = 后台管理员编辑会员手机
 * @alias CHAIN_ADD_MEMBER = 门店新增会员
 * @alias CHAIN_VALET_ORDERS = 门店代客下单
 */
export enum SMS_TYPE {
  REGISTER = 1, // 注册
  LOGIN = 2, // 登录
  FIND_PASSWORD = 3, // 找回密码
  MOBILE_BIND = 4, // 绑定手机
  MOBILE_AUTH = 5, // 手机认证
  ADMIN_ADD_MEMBER = 6, // 后台管理员新增会员
  ADMIN_EDIT_MEMBER = 7, // 后台管理员编辑会员手机
  CHAIN_ADD_MEMBER = 8, // 门店新增会员
  CHAIN_VALET_ORDERS = 9 // 门店代客下单
}

/**
 * 请求短信验证码参数
 *
 * @export
 * @interface ISendSmsParams
 *
 * @member sendType @type {number} 短信类型
 * @member mobile @type {string} 手机号码
 * @member captchaVal @type {string} 调整答案
 * @member captchaKey @type {string} 调整题目
 */
export interface ISendSmsParams {
  sendType: number | string;
  mobile: string;
  captchaVal: string;
  captchaKey: string;
  [key: string]: any;
}

/**
 * @exports
 * @interface ISendSms 发送短信结果
 * @member status 发送状态，true为已发送，false为未发送
 * @member err 如果短信未发送，err表示未发送原因
 */
export interface ISendSms {
  status?: boolean | number;
  err?: string;
  [key: string]: any;
}

/**
 * 请求短信验证码
 *
 * @param {ISendSmsParams} params
 * @returns {Promise<ISendSms>}
 */
export const sendSms = (params: ISendSmsParams): Promise<ISendSms> =>
  axios({
    url: API.SEND_SMSCODE as string,
    params
  }).then(
    ({
      authCodeValidTime,
      msg
    }: {
      authCodeValidTime?: number;
      msg: string;
    }) => ({
      status: authCodeValidTime && authCodeValidTime > 0,
      err: msg
    })
  );

/**
 * @exports
 * @interface ICaptchaKV 验证码挑战
 * @member captchaKey: 挑战答案
 * @member captchaImgUrl: 调整图形
 * @member captcharProblemCode: 挑战问题的代码
 * @member captchaProblem: 挑战问题
 */
export interface ICaptchaKV {
  captchaKey?: string;
  captchaImgUrl?: string;
  captchaProblemCode?: string;
  captchaProblem?: string;
  [key: string]: any;
}

/**
 * 拉取验证码挑战题目
 * @param fp 指纹
 * @returns CaptchaKV
 */
export const getCaptchaKey = () =>
  axios({
    url: API.CAPTCHA_BOX as string
  });

/**
 * 登录成功返回结果
 *
 * @export
 * @interface ILoginToken
 *
 * @member memberName @type {string} 用户名
 * @member memberId @type {number} 用户编号
 * @member token @type {string} 令牌
 */
export interface ILoginToken {
  memberName: string;
  memberId: number;
  token: string;
  statusText?: string;
  [key: string]: any;
}

/**
 * 使用手机号+短信验证码登录
 *
 * @param {Object} data
 * @returns {Promise<ILoginToken>}
 */
export const loginSms = (data: Object): Promise<ILoginToken> =>
  axios({
    method: "post",
    url: API.LOGIN_SMSCODE as string,
    data
  }).then(res => {
    if (res.token) {
      updateToken(res.token);
    }
    return res;
  });

/**
 * 会员手机注册的输入条件
 *
 * @export
 * @interface IRegisterMember
 *
 * @alias mobile 手机号码
 * @alias smsAuthCode 短信验证码
 * @alias memberPwd 密码
 * @alias memberPwdRepeat 密码验证/重复
 * @alias clientType  注册客户端类型
 */
export interface IRegisterMember {
  mobile: string;
  smsAuthCode: string;
  memberPwd: string;
  memberPwdRepeat: string;
  clientType: string;
  [key: string]: any;
}

/**
 * 手机注册返回结果
 *
 * @export
 * @interface IRegisterToken
 *
 * @alias memberName 会员名称
 * @alias memberId 会员ID
 * @alias token 令牌
 */
export interface IRegisterToken {
  memberName: string;
  memberId: string;
  token: string;
  error?: string;
  [key: string]: any;
}
export const registerMobile = (
  data: IRegisterMember
): Promise<IRegisterToken> =>
  axios({
    method: "post",
    url: API.REGISTER_MOBILE as string,
    data
  });

export const changePassword = (item: IRegisterMember) =>
  axios({
    method: "post",
    url: API.FIND_PWD as string,
    data: item
  });

export const logout = async (dispatch: Dispatch): Promise<any> => {
  // 微信小程序才发起解绑操作。
  if (isWeapp) {
    let mp_logout = await axios({ ...API.LOGOUT_MINI_PROGRAM }).catch(
      err => err
    );

    if ((mp_logout || {}).code == 200) {
      storeMiniProgram({ isBinding: false, isConfirmed: false });
      Taro.setStorage({
        key: LocalStorageKeys.mp,
        data: { isBinding: false, isConfirmed: false }
      });
      dispatch({
        type: "common/setStore",
        payload: { miniProgram: { isBinding: false, isConfirmed: false } }
      });
    }
  }
  clearUser();
  return axios({ method: "post", url: API.LOGOUT as string });
};

export const unbind = async dispatch => {
  await axios({ method: "post", url: API.UNBIND as string });
  return logout(dispatch);
};

/**
 * 使用手机号+密码登录
 *
 * @param {Object} data
 * @returns {Promise<ILoginToken>}
 */
export const loginPsw = (data: Object): Promise<ILoginToken> =>
  axios({
    method: "post",
    url: API.LOGIN_BOX as string,
    data
  }).then(res => {
    if (res.token) {
      updateToken(res.token);
    }
    return res;
  });

export interface IMemberInfo {
  memberId: number;
  memberName: string;
  trueName: string;
  memberSex: number;
  birthday: string;
  avatar: string;
  email: string;
  emailIsBind: number;
  mobile: string;
  mobileIsBind: number;
  registerTime: string;
  loginNum: number;
  loginTime: string;
  lastLoginTime: string;
  loginIp: string;
  lastLoginIp: string;
  memberPoints: number;
  predepositAvailable: number;
  predepositFreeze: number;
  addressProvinceId: number;
  addressCityId: number;
  addressAreaId: number;
  addressAreaInfo: string;
  experiencePoints: number;
  allowBuy: number;
  allowTalk: number;
  state: number;
  modifyNum: number;
  weixinUserInfo: string;
  qqUserInfo: string;
  avatarUrl: string;
  emailEncrypt: string;
  mobileEncrypt: string;
  securityLevel: number;
  payPwdIsExist: number;
  isDistributor: number;
  levelMarketingState: number;
  qqIsBind: number;
  weixinIsBind: number;
  memberSexText: string;
  realNamePass: number;
}

export interface IMemberRealNameAuth {
  memberId: number;
  memberName: string;
  authRealName: string;
  idCartNumber: string;
  idCartFrontImage: string;
  idCartBackImage: string;
  idCartHandImage: string;
  authState: number;
  authMessage: string;
  authAddTime: string;
  authHandleTime: string;
  idCartFrontImageUrl: string;
  idCartBackImageUrl: string;
  idCartHandImageUrl: string;
  authRealNameEncrypt: string;
  idCartNumberEncrypt: string;
  authStateText: string;
}
export interface IMember {
  memberInfo: IMemberInfo;
  memberRealNameAuth: IMemberRealNameAuth;
}

export const getMember = () =>
  axios({
    method: "post",
    url: API.MEMBER_INFO as string
  });

export const storeMember = async (
  member: IMemberInfo,
  auth: IMemberRealNameAuth,
  callback: Dispatch,
  inModle?: boolean
) => {
  let user = {
    avatar: member.avatarUrl,
    uid: member.memberId,
    account: "微信",
    memberName: member.memberName,
    trueName: auth ? auth.authRealName : "", // authRealNameEncrypt
    phone: member.mobile,
    sex: member.memberSexText,
    birthday: member.birthday,
    authState: auth ? auth.authState : 90,
    isRealNamePassed: auth && auth.authState === 30,
    authMessage: auth ? auth.authStateText : "",
    weixinIsBind: member.weixinIsBind,
    registerTime: member.registerTime
  };

  Taro.setStorage({
    key: LocalStorageKeys.user,
    data: user
  });
  callback &&
    callback({
      type: inModle ? "setStore" : "common/setStore",
      payload: {
        user,
        isLogin: true
      }
    });

  // 场景1：手机号已登录但没有绑定，发起绑定的调用，调用完毕后会在接口中自动再重新载入一次loadMemberInfo，此处可能会存在循环调用，暂未处理。
  if (!member.weixinIsBind) {
    await wx.bindWXInfo(callback); // 绑定完之后会发起重新获取用户身份信息的调用，绑定成功后不执行该模块
  }
};

export const loadMember = async (
  callback: Dispatch,
  setting: {
    withPrefix: boolean;
    mpCode: boolean | string;
  } = { withPrefix: false, mpCode: false }
) => {
  let {
    memberInfo: member,
    memberRealNameAuth: auth
  }: IMember = await getMember().catch(e => {
    wx.bindWXInfo(callback);
    return {};
  });
  if (!member) {
    return;
  }
  let { withPrefix, mpCode } = setting;
  await storeMember(member, auth, callback, withPrefix);
  loadShoppingCart(callback, withPrefix);

  // 小程序处理流程
  if (isWeapp) {
    let isBinding = loadMiniProgram().isBinding;
    if (isBinding) {
      return { member, auth };
    }

    if (!mpCode) {
      let wxLogin = await Taro.login({
        success: res => res.code || false,
        fail: err => false
      });
      mpCode = wxLogin ? wxLogin.code : false;
    }
    if (mpCode) {
      let bindingResult = await binding(mpCode)
        .then(res => res.code === 200)
        .catch(err => false);
      console.info("binding result", bindingResult);
      if (bindingResult) {
        storeMiniProgram({ isBinding: true, isConfirmed: false });
        Taro.setStorage({
          key: LocalStorageKeys.mp,
          data: { isBinding: true, isConfirmed: false }
        });
      }
    }
  }

  return {
    member,
    auth
  };
};

export const storePhone = phone => {
  if (phone && !phone.match(/^1[0-9]{10}$/)) {
    return;
  }
  if (!phone) {
    Taro.removeStorage({ key: LocalStorageKeys.phone });
    return;
  }
  Taro.setStorage({
    key: LocalStorageKeys.phone,
    data: phone
  });
};

const storeMiniProgram = mp => {
  Taro.setStorage({
    key: LocalStorageKeys.mp,
    data: mp
  });
};

const loadMiniProgram = () => {
  let mp = Taro.getStorageSync(LocalStorageKeys.mp);
  if (!mp) {
    let mp = { isBinding: false, isConfirmed: false };
    storeMiniProgram({ isBinding: false, isConfirmed: false });
    // dispatch({type:})
  }
  return mp;
};

const binding = code => axios({ ...API.MINI_PROGRAM_BINDING, data: { code } });
const loginByCode = code =>
  axios({ ...API.LOGIN_MINI_PROGRAM, data: { code } });

export const loginWx = async (dispatch: Dispatch, withPrefix = false) => {
  let logon = isLogin();
  let isBinding = loadMiniProgram().isBinding;
  console.log("logon,isBinding", logon, isBinding);
  if (!logon && !isBinding) {
    console.info("anonymous");
    return;
  }
  if (logon && isBinding) {
    console.info("logon and binded");
    return;
  }

  if (isWeapp) {
    let wxLogin = await Taro.login({
      success: res => res.code || false,
      fail: err => false
    });
    let mpCode = wxLogin ? wxLogin.code : false;
    console.info("mpCode", mpCode);
    if (!mpCode) {
      Taro.showToast({
        title: "微信登录失败",
        duration: 2000,
        icon: "loading"
      });
      return;
    }
  }
  // else {
  //   console.error("此处对接微信网页端登录\n微信小程序与网页端已做分离");
  // }

  if (!logon) {
    console.info("not logon");
    let autoLogin = await loginByCode(mpCode).catch(err => false);
    if (!autoLogin) {
      console.error("auto login failed");
      return;
    }
    loadMember(dispatch, { withPrefix, mpCode });
  }
};

export const checkWxSession = async (dispatch: Dispatch) => {
  Taro.checkSession({
    success: function() {
      //session_key 未过期，并且在本生命周期一直有效
      console.info("微信会话有效");
    },
    fail: function() {
      // session_key 已经失效，需要重新执行登录流程
      loginWx(dispatch); //重新登录
    }
  });
};
