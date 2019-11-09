import Taro from "@tarojs/taro";
import { View, RichText } from "@tarojs/components";
import { AtFloatLayout } from "taro-ui";
import "./index.scss";
import { CButton } from "@/components/";

//  process.env.TARO_ENV === 'weapp'
const isWEB = Taro.getEnv() === Taro.ENV_TYPE.WEB;

const ResPage = ({
  showPanel,
  needAgree,
  setShowPanel,
  onCancel,
  html
}: {
  showPanel: boolean;
  needAgree: boolean;
  setShowPanel: (e: boolean) => void;
  onCancel: (e: boolean) => void;
  html?: string;
}) => (
  <AtFloatLayout
    isOpened={showPanel}
    title="免责声明"
    onClose={() => onCancel(false)}
    scrollY
    // scrollWithAnimation
    className="responseNotice"
  >
    {isWEB ? (
      <View dangerouslySetInnerHTML={{ __html: html }} />
    ) : (
      <RichText nodes={html || ""} />
    )}
    <View className="actions">
      <CButton
        theme="gardient"
        className="btn"
        onClick={() => {
          setShowPanel(needAgree);
        }}
      >
        {needAgree ? "同意" : "关闭"}
      </CButton>
      {needAgree && (
        <CButton className="btn" onClick={() => onCancel(false)}>
          不同意
        </CButton>
      )}
    </View>
  </AtFloatLayout>
);

export default ResPage;
