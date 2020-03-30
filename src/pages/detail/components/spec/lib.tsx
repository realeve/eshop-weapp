// 根据规格获取商品信息
export const getGoodsInfoBySpec = (res, data) => {
  let specValueIds = res.map(item => item.specValueId).join(",");
  return data.goodsList.find(item => item.specValueIds === specValueIds);
};
