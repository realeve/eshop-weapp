import Taro from "@tarojs/taro";
import { View, ScrollView } from "@tarojs/components";
import "./index.scss";
import EmptyAddress from "./empty";
import useFetch from "@/components/hooks/useFetch";
import { API } from "@/utils/setting";
import { AtList } from "taro-ui";
import { CButton } from "@/components";
import * as lib from "@/utils/lib";
import AddressItem from "./AddressItem";
import {
  IModPanelItem,
  handleAddressList as callback,
  editAddress,
} from "./lib";

import { connect } from "@tarojs/redux";

const Address = ({ dispatch }) => {
  const { data } = useFetch<IModPanelItem[]>({
    param: {
      method: "post",
      url: API.MEMBER_ADDRESS_LIST as string,
    },
    callback,
  });

  return (
    <View className="address_list">
      {data && data.length === 0 && <EmptyAddress />}
      <ScrollView scrollY className="address_list_wrap">
        <AtList>
          {(data || []).map((item, index) => (
            <View className="at-list__item" key={item.address_id}>
              <AddressItem
                type="choose"
                data={item}
                callback={() => {
                  editAddress({
                    ...item,
                    isDefault: true,
                  }).then(() => {
                    // 返回确认页
                    dispatch({
                      type: "order/setStore",
                      currentAddress: {
                        ...item,
                        isDefault: true,
                      },
                    });
                    Taro.navigateBack();
                  });
                }}
              />
            </View>
          ))}
        </AtList>
      </ScrollView>

      <View className="address_list_action">
        <CButton
          theme="gardient"
          onClick={() => {
            lib.jump("/pages/user/address/new");
          }}
        >
          添加新地址
        </CButton>
      </View>
    </View>
  );
};

Address.config = {
  navigationBarTitleText: "选择地址",
};

export default connect(() => ({}))(Address as any);
