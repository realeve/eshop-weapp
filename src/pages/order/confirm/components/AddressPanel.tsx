import Taro from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import "./AddressPanel.scss";
import EmptyAddress from "@/pages/user/address/empty/";
import { IModPanelItem } from "@/pages/user/address";
import AddressItem from "@/pages/user/address/AddressItem";

export default ({
  data,
  special = false
}: {
  data: IModPanelItem;
  special: boolean;
}) => {
  if (!data) {
    return <EmptyAddress />;
  }

  return (
    <View className="address_panel">
      <AddressItem style={{ height: "110px" }} type="view" data={data} />
      {special && (
        <Text className="tips">
          提示:预约商品要求收件人姓名与实名认证保持一致
        </Text>
      )}
    </View>
  );
};
