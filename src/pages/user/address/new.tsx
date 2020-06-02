import Taro, { useRouter, useState, useEffect } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import "./new.scss";
import * as R from "ramda";
import { AtInput, AtSwitch } from "taro-ui";
import UserIcon from "../../login/components/LoginPassword/user.png";
import useSetState from "@/components/hooks/useSetState";
import { CButton } from "@/components/";
import CityPicker from "@/components/CityPicker";
import useFetch from "@/components/hooks/useFetch";
import { API } from "@/utils/api";
import fail from "@/components/Toast/fail";
import success from "@/components/Toast/success";

import { axios, AxiosError } from "@/utils/axios";
import { AxiosRequestConfig } from "axios";
import { reg, randomStr, jump } from "@/utils/lib";
import { connect } from "@tarojs/redux";

interface IAxiosResponse {
  success?: string;
  message?: string;
  datas?: {
    success?: string;
  };
}

const handleError = (res: AxiosError) => Promise.reject(res.message);

const http = (param: AxiosRequestConfig) =>
  axios<IAxiosResponse>(param).catch(handleError);

export const address_edit = (item: {}) =>
  http({
    method: "post",
    url: API.MODIFY_MEMBER_ADDRESS_EDIT as string,
    data: item
  });

export const address_add = (item: {}) =>
  axios<{
    addressId: string;
    message?: string;
  }>({
    method: "post",
    url: API.MODIFY_MEMBER_ADDRESS_ADD as string,
    data: item
  })
    .then(res => ({
      success: !R.isNil(res.addressId),
      message: res.message,
      addressId: res.addressId
    }))
    .catch(handleError);

//验证地址修改信息
export let verifyAddress = stateExtra => {
  const { username, phone, province, city, area, address } = stateExtra;
  // console.log(stateExtra);
  if (!username) {
    fail("请填写你的真实姓名，方便收货");
    return false;
  }
  if (!(phone.length === 11 && reg.phone.test(phone))) {
    fail("错误的手机号码，请重新填写");
    return false;
  }
  if (province == "" || city == "" || area == "") {
    fail("请选择收货地址");
    return false;
  }

  if (address == "") {
    fail("详细地址不能为空");
    return false;
  }

  return true;
};

let getDetail = (name, list) => {
  let prov = list.find(item => item.areaName == name);
  return { id: prov ? prov.areaId : "", data: prov };
};
const getProvIdByAddress = (address, provlist) => {
  let data = R.clone(address);

  let [province, city, area] = data.address.split(" ");

  let prov = getDetail(province, provlist);
  data.provId = prov.data ? prov.id : "";
  if (prov.data) {
    let areaData = getDetail(city, prov.data.sub);
    data.cityId = areaData.data ? areaData.id : "";
    if (areaData.data) {
      areaData = getDetail(area, areaData.data.sub);
      data.areaId = areaData.data ? areaData.id : "";
    }
  }

  // 处理 provId  cityId  areaId

  return {
    ...data,
    province,
    city,
    area
  };
};

export interface IModPanelItem {
  address_id: string; // | number;
  username: string;
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
  isSpecial: boolean;
}

let DataChange = (
  res: IModPanelItem,
  defaultSite: string | boolean,
  provlist
) => {
  if (!res || !provlist) {
    return {};
  }

  let data = getProvIdByAddress(res, provlist);

  let newdata = {
    realName: data.username,
    address1: data.province,
    areaId1: data.provId,
    address2: data.city,
    areaId2: data.cityId,
    address3: data.area,
    areaId3: data.areaId,
    areaId4: 1,
    areaId: data.code || 0,
    areaInfo: data.province + " " + data.city + " " + data.area,
    address: data.detail,
    mobPhone: data.phone,
    isDefault: defaultSite ? 1 : 0,
    addressId: data.address_id
  };

  return newdata;
};

const AddAddress = ({ dispatch }) => {
  const [account, setAccount] = useSetState({
    username: "",
    phone: "",
    address: "",
    detail: "",
    is_default: true
  });

  const [provlist, setProvlist] = useState(null);

  const refresh = () => {
    dispatch({
      type: "order/setStore",
      payload: { addressListHash: randomStr() }
    });
    Taro.navigateBack();
  };

  // 新增地址
  const insertAddress = async ({ defaultSite, ...props }) => {
    address_add(DataChange(props, defaultSite, provlist))
      .then(res => {
        if (res.addressId) {
          success("新增地址信息成功").then(() => {
            refresh();
          });
        } else {
          fail("新增地址错误?" + res.message);
        }
      })
      .catch(res => {
        fail("新增地址错误:" + res.message);
      });
  };

  // 编辑地址（点击保存的时候）
  const editAddress = async props => {
    address_edit(DataChange(props, props.defaultSite, provlist))
      .then(res => {
        if (res.success) {
          success("编辑地址信息成功!").then(() => {
            refresh();
          });
        } else {
          fail("编辑地址错误?" + res.message);
        }
      })
      .catch(res => {
        fail("编辑地址错误:" + res.message);
      });
  };

  // TODO 保存地址
  const saveAddress = () => {
    if (!verifyAddress(account)) {
      return;
    }
    if (mode == "add") {
      insertAddress({
        ...account,
        defaultSite: true,
        is_default: true
      });
      return;
    }
    editAddress({ address_id: router.params.address_id, ...account });
  };

  const [mode, setMode] = useState("add");
  const router = useRouter();

  useEffect(() => {
    let nextMode =
      typeof (router.params && router.params.address_id) != "undefined"
        ? "edit"
        : "add";
    setMode(nextMode);
    if (nextMode == "edit") {
      Taro.setNavigationBarTitle({
        title: "编辑地址"
      });
    }
  }, [router.params.address_id]);

  let { loading, error } = useFetch({
    param: {
      url: API.ADDRESS_DETAIL,
      method: "post",
      params: {
        addressId: router.params.address_id
      }
    },
    valid: () => {
      let status =
        "undefined" != typeof (router.params && router.params.address_id);

      setMode(status ? "edit" : "add");
      return status;
    },
    callback: e => {
      let res = e.address;
      setAccount({
        username: res.realName,
        phone: res.mobPhone,
        address: res.areaInfo,
        detail: res.address,
        is_default: res.isDefault > 0
      });
    }
  });

  return (
    <View className="address_list">
      <View style={{ flex: 1 }}>
        <AtInput
          name="username"
          title="收货人"
          type="text"
          placeholder="请输入收货人"
          value={account.username}
          onChange={username => setAccount({ username })}
          clear
          autoFocus
        >
          <Image className="icon" src={UserIcon} />
        </AtInput>
        <AtInput
          name="phone"
          title="手机号码"
          type="phone"
          placeholder="请输入手机号码"
          value={account.phone}
          onChange={phone => setAccount({ phone })}
          clear
          autoFocus
        />
        <CityPicker
          title="所在地区"
          value={account.address}
          onChange={address => setAccount({ address })}
          onLoad={setProvlist}
        />
        <AtInput
          name="detail"
          title="详细地址"
          type="text"
          placeholder="请输入详细地址"
          value={account.detail}
          onChange={detail => setAccount({ detail })}
          clear
          autoFocus
        />
        <View style={{ marginTop: "15px" }}>
          <AtSwitch
            title="设为默认地址"
            checked={account.is_default}
            onChange={is_default => setAccount({ is_default })}
          />
        </View>
      </View>
      <View className="address_list_action">
        <CButton theme="gardient" onClick={saveAddress}>
          保存
        </CButton>
      </View>
    </View>
  );
};

AddAddress.config = {
  navigationBarTitleText: "新增地址"
};

export default connect(() => ({}))(AddAddress as any);
