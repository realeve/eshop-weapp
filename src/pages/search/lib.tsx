export interface IPropGoodsList {
  storeName: string;
  storeId: number;
  commonId: number;
  goodsName: string;
  jingle: string;
  imageSrc: string;
  goodsPrice: number;
  //暂时添加的webPrice0,因为从后台拿取的数据未发现goodsPrice字段
  webPrice0: number;
  goodsSaleNum: number;
  goodsFreight: number | any;
  goodsRate: number;
  sellerId: number;
}
