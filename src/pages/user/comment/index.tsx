import Taro, { useRouter, useState, useEffect } from "@tarojs/taro";
import { View, Image, Text } from "@tarojs/components";
import "./index.scss";
import Tab from "@/pages/search/tab/";

import { AtCurtain, AtModal } from "taro-ui";
import ListView from "taro-listview";
import useSetState from "@/components/hooks/useSetState";
import useFetch from "@/components/hooks/useFetch";
import useLogin from "@/components/hooks/useLogin";
import { ORDER } from "@/utils/api";

import { CLIENT_TYPE } from "@/utils/setting";

import { getWebpSuffix } from "@/services/common";

/**
 * 商品评价定义
 */
export enum EvalLevel {
  all = -1,
  good = 1, // 好评
  mid = 2, // 中评
  weak = 3, //差评
  pic = 4 // 有图
}

export const commentStateList: {
  name: string;
  key: string;
  id: number;
  type: number;
}[] = [
  {
    name: "全部评价",
    key: "all", // 不传时显示全部订单
    id: 0,
    type: EvalLevel.all
  },
  {
    name: "有图评价",
    key: "pic",
    id: 1,
    type: EvalLevel.pic
  }
];

interface ICommentItem {
  id: string;
  content: string;
  time: string;
  img: string[];
  [key: string]: any;
}
export interface ICommentList {
  orderid: number;
  score: number | string;
  comment: ICommentItem[];
  shopName: string;
  goodsName: string;
  price: string | number;
  [key: string]: any;
}

interface ICommentListDB {
  commonId: number;
  content: string;
  contentAgain: any;
  days: string;
  evaluateId: number;
  evaluateTime: string;
  evaluateTimeAgain: any;
  explainContent: any;
  explainContentAgain: any;
  explainTime: number;
  explainTimeAgain: number;
  goodsFullSpecs: string;
  goodsImageUrl: string;
  goodsName: string;
  goodsSpecList: string[];
  imagesAgainUrlList: any[];
  imagesUrlList: string[];
  memberAvatarUrl: string;
  memberId: number;
  memberNameHidden: string;
  scores: number;
  storeId: number;
  storeName: string;
}

const Comment = () => {
  let isLogin = useLogin();
  const router = useRouter();

  const [current, setCurrent] = useState(router.params.state || 0);

  useEffect(() => {
    if ("undefined" == typeof router.params.state) {
      return;
    }
    setCurrent(+router.params.state);
  }, [router.params]);

  const [page, setPage] = useState(1);
  const [modal, setModal] = useSetState({ show: false, img: null });

  const [state, setState] = useSetState({
    hasMore: true,
    list: []
  });

  const { loading, reFetch } = useFetch({
    param: {
      ...ORDER.evaluate,
      method: "get",
      params: {
        clientType: CLIENT_TYPE.web,
        evalLv: commentStateList[current].type,
        page
      }
    },
    callback: (e: {
      evaluateList: ICommentListDB[];
      pageEntity: { hasMore: boolean };
    }) => {
      // 继续加载数据
      let { hasMore } = e.pageEntity;

      let dist = [];
      dist = e.evaluateList.map(item => {
        let comment = {
          id: String(item.evaluateId),
          content: item.content,
          time: item.evaluateTime,
          img: (item.imagesUrlList || []).map(img => img + getWebpSuffix())
        };

        // if (item.contentAgain) {
        //   comment.push({
        //     id: item.evaluateId + "_again",
        //     content: item.contentAgain,
        //     time: item.evaluateTimeAgain,
        //     img: item.imagesAgainUrlList
        //   });
        // }

        return {
          id: item.evaluateId,
          orderid: item.ordersId,
          isVirtual: item.isVirtual,
          price: item.price,

          score: item.scores,
          comment,
          shopName: item.storeName,
          goodsName: item.goodsName,
          goodsType: item.goodsFullSpecs,
          goodsImg: item.goodsImageUrl + getWebpSuffix(),
          user: {
            avatar: item.memberAvatarUrl,
            name: item.memberNameHidden
          }
        };
      });

      setState({
        list: [...state.list, ...dist],
        hasMore
      });
    },
    valid: () => state.hasMore && isLogin
  });

  // 更新cat信息
  const handleMenu = index => {
    setCurrent(index);

    // 重置数据列表
    setState({
      list: [],
      hasMore: true
    });

    reFetch();

    setPage(1);
  };

  const onScrollToLower = async fn => {
    // 修复无限触发ScrollToLower
    if (loading || !state.hasMore) {
      return;
    }
    setPage(page + 1);
    fn();
  };

  return (
    <View className="user_comment">
      <Tab list={commentStateList} current={current} onChange={handleMenu} />
      <ListView
        lazy=".lazy-view"
        isLoaded={!loading}
        hasMore={state.hasMore}
        style={{ height: "calc(100% - 40px)", background: "#f8f8f8" }}
        onScrollToLower={onScrollToLower}
        onPullDownRefresh={onScrollToLower}
        className="comment_detail"
      >
        {state.list.map(item => {
          return (
            <View className="at-list" key={item.id}>
              <View className="header">
                <View className="shop">
                  <Image src={item.user.avatar} className="icon" />
                  <Text className="title">{item.user.name}</Text>
                </View>
                <View className="status">{item.comment.time}</View>
              </View>
              <View className="comment_wrap">
                <View className="content">{item.comment.content}</View>
                <View className="imgs">
                  {/* <Image
                    src="https://statictest.ccgold.cn/image/8f/94/8f9439a267e0b2c0ba84304ee4a74a45.jpg"
                    className="img"
                    onClick={() =>
                      setModal({
                        show: true,
                        img:
                          "https://statictest.ccgold.cn/image/8f/94/8f9439a267e0b2c0ba84304ee4a74a45.jpg"
                      })
                    }
                  /> */}
                  {item.comment.img.map((img: string) => (
                    <Image
                      key={img}
                      src={img}
                      className="img"
                      onClick={() => {
                        setModal({
                          show: true,
                          img
                        });
                      }}
                    />
                  ))}
                </View>
              </View>
              <View className="goods">
                <Image src={item.goodsImg} className="img" />
                <View style={{ fontSize: "14px" }}>{item.goodsName}</View>
              </View>
            </View>
          );
        })}
      </ListView>

      <AtCurtain
        isOpened={modal.show}
        onClose={() => setModal({ show: false })}
        closeBtnPosition="top-left"
      >
        <Image src={modal.img} className="modal_img" />
      </AtCurtain>
    </View>
  );
};

Comment.config = {
  navigationBarTitleText: "我的评价"
};

export default Comment;
