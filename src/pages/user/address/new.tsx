import Taro, { useState, useEffect } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import "./new.scss";
import { API } from "@/utils/setting";
import * as R from "ramda";
import { CButton } from "@/components";

const AddAddress = () => {
  return (
    <View className="address_list">
      <View>asdf</View>
      <View className="address_list_action">
        <CButton theme="gardient">添加新地址</CButton>
      </View>
    </View>
  );
};

AddAddress.config = {
  navigationBarTitleText: "新增地址"
};

export default AddAddress;
