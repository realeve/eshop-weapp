import Taro, { useState, useEffect } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import { AtCheckbox } from "taro-ui";
// import { commonResponseHtml } from "@/utils/cbpm_doc";
import "./index.scss";
import ResPage from "./ResPage";
import { axios } from "taro-axios";
import { htmlFormat, HTML } from "./lib";

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
  const [protocal, setProtocal] = useState<string>(html || "");
  useEffect(() => {
    if (String(html).substring(0, 4) != "http") {
      return;
    }
    axios({
      responseType: "text",
      url: html
    })
      .then(e => {
        // console.log("...", e.data);
        setProtocal(htmlFormat(e.data));
      })
      .catch(e => {
        // console.log("eee", e);
        setProtocal(htmlFormat(HTML));
      });
  }, [html]);

  // console.log(protocal);

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
            // axios({
            //   responseType: "text",
            //   url:
            //     "https://static.ccgold.cn/rules/escapeClause_26.html?spm=1586220962556"
            // }).then(res => {
            //   console.log(res);
            // });
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
            // setShowPanel(!showPanel);
          }}
        >
          《免责声明》
        </Text>
      )}

      <ResPage
        showPanel={showPanel}
        needAgree={needAgree}
        // html={html || commonResponseHtml}
        html={protocal}
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
