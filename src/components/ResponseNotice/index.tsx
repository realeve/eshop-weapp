import Taro, { useState } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import { AtCheckbox } from "taro-ui";
import { commonResponseHtml } from "@/utils/cbpm_doc";
import "./index.scss";
import ResPage from "./ResPage";

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
