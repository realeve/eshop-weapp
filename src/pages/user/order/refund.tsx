import Taro, { useRouter, useEffect } from "@tarojs/taro";
import { CButton } from "@/components/";
import { View } from "@tarojs/components";
import { AtInput } from "taro-ui";
import useSetState from "@/components/hooks/useSetState";
import useFetch from "@/components/hooks/useFetch";
import { SERVICE } from "@/utils/api";
import Skeleton from "taro-skeleton";
import { CPrice, CImageUpload } from "@/components";
export interface IOrdersGoodsVo {
  basePrice: number;
  buyNum: number;
  categoryId: number;
  categoryId1: number;
  categoryId2: number;
  categoryId3: number;
  commissionAmount: number;
  commissionRate: number;
  commonId: number;
  complainId: number;
  createTime: any;
  goodsContractVoList: any[];
  goodsFullSpecs: string;
  goodsId: number;
  goodsImage: string;
  goodsName: string;
  goodsPayAmount: number;
  goodsPrice: number;
  goodsSerial: any;
  goodsType: number;
  imageSrc: string;
  joinBigSale: number;
  memberId: number;
  memberName: any;
  ordersAmount: number;
  ordersGoodsId: number;
  ordersGoodsRefundId: number;
  ordersGoodsRefundState: number;
  ordersGoodsRefundType: number;
  ordersId: number;
  promotionTitle: string;
  refundAmount: any;
  refundId: number;
  refundSn: number;
  refundType: number;
  savePrice: number;
  showRefund: number;
  showRefundInfo: number;
  showViewRefund: number;
  showViewReturn: number;
  storeId: number;
  storeVIPDiscount: number;
  taxAmount: number;
  taxRate: number;
  unitName: string;
}

const handleRefundByOrder = (data: { ordersVo: IOrdersGoodsVo }) => ({
  goodsPayAmount: data.ordersVo.ordersAmount
});

interface IState {
  refundAmount: number;
  picJson?: string;
  buyerMessage: string;
}

const Detail = () => {
  const {
    params: { id: ordersId }
  } = useRouter();

  let { data, loading, error } = useFetch({
    param: {
      ...SERVICE.refundByOrder,
      data: { ordersId }
    },
    valid: () => ordersId > "0",

    // 对订单调整
    callback: handleRefundByOrder //  handleRefundByGoods,
  });

  const [state, setState] = useSetState<IState>({
    buyerMessage: "",
    refundAmount: 0,
    picJson: ""
  });

  useEffect(() => {
    if (!data) {
      return;
    }

    setState({
      refundAmount: data.goodsPayAmount
    });
  }, [data]);

  return (
    <Skeleton loading={loading} animate row={3}>
      <View>
        <View className="at-input">
          <View className="at-input__container">
            <View className="at-input__title">退款金额</View>
            <View className="at-input__input">
              <CPrice retail={state.refundAmount} />
            </View>
          </View>
        </View>
        <AtInput
          name="remark"
          title="退款说明"
          type="text"
          placeholder="请输入退款说明"
          value={state.buyerMessage}
          onChange={buyerMessage => setState({ buyerMessage })}
          clear
          autoFocus
        />
        <View className="at-input">
          <CImageUpload
            onUpload={picJson =>
              setState({ picJson: picJson.map(({ name }) => name).join(",") })
            }
          />
        </View>

        <View style={{ margin: "16px" }}>
          <CButton
            theme="yellow"
            size="small"
            round={false}
            onClick={() => {
              Taro.navigateBack();
            }}
          >
            申请退款
          </CButton>
        </View>
      </View>
    </Skeleton>
  );
};

Detail.config = {
  navigationBarTitleText: "申请退款"
};

export default Detail;
