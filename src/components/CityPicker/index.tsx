import Taro, { useState, useEffect } from "@tarojs/taro";
import { View, Text, Picker } from "@tarojs/components";
import useSetState from "@/components/hooks/useSetState";
import useFetch from "../hooks/useFetch";
import "./index.scss";
import { cityUrl } from "@/utils/setting";
import * as R from "ramda";

const PagePicker = props => {
  const { data, loading } = useFetch({
    param: { url: cityUrl },
    callback: e => e.datas.areaList
  });

  let [idxProv, setIdxProv] = useState(0);

  const [state, setState] = useSetState({
    selector: [[], [], []],
    selectorChecked: props.value
  });

  useEffect(() => {
    setState({ selectorChecked: props.value });
  }, [props.value]);

  useEffect(() => {
    if (!data) {
      return;
    }
    let _city = data[0].sub.map(item => item.areaName),
      _prov = data.map(item => item.areaName),
      _area = data[0].sub[0].sub.map(item => item.areaName);

    setState({
      selector: [_prov, _city, _area]
    });
  }, [data]);

  const onChange = e => {
    let division = props.Division || " ";

    let [prov, city, area = 0] = e.detail.value;

    let curAddress =
      data[prov].areaName +
      division +
      data[prov].sub[city].areaName +
      division +
      data[prov].sub[city].sub[area].areaName;

    setState({
      selectorChecked: curAddress
    });
    props.onChange && props.onChange(curAddress);
  };

  const onColumnChange = e => {
    let indexVal = e && e.detail;
    if (!indexVal) {
      return;
    }
    let prevState = R.clone(state.selector);

    let _city = [];
    let _area = [];

    let idx = indexVal.value;
    if (indexVal.column == 0) {
      let provData = data[idx];
      setIdxProv(idx);
      _city = provData.sub.map(item => item.areaName);
      _area = provData.sub[0].sub.map(item => item.areaName);

      setState({
        selector: [prevState[0], _city, _area]
      });
    } else if (indexVal.column == 1) {
      let provData = data[idxProv];
      _city = provData.sub.map(item => item.areaName);

      _area = provData.sub[idx].sub.map(item => item.areaName);

      setState({
        selector: [prevState[0], prevState[1], _area]
      });
    }
  };

  return (
    <View className="city_picker">
      <Picker
        mode="multiSelector"
        range={state.selector}
        onColumnChange={onColumnChange}
        onChange={onChange}
      >
        <View className="wrap">
          <View className="title">{props.title || "地址"}</View>
          <Text>{state.selectorChecked}</Text>
        </View>
      </Picker>
    </View>
  );
};
export default PagePicker;
