import Taro, { useState } from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import "./index.scss";
// import DCard from "../card";
import { AtInputNumber } from "taro-ui";

import { CPrice, CModal } from "@/components";
import { IProductInfo, ISpecValueItem } from "../../lib";
import * as R from "ramda";
import classnames from "classnames";
import iconYou from "./you.png";
import iconBao from "./bao.png";
import iconZheng from "./zheng.png";
import { getGoodsInfoBySpec } from "./lib";

const iconList = {
  you: iconYou,
  bao: iconBao,
  zheng: iconZheng
};

const DetailCard = ({
  data = {},
  onSpecChange,
  goodsnum,
  onGoodsnumChange
}: {
  goodsnum: number;
  data: IProductInfo;
  onSpecChange: (e: ISpecValueItem[]) => void;
  onGoodsnumChange: (e: number) => void;
}) => {
  const [showPanel, setShowPanel] = useState<boolean>(false);
  const [spec, setSpec] = useState([]);

  const [showService, setShowService] = useState<boolean>(false);

  return (
    <view className="detail_page_spec">
      {/* 选择规格 */}
      <View className="detail_page_spec_item">
        <Text className="detail_page_spec_item_title">选择</Text>
        <View
          className="detail_page_spec_item_spec"
          onClick={() => {
            setShowPanel(true);
          }}
        >
          <View>
            {data.goodsFullSpecs ||
              (spec.length > 0
                ? spec.map(item => item.title).join(" ")
                : "请选择规格/包装")}
          </View>
          <View className="at-icon at-icon-chevron-right" />
        </View>
      </View>

      {/* 服务列表 */}
      <View className="detail_page_spec_item">
        <Text className="detail_page_spec_item_title">服务</Text>
        <View className="serviceList" onClick={() => setShowService(true)}>
          <View className="services">
            {data.services &&
              data.services.map(service => (
                <View key={service.title} className="servicesItem">
                  • {service.title}
                </View>
              ))}
          </View>
          <View className="at-icon at-icon-chevron-right" />
        </View>
      </View>

      {data.goodsSaleTime && (
        <View className="detail_page_spec_selltime">
          <View className="at-icon at-icon-clock"></View>
          该商品售卖时间为{data.goodsSaleTime.text}
        </View>
      )}

      {/* 服务列表面板 */}

      <CModal
        show={showService}
        className="specServices"
        onClose={() => setShowService(false)}
      >
        <View className="specServices_title">服务说明</View>
        {data.services &&
          data.services.map(service => (
            <View key={service.title} className="specServices_item">
              <Image className="icon" src={iconList[service.icon]} />
              <View className="specServices_item_service">
                <View className="specServices_item_serviceTitle">
                  {service.title}
                </View>
                <View className="specServices_item_serviceSubtitle">
                  {service.subTitle}
                </View>
              </View>
            </View>
          ))}
      </CModal>

      {/* 规格选择面板 */}
      <CModal
        show={showPanel}
        className="specPanel"
        onClose={() => setShowPanel(false)}
      >
        {/* 商品基本信息 */}
        <View className="specPanel_title">
          <Image className="img" src={data.img} />
          <View className="detail">
            <CPrice retail={data.price} retailStyle="font-size:20px;" />
            <Text className="storage">库存 {data.number}件</Text>
            <Text className="goodsname">{data.title}</Text>
          </View>
        </View>
        {/* 规格列表 */}
        {(data.specs || []).map((item, idx) => (
          <View className="specPanel_specs" key={item.specId}>
            <View className="specPanel_specs_title">{item.specName}</View>
            <View className="specPanel_specs_list">
              {item.specValueList.map(specItem => (
                <Text
                  className={classnames("specPanel_specs_list_item", {
                    itemActive:
                      spec[idx] &&
                      spec[idx].specValueId &&
                      spec[idx].specValueId === specItem.specValueId
                  })}
                  key={spec.specValueId}
                  onClick={() => {
                    // 选中对应规格
                    let prev = R.clone(spec);
                    prev[idx] = {
                      ...specItem,
                      title: `${item.specName}:${specItem.specValueName}`
                    };
                    setSpec(prev);

                    // 获取goodsId
                    if (prev.length === data.specs.length) {
                      onSpecChange(prev);
                      console.log(prev);
                    }
                  }}
                >
                  {specItem.specValueName}
                </Text>
              ))}
            </View>
          </View>
        ))}
        {/* 数量选择 */}
        <View className="specPanel_specs">
          <View className="specPanel_specs_title">数量</View>
          <View>
            <AtInputNumber
              type="number"
              value={goodsnum}
              onChange={onGoodsnumChange}
              min={1}
              max={data.number}
              step={1}
            />
          </View>
        </View>
      </CModal>
    </view>
  );
};

export default DetailCard;
