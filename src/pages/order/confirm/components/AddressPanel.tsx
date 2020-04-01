import Taro from "@tarojs/taro";
import { View } from "@tarojs/components";
import "./AddressPanel.scss";
import EmptyAddress from "@/pages/user/address/empty/";
import { IModPanelItem } from "@/pages/user/address";
import AddressItem from "@/pages/user/address/AddressItem";

export default ({ data }: { data: IModPanelItem }) => {
  if (!data) {
    return <EmptyAddress />;
  }

  return (
    <View className="address_panel">
      <AddressItem type="view" data={data} />
    </View>
  );
};
