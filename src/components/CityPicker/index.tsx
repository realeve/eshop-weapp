import Taro, { useState } from "@tarojs/taro";
import { View, Text, Picker } from "@tarojs/components";
import useFetch from "../hooks/useFetch";
import "./index.scss";
import { cityUrl } from "@/utils/setting";
import * as R from "ramda";

const getInitArea = data => {
  let _city = data[0].sub.map(item => item.areaName),
    _prov = data.map(item => item.areaName),
    _area = data[0].sub[0].sub.map(item => item.areaName);
  return [_prov, _city, _area];
};

const PagePicker = ({ onLoad, ...props }) => {
  const [state, setState] = useState([[], [], []]);

  const { data, loading } = useFetch({
    param: { url: cityUrl },
    callback: e => {
      let dist = e.datas.areaList;
      let selector = getInitArea(dist);
      setState(selector);

      onLoad && onLoad(selector);

      return dist;
    }
  });

  let [idxProv, setIdxProv] = useState(0);

  const onChange = e => {
    let division = props.Division || " ";

    let [prov = 0, city = 0, area = 0] = e.detail.value;

    let curAddress =
      data[prov].areaName +
      division +
      data[prov].sub[city].areaName +
      division +
      data[prov].sub[city].sub[area].areaName;

    props.onChange && props.onChange(curAddress);
  };

  const onColumnChange = e => {
    let indexVal = e && e.detail;
    if (!indexVal) {
      return;
    }

    let prevState = R.clone(state);

    let _city = [];
    let _area = [];

    let idx = indexVal.value;
    if (indexVal.column == 0) {
      let provData = data[idx];
      setIdxProv(idx);
      _city = provData.sub.map(item => item.areaName);
      _area = provData.sub[0].sub.map(item => item.areaName);

      setState([prevState[0], _city, _area]);
    } else if (indexVal.column == 1) {
      let provData = data[idxProv];
      _city = provData.sub.map(item => item.areaName);

      _area = provData.sub[idx].sub.map(item => item.areaName);

      setState([prevState[0], prevState[1], _area]);
    }
  };

  return (
    <View className="city_picker">
      <Picker
        mode="multiSelector"
        range={state}
        onColumnChange={onColumnChange}
        onChange={onChange}
      >
        <View className="wrap">
          <View className="title">{props.title || "地址"}</View>
          <Text>{props.value}</Text>
        </View>
      </Picker>
    </View>
  );
};
export default PagePicker;
