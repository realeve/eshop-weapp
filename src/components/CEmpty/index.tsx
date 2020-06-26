import Taro from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import * as lib from "@/utils/lib";
import { CButton } from "@/components";
import "./index.scss";
import classnames from "classname";

type TEmptyType =
  | "refund"
  | "cart"
  | "goods"
  | "order"
  | "comment"
  | "address"
  | "footprint"
  | "coupon"
  | "collector"
  | "goodsComment"
  | "counsel"
  | "special"
  | "guessYouLike"
  | "login";

export const prefix = "https://static.ccgold.cn/img/mp/img/empty/";

export interface IPropEmptyItem {
  type: TEmptyType;
  [key: string]: any;
}
export default class CEmpty extends Taro.Component {
  static options = {
    addGlobalClass: true
  };

  empConfig: {
    [key: string]: {
      img: React.ReactNode;
      description: string;
      subtitle?: string;
      btnText?: string;
      href?: string;
    };
  } = {
    login: {
      img: "goods.svg",
      description: "请先登录",
      href: "/pages/login/index",
      subtitle: "",
      btnText: "登录"
    },
    refund: {
      img: "refund.svg",
      description: "暂无退货退款信息",
      btnText: "去逛逛",
      href: "/pages/index/index"
    },
    cart: {
      img: "cart.svg",
      description:
        "购物车内暂时没有商品" +
        (lib.isLogin() ? "" : "，登录后将显示您之前加入的商品"),
      btnText: lib.isLogin() ? "去逛逛" : "登录",
      href: lib.isLogin() ? "/pages/index/index" : "/pages/login/index"
    },
    order: {
      img: "order.svg",
      description: "您还没有相关的订单",
      btnText: "去逛逛",
      href: "/pages/index/index"
    },
    comment: {
      img: "comment.svg",
      description: "此商品暂无评论哦",
      btnText: "去评论",
      href: "/pages/user/comment"
    },
    address: {
      img: "address.svg",
      description: "您还没有收货地址哦",
      btnText: "添加新地址",
      href: "/pages/user/address"
    },
    footprint: {
      img: "footprint.svg",
      description: "您还没有留下足迹哦，先去逛逛吧",
      btnText: "去逛逛",
      href: "/pages/user/footprint"
    },
    coupon: {
      img: "coupon.svg",
      description: "您还没有优惠券哦",
      href: "/pages/user/coupon"
    },
    collector: {
      img: "collector.svg",
      description: "您还没有收藏内容哦，先去逛逛吧",
      btnText: "去逛逛",
      href: "/pages/index/index"
    },
    counsel: {
      img: "comment.svg",
      description: "暂无相关评论，说一下您的看法吧",
      href: "/pages/user/comment"
    },
    goodsComment: {
      img: "comment.svg",
      description: "暂无相关评论，说一下您的看法吧",
      href: "/pages/user/goods_comment"
    },
    goods: {
      img: "goods.svg",
      description: "抱歉，没有找到符合条件的商品哦",
      subtitle: "换个条件或关键词试试吧",
      href: "/pages/user/goods"
    },
    special: {
      img: "order.svg",
      description: "抱歉没有找到符合条件的预约活动。",
      href: "/pages/index/index"
    },
    guessYouLike: {
      img: "goods.svg",
      description: "暂无推荐商品",
      href: "/pages/index/index"
    }
  };

  render() {
    if (!this.props.type) {
      return;
    }
    let { btnText, description, href, img, subtitle } =
      this.empConfig[this.props.type] || {};
    let white =
      typeof this.props.white == "undefined" ? true : this.props.white;
    return (
      <View
        className={classnames("page-empty", {
          white
        })}
        style={this.props.style || {}}
      >
        <View className="imgWrapper">
          <Image mode="aspectFit" className="img" src={prefix + img} />
        </View>
        <View className="title">{description}</View>
        {subtitle && <View className="sub_title">{subtitle}</View>}
        {btnText && (
          <CButton
            onClick={() => {
              lib.jump(href);
            }}
            theme="gardient"
            // style="margin-top:40px;width:80vw;"
            style={{ marginTop: "40px", width: "80%" }}
            size="large"
          >
            {btnText}
          </CButton>
        )}
      </View>
    );
  }
}
