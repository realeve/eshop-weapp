import Taro from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import { IModPanelItem } from "@/pages/user/address";
import * as lib from "@/utils/lib";
import "./AddressItem.scss";
import classnames from "classnames";

export default ({
  data: item,
  type = "edit"
}: {
  data: IModPanelItem;
  type: "edit" | "view";
}) => {
  return (
    <View className="at-list__item">
      <View className="at-list__item-container">
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
        <View
          className="at-list__item-extra item-extra"
          onClick={() => {
            let url =
              type === "edit"
                ? `/pages/user/address/new?address_id=${item.address_id}`
                : "`/pages/user/address/list`";
            lib.jump(url);
          }}
        >
          <View
            className={classnames(
              "at-icon",
              { "at-icon-chevron-right": type === "view" },
              {
                "at-icon-edit": type === "edit"
              }
            )}
          />
        </View>
      </View>
    </View>
  );
};
