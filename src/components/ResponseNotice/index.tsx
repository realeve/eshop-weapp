import Taro, { useState } from "@tarojs/taro";

import { View, Text, RichText } from "@tarojs/components";
import { AtCheckbox } from "taro-ui";
import { commonResponseHtml } from "@/utils/cbpm_doc";
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
      <RichText nodes={html} />
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

export default ({
  onChange,
  needAgree,
  html
}: {
  onChange: (e: boolean) => void;
  needAgree: boolean;
  html?: string;
}) => {
  const [showPanel, setShowPanel] = useState<boolean>(false);
  const [isAgree, setIsAgree] = useState<string | null>(null);
  return (
    <View className="response__title">
      {needAgree ? (
        <AtCheckbox
          options={[
            {
              value: "agree",
              label: "《免责声明》"
            }
          ]}
          selectedList={[isAgree]}
          onChange={([, e]) => {
            let status = e === "agree";
            setShowPanel(status);
            if (!status) {
              setIsAgree(e);
            }
          }}
        />
      ) : (
        <Text
          style={{
            cursor: "pointer",
            textDecoration: "underline",
            paddingLeft: 10
          }}
          onClick={() => {
            setShowPanel(!showPanel);
          }}
        >
          《免责声明》
        </Text>
      )}

      <ResPage
        showPanel={showPanel}
        needAgree={needAgree}
        html={html || commonResponseHtml}
        setShowPanel={() => {
          onChange && onChange(true);
          setIsAgree("agree");
          setShowPanel(false);
        }}
        onCancel={() => {
          onChange && onChange(false);
          setShowPanel(false);
        }}
      />
    </View>
  );
};
