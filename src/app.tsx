import "@tarojs/async-await";
import Taro, { Component, Config } from "@tarojs/taro";
import Index from "./pages";
import dva from "./utils/dva";
import models from "./models";
import { Provider } from "@tarojs/redux";
import "./app.scss";
import "./styles/custom-theme.scss";

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
      "pages/index", // 首页
      "pages/index/suggest", // 精彩推荐

      "pages/cate", // 分类
      "pages/cart", // 购物车
      "pages/user", // 个人中心
      "pages/find", // 发现
      "pages/login", // 登录
      "pages/special", // 特品
      "pages/special/detail", // 特品详情
      "pages/special/result" // 特品结果
    ],
    window: {
      backgroundTextStyle: "light",
      navigationBarBackgroundColor: "#fff",
      navigationBarTitleText: "WeChat",
      navigationBarTextStyle: "black"
    },

    tabBar: {
      list: [
        {
          pagePath: "pages/index",
          text: "首页",
          iconPath: "./images/tab/home.png",
          selectedIconPath: "./images/tab/home-active.png"
        },
        {
          pagePath: "pages/cate",
          text: "分类",
          iconPath: "./images/tab/cate.png",
          selectedIconPath: "./images/tab/cate-active.png"
        },
        {
          pagePath: "pages/find",
          text: "",
          iconPath: "./images/tab/logo.png",
          selectedIconPath: "./images/tab/logo-active.png"
        },
        {
          pagePath: "pages/cart",
          text: "购物车",
          iconPath: "./images/tab/cart.png",
          selectedIconPath: "./images/tab/cart-active.png"
        },
        {
          pagePath: "pages/user",
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
