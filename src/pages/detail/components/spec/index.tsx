import Taro, { useState } from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import "./index.scss";
import DCard from "../card";
import { AtFloatLayout } from "taro-ui";
import { CPrice } from "@/components";
import { IProductInfo, ISpecValueItem } from "../../lib";
import * as R from "ramda";
import classnames from "classnames";

// 根据规格获取商品信息
export const getGoodsInfoBySpec = (res, data) => {
  let specValueIds = res.map(item => item.specValueId).join(",");
  return data.goodsList.find(item => item.specValueIds === specValueIds);
};

const DetailCard = ({
  data,
  onChange
}: {
  data: IProductInfo;
  onChange: (e: ISpecValueItem[]) => void;
}) => {
  const [showPanel, setShowPanel] = useState<boolean>(false);
  const [spec, setSpec] = useState([]);

  return (
    <DCard className="detail_page_spec">
      <View className="item">
        <Text className="title">选择</Text>
        <View className="detail">
          <View
            className="spec"
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
          {data.goodsSaleTime && (
            <View className="selltime">
              <View className="at-icon at-icon-clock"></View>
              该商品售卖时间为{data.goodsSaleTime.text}
            </View>
          )}
        </View>
      </View>

      {/* 规格选择面板 */}
      <AtFloatLayout
        isOpened={showPanel}
        onClose={() => setShowPanel(false)}
        scrollY
      >
        <View className="specPanel">
          {/* 商品基本信息 */}
          <View className="title">
            <Image className="img" src={data.img} />
            <View className="detail">
              <CPrice retail={data.price} retailStyle="font-size:20px;" />
              <Text className="storage">库存 {data.number}件</Text>
              <Text className="goodsname">{data.title}</Text>
            </View>
          </View>

          {/* 关闭按钮 */}
          <View className="close" onClick={() => setShowPanel(false)}>
            <View className="at-icon at-icon-close-circle"></View>
          </View>

          {/* 规格列表 */}
          {(data.specs || []).map((item, idx) => (
            <View className="specs" key={item.specId}>
              <View className="specs__title">{item.specName}</View>
              <View className="list">
                {item.specValueList.map(specItem => (
                  <Text
                    className={classnames("item", {
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
                        onChange(prev);
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
          <View className="specs">
            <View className="specs__title">数量</View>
          </View>
        </View>
      </AtFloatLayout>
    </DCard>
  );
};

export default DetailCard;
