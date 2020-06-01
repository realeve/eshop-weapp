import Taro, { useRouter } from "@tarojs/taro";
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
  editAddress
} from "./lib";
import { updateSubscribeAddress } from "@/pages/special/db";
import { connect } from "@tarojs/redux";

const Address = ({ dispatch, addressListHash }) => {
  const { data, refetch } = useFetch<IModPanelItem[]>({
    param: {
      method: "post",
      url: API.MEMBER_ADDRESS_LIST as string
    },
    callback
  });

  console.log(addressListHash, "addressListHash");
  useFetch(() => {
    refetch();
  }, [addressListHash]);

  const { params } = useRouter();

  const onClick = item => {
    if (params.orderid) {
      let param = { orderId: params.orderid, addressId: item.address_id };
      updateSubscribeAddress(param).then(res => {
        Taro.navigateBack();
      });
      return;
    }
    editAddress({
      ...item,
      isDefault: true
    }).then(() => {
      // 返回确认页
      dispatch({
        type: "order/setStore",
        currentAddress: {
          ...item,
          isDefault: true
        }
      });
      Taro.navigateBack();
    });
  };

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
                callback={() => onClick(item)}
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
          添加新地址{addressListHash}
        </CButton>
      </View>
    </View>
  );
};

Address.config = {
  navigationBarTitleText: "选择地址"
};

export default connect(({ order }) => order)(Address as any);
