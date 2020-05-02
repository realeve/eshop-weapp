import Taro, { Component, Config } from "@tarojs/taro";
import Index from "./pages/index";
import dva from "./utils/dva";
import models from "./models";
import { Provider } from "@tarojs/redux";
import "./app.scss";
import "./styles/custom-theme.scss";

// 用import的方式会报错
// import { tabConfig } from "./utils/lib";

const dvaApp = dva.createApp({
  initialState: {},
  models: models
});
const store = dvaApp.getStore();

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

class App extends Component {
  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    pages: [
      "pages/index/index", // 首页
      "pages/cart/index", // 购物车
      "pages/index/suggest/index", // 精彩推荐
      "pages/index/special_detail/index", // 专题详情
      "pages/cate/index", // 分类
      "pages/search/index", // 搜索
      "pages/order/confirm/index", // 立即购买
      "pages/user/index", // 个人中心
      "pages/user/order/index", // 我的订单

      "pages/help/index", // 帮助中心
      "pages/help/view", // 查看

      "pages/user/address/index", //我的地址

      "pages/user/address/new", //新增地址

      "pages/user/address/list", // 选择地址

      "pages/user/comment/index", // 我的评价

      "pages/user/lottery/index", // 我的预约

      "pages/user/order/refund", // 退款申请
      "pages/user/order/comment", // 发起商品评价

      "pages/find/index", // 发现
      "pages/login/index", // 登录
      "pages/special/index", // 特品
      "pages/special/detail/index", // 特品详情
      "pages/special/result/index", // 特品结果
      "pages/special/rule/index", // 特品规则
      "pages/detail/index"
    ],
    window: {
      backgroundTextStyle: "light",
      navigationBarBackgroundColor: "#fff",
      navigationBarTitleText: "WeChat",
      navigationBarTextStyle: "black"
      // navigationStyle: "custom"
    },
    tabBar: {
      list: [
        {
          pagePath: "pages/index/index",
          text: "首页",
          iconPath: "./images/tab/home.png",
          selectedIconPath: "./images/tab/home-active.png"
        },
        {
          pagePath: "pages/cate/index",
          text: "分类",
          iconPath: "./images/tab/cate.png",
          selectedIconPath: "./images/tab/cate-active.png"
        },
        {
          pagePath: "pages/find/index",
          text: "发现",
          iconPath: "./images/tab/logo.png",
          selectedIconPath: "./images/tab/logo.png"
        },
        {
          pagePath: "pages/cart/index",
          text: "购物车",
          iconPath: "./images/tab/cart.png",
          selectedIconPath: "./images/tab/cart-active.png"
        },
        {
          pagePath: "pages/user/index",
          text: "我的",
          iconPath: "./images/tab/user.png",
          selectedIconPath: "./images/tab/user-active.png"
        }
      ],
      color: "#333",
      custom: false,
      selectedColor: "#b98a4e",
      backgroundColor: "#fff",
      // backgroundColor: "#f8f9fb",
      borderStyle: "white"
    }
  };

  componentDidMount() {}

  componentDidShow() {}

  componentDidHide() {}

  componentDidCatchError() {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {
    return (
      <Provider store={store}>
        <Index />
      </Provider>
    );
  }
}

Taro.render(<App />, document.getElementById("app"));
