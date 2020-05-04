import Taro, { useRouter, useEffect, useState } from "@tarojs/taro";
import { CButton } from "@/components/";
import { View } from "@tarojs/components";
import useSetState from "@/components/hooks/useSetState";
import useFetch from "@/components/hooks/useFetch";
import { ORDER, ORDER_TYPE } from "@/utils/api";
import Skeleton from "taro-skeleton";
import { axios } from "@/utils/axios";
import fail from "@/components/Toast/fail";
import success from "@/components/Toast/success";
import { IGoodsInfo, IDBGoodsInfo, IAppendComment } from "./interface";
import * as R from "ramda";
import "./comment.scss";

import CommentShop from "./components/CommentItem/shop";
import CommentItem from "./components/CommentItem";

export interface IUploadImgInfo {
  name: string;
  url: string;
}

export interface IGoodsComment {
  id: number;
  rate: number;
  comment: string;
  type?: string;
  img?: IUploadImgInfo[];
  [key: string]: any;
}

const getCommentAxiosParam: (
  comment: IGoodsComment[],
  rate: {
    express: number;
    service: number;
    description: number;
  },
  ordersType: string
) => {
  descriptionCredit: number;
  serviceCredit: number;
  deliveryCredit: number;
  contentList: string[];
  ordersGoodsIdList: number[];
  scoreList: number[];
  imageList: string[];
  ordersType: string;
  ordersId?: number;
  [key: string]: any;
} = (comment, rate, ordersType) => {
  let rateParam = {
    descriptionCredit: rate.description,
    serviceCredit: rate.service,
    deliveryCredit: rate.express
  };

  let goodsParam: {
    contentList: string[];
    ordersGoodsIdList: number[];
    scoreList: number[];
    imageList: string[];
  } = {
    contentList: [],
    ordersGoodsIdList: [],
    scoreList: [],
    imageList: []
  };

  comment.forEach(item => {
    goodsParam.contentList.push(item.comment);
    goodsParam.ordersGoodsIdList.push(item.id);
    goodsParam.scoreList.push(item.rate);
    goodsParam.imageList.push(
      item.img ? R.pluck("name")(item.img).join("_") : ""
    );
  });

  return {
    ordersType,
    ...goodsParam,
    ...rateParam
  };
};

const handleComment: (e: IDBGoodsInfo) => IGoodsInfo = e => ({
  orderid: e.orders.ordersId,
  shopid: e.store.storeId,
  shopName: e.store.storeName,
  goods: e.ordersGoodsList.map(item => ({
    id: item.ordersGoodsId, // 后端需该字段，不是goodsId
    name: item.goodsName,
    type: item.goodsFullSpecs,
    img: item.imageSrc,
    goodsPayAmount: item.goodsPayAmount
  }))
});

const appendComent: (e: IAppendComment) => IGoodsInfo = e => ({
  orderid: e.ordersId,
  shopid: e.store.storeId,
  shopName: e.store.storeName,
  goods: e.evaluateGoodsOrderVoList.map(item => ({
    goodsId: item.goodsId, // 后端需该字段，不是goodsId
    id: item.evaluateId,
    name: item.goodsName,
    type: item.goodsFullSpecs,
    img: item.goodsImageUrl,
    comment: {
      img: item.imagesUrlList,
      content: item.content
    }
  }))
});

interface IGoodsItem {
  id: number;
  name: string;
  type: string;
  img: string;
  goodsPayAmount: number;
}

const CommentPage = () => {
  const {
    params: { id: ordersId, type, ordersType = String(ORDER_TYPE.NORMAL) }
  } = useRouter();

  const append = type == "append";

  const { loading, data } = useFetch({
    param: {
      ...ORDER[append ? "appendCommentList" : "commentList"],
      data: {
        ordersId,
        ordersType
      }
    },
    valid: () => ordersId,
    callback: append ? appendComent : handleComment
  });

  const [comment, setComment] = useState<IGoodsComment[]>([]);

  useEffect(() => {
    if (!data) {
      return;
    }

    setComment(
      data.goods.map(({ id }: { id: number }) => ({
        id,
        comment: "",
        rate: 0,
        img: ""
      }))
    );
    console.log(data);
  }, [data]);

  const [rate, setRate] = useSetState({
    express: 0,
    service: 0,
    description: 0
  });

  const [commentLoading, setCommentLoading] = useState(false);

  const doComment = () => {
    if (!ordersId) {
      return;
    }

    let commentParam = getCommentAxiosParam(comment, rate, ordersType);
    commentParam = {
      ordersId,
      ...commentParam
    };

    let appendParam = {};
    if (append) {
      appendParam = {
        evaluateIdList: commentParam.ordersGoodsIdList,
        ordersId,
        contentList: commentParam.contentList,
        imageList: commentParam.imageList
      };
    }

    setCommentLoading(true);
    axios({
      ...ORDER[append ? "appendComment" : "addComment"],
      data: append ? appendParam : commentParam
    })
      .then(_ => {
        success("评价成功").then(() => {
          Taro.navigateBack();
        });
      })
      .finally(() => {
        setCommentLoading(false);
      });
  };

  return (
    <Skeleton loading={loading} animate row={3}>
      <View className="comment_page">
        {data &&
          data.goods.map((item: IGoodsItem, idx) => (
            <CommentItem
              goods={item}
              key={item.id}
              onChange={e => {
                let nextState = R.clone(comment);
                nextState[idx] = e;
                setComment(nextState);
              }}
            />
          ))}

        <CommentShop rate={rate} setRate={setRate} />

        <View style={{ margin: "16px" }}>
          <CButton
            theme="yellow"
            size="small"
            round={false}
            onClick={doComment}
          >
            提交评价
          </CButton>
        </View>
      </View>
    </Skeleton>
  );
};

CommentPage.config = {
  navigationBarTitleText: "发表评价"
};

export default CommentPage;
