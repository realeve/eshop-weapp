import "./index.scss";
import Taro, { useState } from "@tarojs/taro";
import * as R from "ramda";

import { UPLOAD_URL } from "@/utils/setting";
import { axios } from "@/utils/axios";
import useSetState from "@/components/hooks/useSetState";
import { View } from "@tarojs/components";
import fail from "@/components/Toast/fail";
import success from "@/components/Toast/success";

export default ({ onUpload, count = 3 }) => {
  const [files, setFiles] = useState<{ name: string; url: string }[]>([]);

  const upload = () => {
    Taro.chooseImage({
      sourceType: ["album"],
      sizeType: ["compressed"],
      count,
      success: res => {
        if (res.errMsg !== "chooseImage:ok") {
          fail("图片选择失败");
          return;
        }
        console.log(res);
        let file = res.tempFilePaths;
        if (file.length === 0) {
          return;
        }

        Taro.showLoading({
          title: "上传中"
        });

        const tempFilePaths = res.tempFilePaths;

        let _files: { name: string; url: string }[] = [];

        tempFilePaths.forEach(filePath => {
          Taro.uploadFile({
            url: UPLOAD_URL, //仅为示例，非真实的接口地址
            filePath,
            name: "file",
            formData: {
              imgIndex: i
            },
            success(data: { name: string; url: string }) {
              _files.push({
                name: data.name || "",
                url: data.url
              });
              if (_files.length === file.length) {
                // 全部上传完毕
                success("上传完毕");
                onUpload(_files);
                setFiles(_files);
                Taro.hideLoading();
              }
            }
          });
        });
      }
    });
  };
  return (
    <View className="upload">
      {files.length === 0 && <View className="item" onClick={upload} />}
    </View>
  );
};
