import Taro from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import { IModPanelItem } from "@/pages/user/address";
import * as lib from "@/utils/lib";
import classnames from "classnames";
import { API } from "@/utils/api";
import { axios } from "@/utils/axios";
import "./AddressItem.scss";

export const convertSubmitAddress = item => ({
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
  address3: item.area
});

export const editAddress = item => {
  let url = API.MODIFY_MEMBER_ADDRESS_EDIT;

  let data = convertSubmitAddress(item);

  return axios({
    method: "post",
    url,
    data
  });
};

export default ({
  data: item,
  type = "edit",
  callback
}: {
  data: IModPanelItem;
  type: "edit" | "view" | "choose";
  callback?: () => void;
}) => {
  // 选择模式下，未选中的地址更改透明度
  const style =
    type == "choose" && item.isDefault !== 1 ? { opacity: 0.4 } : {};

  return (
    <View className="at-list__item" style={style}>
      <View
        className="at-list__item-container"
        onClick={() => {
          if (type === "choose") {
            callback && callback();
            return;
          }
          let url =
            type === "edit"
              ? `/pages/user/address/new?address_id=${item.address_id}`
              : "/pages/user/address/list";
          lib.jump(url);
        }}
      >
        <View className="at-list__item-content item-content">
          <View className="item-content__info">
            <View className="item-content__info-title">
              <View className="header">
                <Text>{item.name}</Text>
                <Text style={{ margin: "0 10px 0 20px" }}>{item.phone}</Text>
                {item.isDefault === 1 && <Text className="gardient">默认</Text>}
              </View>
              <View className="content">
                {item.province}
                {item.city}
                {item.area}
                {item.address}
              </View>
            </View>
          </View>
        </View>
        <View className="at-list__item-extra item-extra">
          <View
            className={classnames(
              "at-icon",
              { "at-icon-chevron-right": type === "view" },
              {
                "at-icon-edit": ["edit", "choose"].includes(type)
              }
            )}
          />
        </View>
      </View>
    </View>
  );
};
