import Taro from "@tarojs/taro";
import { View } from "@tarojs/components";
import { AtTextarea, AtIcon } from "taro-ui";
import { IMWS } from "@/utils/setting";
import { getToken } from "@/utils/axios";
import { getMemberInfo } from "@/utils/lib";
import "./index.scss";

export default class ImTool extends Taro.Component {
  constructor(props) {
    super(props);
    this.state = {
      input: "",
      datas: [],
      lines: 1,
      sid: 0,
      socketOpen: false,
      msgQueue: []
    };
    this.handleConnected = this.handleConnected.bind(this);
    this.handleRecieve = this.handleRecieve.bind(this);
    this.handleSend = this.handleSend.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleError = this.handleError.bind(this);
    this.doSend = this.doSend.bind(this);
  }

  config = {
    navigationBarTitleText: "客户服务"
  };

  formatData(data) {
    if (!data) {
      return undefined;
    }
    let d = {};
    if (data.mType === "send") {
      let { message_content, mid, sid: to_user_id } = data;
      let member = getMemberInfo() || {};
      data = {
        message_content,
        mid,
        to_user_id,
        from_user_id: member.uid,
        from_user_type: 1,
        to_user_type: 2,
        message_type: 1,
        message_id: 0
      };
    }
  }

  handleChange(value) {
    this.setState({ input: value });
  }

  doSend(msgObj) {
    if (!msgObj) {
      console.info("message must not be empty");
      return;
    }
    let _msg = { ...msgObj, send: 0 };
    if (!msgObj.mid || this.state.socketOpen) {
      console.info("socket is opened.");
      Taro.sendSocketMessage({
        data: JSON.stringify(_msg)
      });
    } else {
      let queue = this.state.msgQueue;
      let inQueue = queue.filter(item => item.mid === msgObj.mid);
      if (inQueue && inQueue.length > 0) {
        console.info(`${msgObj.mid} already in queue`);
        return;
      }
      queue.push(msgObj);
      this.setState({ msgQueue: queue });
    }
  }

  handleSend() {
    console.info("handle send");
    if (!this.state.input || !this.state.input.trim()) {
      return;
    }
    let value = {
      cType: "wap",
      mType: "send",
      message_content: this.state.input.trim(),
      mid: new Date().getTime(),
      sid: this.state.sid,
      token: getToken()
    };
    let data = { ...value, send: 0 };
    let datas = this.state.datas;
    datas.push(data);
    this.setState({ datas });
    this.doSend(data);
    this.setState({ input: "" });
  }

  handleRecieve(value) {
    console.info("onMessage: ", value);
    if (!value) {
      return;
    }
    let { data } = value;
    if (!data) {
      return;
    }
    data = JSON.parse(data);
    if ((data || {}).code !== "200") {
      console.warn("return code is not 200", data);
      return;
    }
    let msgs = this.state.datas;
    let idx = msgs.findIndex(item => item.mid === data.datas.mid);
    if (idx < 0) {
      msgs.push({ ...data.datas, send: 1 });
    } else {
      msgs[idx] = { ...data.datas, send: 1 };
    }
    this.setState({ datas: msgs });
    console.log("recieve ", msgs);
  }

  handleConnected() {
    console.info("socket opened");
    if (!this.state.socketOpen) {
      Taro.sendSocketMessage({
        data: JSON.stringify({
          cType: "wap",
          mType: "sub",
          sid: this.state.sid,
          token: getToken()
        })
      });
    }
    this.setState({ socketOpen: true });
    let queue = this.state.msgQueue;
    for (let i = 0; i < queue.length; i++) {
      this.doSend(queue[i]);
    }
    this.setState({ msgQueue: [] });
  }

  handleError(e) {
    console.error("error", e);
  }

  handleClose() {
    console.info("closed");
    this.setState({ socketOpen: false });
  }

  init() {
    let token = getToken();
    if (!token) {
      console.warn("u need login at first.");
      return;
    }
    Taro.connectSocket({
      url: IMWS,
      success: function() {
        console.info("connect success");
      }
    });
    Taro.onSocketOpen(this.handleConnected);
    Taro.onSocketMessage(this.handleRecieve);
    Taro.onError(this.handleError);
    Taro.onSocketClose(this.handleClose);
  }

  componentDidMount() {
    let sid = this.$router.params.sid;
    if (!sid) {
      Taro.showToast({ title: "未指定客服", duration: 3000, icon: "none" });
      return;
    }
    console.info("sid is ", sid);
    this.setState({ sid });
    this.init();
  }

  componentWillUnmount() {
    if (!this.state.socketOpen) {
      return;
    }
    console.info("component will unmount");
    // Taro.closeSocket();
  }
  render() {
    return (
      <View className="im">
        <View className="datas">
          {this.state.datas && this.state.datas.map(msg => <View />)}
        </View>
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
              // console.info("lineChange event", event);
              this.setState({ lines: event.detail.lineCount });
              // console.info("state", this.state);
            }}
          />
          <AtIcon
            value="add-circle"
            size="32"
            className="add"
            onClick={() => this.handleSend()}
          />
        </View>
      </View>
    );
  }
}
