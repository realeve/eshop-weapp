import "./index.scss";
import Steps from "@/components/step";
import Skeleton from "taro-skeleton";
import useFetch from "@/components/hooks/useFetch";
import { ORDER } from "@/utils/api";
import { mdFormat } from "@/utils/lib";
import moment from "moment";
import * as R from "ramda";
import { View, Text, ScrollView } from "@tarojs/components";

interface IPropData {
  id: number;
  time: string;
  date: string;
  text: string;
  rec_time: string;
  [key: string]: any;
}

interface IPropLogistics {
  param: {
    shipSn: string;
    shipCode: string;
    sendTime: string;
  };
  [key: string]: any;
}

export interface IPropExpressDB {
  expressVoList: {
    acceptAddress: string;
    acceptTime: string;
    accept_address: string;
    accept_time: string;
    context: string;
    id: number;
    mailno: string;
    opCode: string;
    op_code: string;
    orderSn: number;
    orderid: number;
    remark: string;
    shipName: string;
    shipSn: string;
    time: string;
  }[];
  shipName: string;
  shipSn: string;
}

/**
 * 顺丰接口调用，状态码指南，详见： https://open.sf-express.com/doc/sf_openapi_document_V1.pdf
 *
 * 7.3 顺丰常用路由信息操作码
 *
 * @param remark
 */
const getStatusByOpcode = (opCode: string) => {
  let status = "",
    value = 0;
  console.log(opCode);
  switch (Number(opCode)) {
    case 50:
      status = "已发货";
      value = 1;
      break;
    case 44:
    case 630:
      status = "派件中";
      value = 3;
      break;
    case 80:
    case 8000:
      status = "已签收";
      value = 4;
      break;
    default:
      status = "运输中";
      value = 2;
      break;
  }
  return { status, value };
};

let expressStatus = ["待出库", "已发货", "运输中", "派件中", "已签收"];

const handleExpressData = (e: IPropExpressDB, sendTime: string) => {
  let records = R.sortBy(R.prop("time"))(e.expressVoList);

  // 根据最近一次状态确定物流状态
  let lastRecord = R.last(records);

  const sendDetail = sendTime
    ? [
        {
          id: -1,
          time: moment(sendTime).format("HH:mm"),
          text: "商家已出库",
          date: mdFormat(sendTime),
          rec_time: sendTime,
          opCode: "0"
        }
      ]
    : [];

  if (R.isNil(lastRecord)) {
    return {
      status: {
        status: sendTime ? "已出库" : "待出库",
        value: -1
      },
      data: sendDetail
    };
  }

  let status: {
    status: string;
    value: number;
  } = getStatusByOpcode(lastRecord.opCode);

  let recordData = records.map(item => ({
    id: item.id,
    time: moment(item.time).format("HH:mm"),
    text: item.context,
    date: mdFormat(item.time),
    rec_time: item.time,
    opCode: item.opCode
  }));

  if (sendTime) {
    recordData = [...sendDetail, ...recordData];
  }

  return {
    status,
    data: recordData
  };
};

interface IExpressData {
  status: {
    status: string;
    value: number;
  };
  data: IPropData[];
}

const Logistics = ({ param: { sendTime, ...param } }: IPropLogistics) => {
  let { data, loading, error } = useFetch<IExpressData>({
    param: {
      ...ORDER.express,
      data: param
    },
    callback: data => handleExpressData(data, sendTime)
  });

  if (sendTime) {
    expressStatus[0] = "已出库";
  }

  return (
    <View className="logisticsWrap">
      <Steps progressDot current={data ? data.status.value : 0}>
        {expressStatus.map(item => (
          <Steps.Step title={item} key={item} />
        ))}
      </Steps>
      <Skeleton loading={loading} animate row={7}>
        {data && (
          <ScrollView scrollY className="information">
            {data.data.length > 0 &&
              data.data.map((item: IPropData, idx: number) => (
                <View key={idx}>
                  <View className="address">
                    <View className="wrap">
                      <View className="time">{item.time}</View>
                      <View className="date">{item.date}</View>
                    </View>
                    <View className="addressText">{item.text}</View>
                  </View>
                  {idx + 1 < (data as IExpressData).data.length && (
                    <View className="line" />
                  )}
                </View>
              ))}
          </ScrollView>
        )}
      </Skeleton>
    </View>
  );
};

export default Logistics;
