import { LocalStorageKeys } from "./../../utils/setting";
import { axios } from "@/utils/axios";
import { API } from "@/utils/setting";
import { Dispatch } from "redux";
import Taro from "@tarojs/taro";
import { set as setGlobalData } from "@/utils/global_data";

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
export enum CLIENT_TYPE {
  WEB = "web", //'windows',
  WAP = "wap",
  IOS = "ios",
  ANDROID = "android",
  WECHAT = "wechat",
  MINIPROGRAM = "miniprogram"
}

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
  status?: boolean;
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
      setGlobalData("token", res.token);
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

export const storeMember = (
  member: IMemberInfo,
  auth: IMemberRealNameAuth,
  callback: Dispatch
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
    authMessage: auth ? auth.authStateText : ""
  };

  Taro.setStorage({
    key: LocalStorageKeys.user,
    data: user
  });

  callback &&
    callback({
      type: "global/setUserStore",
      payload: {
        user,
        isLogin: true
      }
    });
};

export const loadMember = async (callback: Dispatch) => {
  let {
    memberInfo: member,
    memberRealNameAuth: auth
  }: IMember = await getMember();

  storeMember(member, auth, callback);
  return {
    member,
    auth
  };
};
