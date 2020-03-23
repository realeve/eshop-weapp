import Taro, { useState, useEffect } from "@tarojs/taro";
import { View, Text, ScrollView } from "@tarojs/components";
import "./index.scss";
import EmptyAddress from "./empty";
import useFetch from "@/components/hooks/useFetch";
import { API } from "@/utils/setting";
import * as R from "ramda";
import { AtList, AtSwipeAction, AtModal } from "taro-ui";
import { CButton } from "@/components";

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

interface IAddressPage {
  editData: IModPanelItem;
  data: IModPanelItem[];
  option: string;
  visible: boolean;
  defaultSite: string;
}

interface IPropsInitState extends IModPanelItem {
  defaultSite: string | boolean;
  option: string;
}

// const { data: areas } = useFetch({
//     param: {
//       url: "/area/list",
//       params: {
//         areaId: 0
//       }
//     }
//   });

const Address = () => {
  const { data, reFetch: onRefresh, setData } = useFetch<IModPanelItem[]>({
    param: {
      method: "post",
      url: API.MEMBER_ADDRESS_LIST as string
    },
    callback: (res: { addressList: IADDRESS[] }) => {
      let resdata: IModPanelItem[] = R.map((item: IADDRESS) => {
        return {
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
          isOpened: false
        };
      })(res.addressList);
      return resdata;
    }
  });

  const [show, setShow] = useState(false);
  const [curIdx, setCurIdx] = useState(0);
  // console.log(data);

  const handleSingle = idx => {
    let res = R.clone(data);
    res = res.map((item, index) => {
      item.isOpened = idx === index;
      return item;
    });
    setData(res);
    setCurIdx(idx);
  };

  const closeItem = idx => {
    let res = R.clone(data);
    res[idx].isOpened = false;
    setData(res);
  };

  return (
    <View className="address_list">
      {data && data.length === 0 && <EmptyAddress />}
      <ScrollView scrollY className="address_list_wrap">
        <AtList>
          {(data || []).map((item, index) => (
            <AtSwipeAction
              key={item.address_id}
              onOpened={() => handleSingle(index)}
              isOpened={item.isOpened}
              options={[
                {
                  text: "取消",
                  style: {
                    backgroundColor: "#6190E8"
                  }
                },
                {
                  text: "删除",
                  style: {
                    backgroundColor: "#FF4949"
                  }
                }
              ]}
              onClick={e => {
                switch (e.text) {
                  case "删除":
                    // console.log("delete it");
                    setShow(true);
                    break;
                  default:
                    closeItem(index);
                    break;
                }
              }}
            >
              <View className="at-list__item">
                <View className="at-list__item-container">
                  <View className="at-list__item-content item-content">
                    <View className="item-content__info">
                      <View className="item-content__info-title">
                        <View className="header">
                          <Text>{item.name}</Text>
                          <Text style={{ margin: "0 10px 0 20px" }}>
                            {item.phone}
                          </Text>
                          {item.isDefault === 1 && (
                            <Text className="gardient">默认</Text>
                          )}
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
                    <View className="at-icon at-icon-edit" />
                  </View>
                </View>
              </View>
            </AtSwipeAction>
          ))}
        </AtList>
      </ScrollView>

      <AtModal
        isOpened={show}
        title="提示"
        cancelText="取消"
        confirmText="确认"
        onClose={() => {
          setShow(false);
        }}
        onCancel={() => {
          setShow(false);
        }}
        onConfirm={() => {
          console.log("执行删除操作");
          // 然后刷新列表
          onRefresh();
          setShow(false);
        }}
        content="确认删除此收货地址吗?"
      />
      <View className="address_list_action">
        <CButton theme="gardient">添加新地址</CButton>
      </View>
    </View>
  );
};

Address.config = {
  navigationBarTitleText: "我的地址"
};

export default Address;
