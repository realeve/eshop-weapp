import { axios } from "@/utils/axios";
import { API } from "@/utils/setting";

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
