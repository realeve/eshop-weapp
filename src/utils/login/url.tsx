export default {
  /**
   * url:https://nervjs.github.io/taro/docs/apis/open-api/login/login.html
   * url:https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/login.html
   *
   * 作用:微信登录，通过code换取 session_key,openid等信息
   */

  onLogin: "/wx/mini/login",
  /**
   * 微信支付接口：http://47.110.150.104:3000/project/30/interface/api/1491
   * https://pay.weixin.qq.com/wiki/doc/api/wxa/wxa_api.php?chapter=7_3&index=1
   *
   */
  pay: "/member/buy/pay/wxmini/wxpay"
};
