import Taro, { useState, useEffect } from "@tarojs/taro";
import { View } from "@tarojs/components";
import ListView from "taro-listview";
import { SPECIAL_GOODS } from "@/utils/api";
import useFetch from "@/components/hooks/useFetch";
import useSetState from "@/components/hooks/useSetState";
import { CEmpty, CPrice, CButton } from "@/components";
import { historyHandler } from "./lib";
import "./index.scss";
import * as lib from "@/utils/lib";
import { AtIcon } from "taro-ui";
// import { CardCountdown } from "@/pages/special/history/index";
import { CImgCard } from "@/pages/special/components/CImgCard";
import CountTime from "@/pages/user/order/components/CountTime";

interface IOrderItem {
  activityId: number; // 主KEY
  goodsPrice: number;
  status: number;
  statusName: string;

  orderTime: string;
  endTime: string;
  payExpireTime: string;
  drawTime: string;

  goods: {
    goodsId: number;
    goodsName: string;
    imageSrc: string;
    goodsFullSpecs: string;
    price: number;
  };
  [key: string]: any;
}

interface ISubscribeList {
  list: Array<IOrderItem>;
  pageResult: {
    totalPage: number | undefined;
  };
}

const History = () => {
  const [page, setPage] = useState(1);

  const [state, setState] = useSetState({
    isLoaded: true,
    hasMore: false,
    list: []
  });

  const { loading, reFetch } = useFetch<ISubscribeList>({
    param: {
      ...SPECIAL_GOODS.history,
      params: {
        page
      }
    },
    callback: res => {
      let { hasMore } = res.pageResult;
      setState({
        hasMore,
        list: [...state.list, ...historyHandler(res)],
        isLoaded: true //page === 1
      });
    }
  });
  const onScrollToLower = async fn => {
    console.info("scroll trigger", state);
    if (state.hasMore) {
      setPage(page + 1);
    }
    fn();
  };

  const onRefresh = async fn => {
    reFetch();
    console.log("刷新数据");
    fn();
  };
  console.info("loading + loaded", loading, state.isLoaded, state.hasMore);
  return state && state.list && state.list.length > 0 ? (
    <View>
      <ListView
        isLoaded={state.isLoaded}
        hasMore={state.hasMore}
        style={{ height: "calc(100% - 40px)", background: "#f8f8f8" }}
        onScrollToLower={fn => onScrollToLower(fn)}
        onPullDownRefresh={fn => onRefresh(fn)}
      >
        {state.list.map((data: IOrderItem) => (
          <div className="detail" key={data.activityId}>
            <div
              className="goods"
              onClick={() => {
                lib.jump(`/special/page/${data.activityId}`);
              }}
            >
              <CImgCard
                data={{
                  href: `/special/page/${data.activityId}`,
                  img: data.goodsItem.imageSrc
                }}
                style={{ margin: "10px 0", background: "#fff" }}
              />
              {/* <div className="mask}></div>
                  <img src={goodsItem.imageSrc} alt="" /> */}
            </div>
            <div className="goodsInfo" key={data.goodsItem.goodsId}>
              <div className="goodsMain">
                <div className="goodsTitle">
                  {data.promo}
                  {data.goodsName}
                </div>
                <div className="thumbnail">
                  <p>{data.jingle}</p>
                </div>
                <div className="title">
                  <div className="info">
                    <div className="name">预约价</div>
                    <div className="value">
                      <CPrice retail={data.goodsPrice} className="price" />
                    </div>
                  </div>
                  <div className="info">
                    <div className="name">预约数量</div>
                    <div className="value">{data.issueQuantity}</div>
                  </div>
                  <div className="info">
                    <div className="name">预约开始时间</div>
                    <div className="value">{data.beginTime}</div>
                  </div>
                  <div className="info">
                    <div className="name">预约结束时间</div>
                    <div className="value">{data.endTime}</div>
                  </div>
                  <div className="info">
                    <div className="name">抽签时间</div>
                    <div className="value">{data.drawTime}</div>
                  </div>
                  {/* <div className="status}>
                        <a className="desc}>{data.statusName}</a>
                        <CountTime time={remainTime} />
                      </div> */}
                </div>
              </div>
              <div className="type">
                {data.showCountDown && (
                  <View>
                    {/* <AtIcon className="icon" value="clock" />
                    <span className="limitTitle">还有</span> */}
                    <div className="countime">
                      <CountTime time={data.remainTime} />
                      {/* <CardCountdown time={data.remainTime} type={"small"} /> */}
                    </div>
                    <span className="limitTitle">{data.operation}</span>
                  </View>
                )}
                <div className="button">
                  <CButton
                    wide
                    theme="yellowGardiant"
                    style={{
                      width: 120,
                      height: 32,
                      lineHeight: 1,
                      margin: 11
                    }}
                    onClick={() => {
                      lib.jump(`/special/page/${data.activityId}`);
                    }}
                  >
                    {data.buttonTitle}
                  </CButton>
                </div>
              </div>
            </div>
          </div>
        ))}
      </ListView>
    </View>
  ) : (
    <CEmpty type="cart" />
  );
};

History.config = {
  navigationBarTitleText: "历史预约活动"
};
export default History;
