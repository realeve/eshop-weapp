export const orderDesc = {
  lucky: "恭喜您，中签啦!",
  lost: "很遗憾，您失去认购资格",
  payed: "恭喜您，中签啦!",
  unsigned: "很遗憾，您未中签!",
  unlucky: "很遗憾，您未中签!",
  notAttend: "您未参与，请下次再来!",
  other: ""
};

export const getDescDetail = ({
  type,
  payedBefore,
  lotteryDate
}: {
  type: string;
  payedBefore: string;
  lotteryDate: string;
}) => {
  let desc = "抽签时间：" + lotteryDate;
  switch (type) {
    case "unsigned":
      desc = "感谢您参与!欢迎您关注最新的抽签购活动";
      break;
    case "lost":
      desc = `您未按时在${moment(payedBefore).format(
        " Y年M月D日HH时mm分 "
      )}之前付款，认购资格被取消`;
      break;
    case "lucky":
      desc = `您的特制精品商品订单已经生成，请于${moment(payedBefore).format(
        " Y年M月D日HH时mm分 "
      )}前确认支付，逾期订单将自动失效`;
      break;
    case "other":
    default:
      break;
  }
  return desc;
};
