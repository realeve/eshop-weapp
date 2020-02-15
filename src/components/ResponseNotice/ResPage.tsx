import Taro from "@tarojs/taro";
import { View, RichText } from "@tarojs/components";
import { AtFloatLayout } from "taro-ui";
import CButton from "@/components/CButton";
import "./resPage.scss";

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
      <RichText space="ensp" nodes={html || ""} style="line-height:2em;" />
    )}
    <View className="response__actions">
      <CButton
        theme="gardient"
        size="small"
        onClick={() => {
          setShowPanel(needAgree);
        }}
        style="width:100px;"
      >
        {needAgree ? "同意" : "关闭"}
      </CButton>
      {needAgree && (
        <CButton
          style="width:100px;"
          size="small"
          onClick={() => onCancel(false)}
        >
          不同意
        </CButton>
      )}
    </View>
  </AtFloatLayout>
);

export default ResPage;
