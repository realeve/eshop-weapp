import * as R from "ramda";
import { API } from "@/utils/api";
import { axios } from "@/utils/axios";

export interface IADDRESS {
  realName: string;
  areaId1: number;
  address1: string;
  areaId2: number;
  address2: string;
  areaId3: number;
  address3: string;
  areaId4: number;
  areaId: number;
  areaInfo: string;
  address: string;
  mobPhone: string;
  isDefault: number;
  addressId?: number;
}

export interface IModPanelItem {
  address_id: string;
  name: string;
  phone: string;
  province: string;
  provId: number;
  city: string;
  cityId: number;
  area: string;
  areaId: number;
  address: string;
  code?: string;
  option?: string;
  isDefault: number;
}

export const handleAddressList: (res: {
  addressList: IADDRESS[];
}) => IModPanelItem = (res) =>
  R.map((item: IADDRESS) => ({
    address_id: item.addressId + "",
    name: item.realName,
    phone: item.mobPhone,
    province: item.address1,
    provId: item.areaId1,
    city: item.address2,
    cityId: item.areaId2,
    area: item.address3,
    areaId: item.areaId3,
    address: item.address,
    code: item.areaId3 + "", //item.areaId + '',
    isDefault: item.isDefault,
    isOpened: false,
  }))(res.addressList);

export const convertSubmitAddress = (item) => ({
  realName: item.name,
  areaId3: item.areaId,
  areaId2: item.cityId,
  areaId1: item.provId,
  areaId4: "", // 存疑
  areaId: item.code, // 存疑
  areaInfo: `${item.province} ${item.city} ${item.area}`,
  address: item.address,
  mobPhone: item.phone,
  isDefault: item.isDefault ? 1 : 0,
  addressId: item.address_id,
  address1: item.province,
  address2: item.city,
  address3: item.area,
});

export const editAddress = (item) => {
  let url = API.MODIFY_MEMBER_ADDRESS_EDIT;

  let data = convertSubmitAddress(item);

  return axios({
    method: "post",
    url,
    data,
  });
};
