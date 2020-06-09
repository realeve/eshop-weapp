import Taro from "@tarojs/taro";
import { View } from "@tarojs/components";
import classNames from "classnames";
import Swipers from "swiper";

import "./index.scss";

let INSTANCE_ID = 0;

const createEvent = type => {
  let e;
  try {
    e = new TouchEvent(type);
  } catch (err) {
    e = document.createEvent("Event");
    e.initEvent(type, true, true);
  }
  return e;
};

export default class CSwiper extends Taro.Component {
  constructor() {
    super(...arguments);
    this.$el = null;
    this._id = INSTANCE_ID + 1;
    INSTANCE_ID++;
    this._$current = 0;
  }

  componentDidMount() {
    const {
      autoplay = false,
      interval = 5000,
      duration = 500,
      current = 0,
      displayMultipleItems = 1,
      onChange,
      circular = true,
      vertical,
      onAnimationfinish,
      spaceBetween = 30
    } = this.props;

    const that = this;
    const opt = {
      // 指示器
      pagination: { el: `.taro-swiper-${this._id} .swiper-pagination` },
      direction: vertical ? "vertical" : "horizontal",
      loop: circular,
      slidesPerView: Number(displayMultipleItems), // parseInt(displayMultipleItems, 10),
      centeredSlides: true,
      initialSlide: parseInt(current, 10),
      speed: parseInt(duration, 10),
      observer: true,

      on: {
        slideChange() {
          let e = createEvent("touchend");
          try {
            Object.defineProperty(e, "detail", {
              enumerable: true,
              value: {
                current: this.realIndex
              }
            });
          } catch (err) {}
          that._$current = this.realIndex;
          onChange && onChange(e);
        },
        transitionEnd() {
          let e = createEvent("touchend");
          try {
            Object.defineProperty(e, "detail", {
              enumerable: true,
              value: {
                current: this.realIndex
              }
            });
          } catch (err) {}
          onAnimationfinish && onAnimationfinish(e);
        }
      }
    };

    // 自动播放
    if (autoplay) {
      opt.autoplay = {
        delay: parseInt(interval, 10),
        stopOnLastSlide: true,
        disableOnInteraction: false
      };
    }

    // 两端距离
    if (spaceBetween) {
      opt.spaceBetween = spaceBetween;
    }

    this.mySwiper = new Swipers(this.$el, opt);
  }

  componentWillReceiveProps(nextProps) {
    if (this.mySwiper) {
      let nextCurrent = 0;
      if (nextProps.current === 0) {
        nextCurrent = this._$current || 0;
      } else {
        nextCurrent = nextProps.current || this._$current || 0;
      }
      // 是否衔接滚动模式
      if (nextProps.circular) {
        if (nextProps.current !== 0)
          this.mySwiper.slideToLoop(parseInt(nextCurrent, 10)); // 更新下标
      } else {
        if (nextProps.current !== 0)
          this.mySwiper.slideTo(parseInt(nextCurrent, 10)); // 更新下标
      }

      // 判断是否需要停止或开始自动轮播
      if (this.mySwiper.autoplay.running !== nextProps.autoplay) {
        if (nextProps.autoplay) {
          this.mySwiper.autoplay.start();
        } else {
          this.mySwiper.autoplay.stop();
        }
      }

      this.mySwiper.update(); // 更新子元素
    }
  }

  componentWillUnmount() {
    this.$el = null;
    if (this.mySwiper) this.mySwiper.destroy();
  }

  render() {
    const { className, style } = this.props;

    const cls = classNames(
      `taro-swiper-${this._id}`,
      "swiper-container",
      className
    );
    const paginationCls = classNames("swiper-pagination", {
      "swiper-pagination-hidden": !this.props.indicatorDots,
      "swiper-pagination-bullets": this.props.indicatorDots
    });
    return (
      <View
        className={cls}
        style={{ width: "100%", height: "100%", ...style }}
        ref={el => {
          this.$el = el;
        }}
      >
        {/* <RichText
          nodes={`<style type='text/css'>
        .taro-swiper-${this._id} .swiper-pagination-bullet { background: ${defaultIndicatorColor} }
        .taro-swiper-${this._id} .swiper-pagination-bullet-active { background: ${defaultIndicatorActiveColor} }
        </style>`}
        /> */}
        <View className="swiper-wrapper">{this.props.children}</View>
        <View className={paginationCls} />
      </View>
    );
  }
}
