import moment from "dayjs";

import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/zh-cn";
moment.extend(relativeTime);

export const orderDesc = {
  lucky: "恭喜您，中签啦!",
  lost: "很遗憾，您失去认购资格",
  payed: "支付成功",
  signed: "预约成功", // 等待抽签
  unsigned: "很遗憾，您未中签!",
  unlucky: "很遗憾，您未中签!",
  notAttend: "您未参与，请下次再来!",
  other: "预约失败"
};

export const getDescDetail = ({
  type,
  payedBefore,
  lotteryDate,
  ...props
}: {
  type: string;
  payedBefore: string;
  lotteryDate: string;
}) => {
  let desc = "抽签时间：" + lotteryDate;
  console.log(type, props);
  switch (type) {
    case "unsigned":
      desc = "感谢您参与!欢迎您关注最新的抽签购活动";
      break;
    case "lost":
      desc = `您未按时在${moment(payedBefore).format(
        "YYYY年M月D日HH时mm分"
      )}之前付款，认购资格被取消`;
      break;
    case "lucky":
      desc = `您的特制精品商品订单已经生成，请于${moment(payedBefore).format(
        "YYYY年M月D日HH时mm分"
      )}之前确认支付，逾期订单将自动失效`;
      break;
    case "payed":
      desc = `您已成功支付，商家将${
        moment().isAfter(payedBefore)
          ? ""
          : "在 " +
            moment(payedBefore)
              .locale("zh-cn")
              .from()
              .replace("内", "后")
      }陆续安排发货`;
      break;
    case "other":
    default:
      break;
  }
  return desc;
};
