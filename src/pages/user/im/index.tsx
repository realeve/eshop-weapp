import Taro from "@tarojs/taro";
import { View } from "@tarojs/components";
import { AtTextarea, AtIcon } from "taro-ui";
import "./index.scss";

export default class ImUtil extends Taro.Component {
  constructor() {
    super(...arguments);
    this.state = { input: "", datas: {}, lines: 1 };
  }

  config = {
    navigationBarTitleText: "客户服务"
  };

  handleChange(value) {
    this.setState({ input: value });
  }
  render() {
    return (
      <View className="im">
        <View className="datas"></View>
        <View className="input">
          <AtTextarea
            value={this.state.input}
            maxLength={1000}
            count={false}
            onChange={this.handleChange.bind(this)}
            height={Math.min(4, this.state.lines) * 32}
            placeholder=""
            autoHeight
            adjustPosition
            showConfirmBar
            fixed
            onLinechange={event => {
              // console.info("bindlinechange", detail.lineCount);
              console.info("lineChange event", event);
              this.setState({ lines: event.detail.lineCount });
              console.info("state", this.state);
            }}
          />
          <AtIcon value="add-circle" size="32" className="add" />
        </View>
      </View>
    );
  }
}
