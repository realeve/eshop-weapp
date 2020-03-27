import Taro, { useState, useEffect } from "@tarojs/taro";
import { View, Text, Picker } from "@tarojs/components";
import dataCity from "./dataCity";
import useSetState from "@/components/hooks/useSetState";
import "./index.scss";

const PagePicker = props => {
  let [idxProv, setIdxProv] = useState("340000");
  let [idxCity, setIdxCity] = useState("340100");

  const [state, setState] = useSetState({
    selector: [[], [], []],
    selectorChecked: props.value
  });

  useEffect(() => {
    let _city = Object.values(dataCity[340000]),
      _prov = dataCity[86].map(item => item.address),
      _area = Object.values(dataCity[340100]);

    setState({
      selector: [_prov, _city, _area]
    });
  }, []);

  const onChange = e => {
    let division = props.Division || " ";
    setState(
      {
        selectorChecked:
          state.selector[0][e.detail.value[0]] +
          division +
          state.selector[1][e.detail.value[1]] +
          division +
          state.selector[2][e.detail.value[2]]
      },
      () => {
        props.onChange && props.onChange(state.selectorChecked);
      }
    );
  };

  const onColumnChange = e => {
    let indexVal = e && e.detail;
    if (!indexVal) {
      return;
    }
    // console.log(indexVal);

    // 如果为第一个把后面两个改变,最后一个选第二个的第一个，第一个继承之前的
    // 如果为第二个则把最后一个改变，第一个第二继承之前的
    // 如果为第三个则不作任何改变

    let _city = [];
    let _area = [];

    if (indexVal.column == 0) {
      let code = dataCity[86][indexVal.value].code;

      setIdxProv(code);
      // console.log(code);

      let one = 0;
      let codes = "";

      Object.keys(dataCity[code]).forEach((item: string) => {
        if (one == 0) {
          codes = item;
          setIdxCity(item);
          one++;
        }
        _city.push(dataCity[code][item]);
      });

      Object.keys(dataCity[codes]).forEach((item: string) => {
        _area.push(dataCity[codes][item]);
      });

      setState(old => {
        return {
          selector: [old.selector[0], _city, _area]
        };
      });
    } else if (indexVal.column == 1) {
      Object.keys(dataCity[idxProv]).forEach(item => {
        _city.push(item);
        setIdxCity(_city[indexVal.value]);
      });
      Object.keys(dataCity[idxCity]).forEach(item => {
        _area.push(dataCity[idxCity][item]);
      });

      setState(old => {
        return {
          selector: [old.selector[0], old.selector[1], _area]
        };
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
