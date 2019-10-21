import { axios } from "@/utils/axios";
import { API } from "@/utils/setting";

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
