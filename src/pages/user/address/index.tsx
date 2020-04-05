import Taro, { useState } from "@tarojs/taro";
import { View, ScrollView } from "@tarojs/components";
import "./index.scss";
import EmptyAddress from "./empty";
import useFetch from "@/components/hooks/useFetch";
import { API } from "@/utils/setting";
import * as R from "ramda";
import { AtList, AtSwipeAction, AtModal } from "taro-ui";
import { CButton } from "@/components";
import * as lib from "@/utils/lib";
import AddressItem from "./AddressItem";
import { handleAddressList, IModPanelItem } from "./lib";

const Address = () => {
  const { data, reFetch: onRefresh, setData } = useFetch<IModPanelItem[]>({
    param: {
      method: "post",
      url: API.MEMBER_ADDRESS_LIST as string,
    },
    callback: handleAddressList,
  });

  const [show, setShow] = useState(false);
  const [curIdx, setCurIdx] = useState(0);
  // console.log(data);

  const handleSingle = (idx) => {
    let res = R.clone(data);
    res = res.map((item, index) => {
      item.isOpened = idx === index;
      return item;
    });
    setData(res);
    setCurIdx(idx);
  };

  const closeItem = (idx) => {
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
                    backgroundColor: "#6190E8",
                  },
                },
                {
                  text: "删除",
                  style: {
                    backgroundColor: "#FF4949",
                  },
                },
              ]}
              onClick={(e) => {
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
                <AddressItem type="edit" data={item} />
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
  navigationBarTitleText: "我的地址",
};

export default Address;
