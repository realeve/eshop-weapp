import Taro, { useRouter, useState, useEffect } from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import "./new.scss";
// import { API } from "@/utils/setting";
// import * as R from "ramda";
import { AtInput, AtSwitch } from "taro-ui";
import UserIcon from "../../login/components/LoginPassword/user.png";
import useSetState from "@/components/hooks/useSetState";
import { CButton } from "@/components/";
import CityPicker from "@/components/CityPicker";
import useFetch from "@/components/hooks/useFetch";
import { API } from "@/utils/api";

const AddAddress = () => {
  const [account, setAccount] = useSetState({
    username: "",
    phone: "",
    address: "",
    detail: "",
    is_default: true
  });

  const saveAddress = () => {
    console.log(account);
  };

  const [mode, setMode] = useState("add");
  const router = useRouter();

  let { loading, error } = useFetch({
    param: {
      url: API.ADDRESS_DETAIL,
      method: "post",
      params: {
        addressId: router.params.address_id
      }
    },
    valid: () => {
      let status = "undefined" !== (router.params && router.params.address_id);
      if (status) {
        setMode("update");
      }
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

export default AddAddress;
