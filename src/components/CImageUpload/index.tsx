import "./index.scss";
import Taro, { useState } from "@tarojs/taro";
import { UPLOAD_URL } from "@/utils/setting";
import { getToken } from "@/utils/axios";
import { View, Image } from "@tarojs/components";
import fail from "@/components/Toast/fail";
import success from "@/components/Toast/success";
import { AtIcon } from "taro-ui";

export default ({ onUpload, count = 3 }) => {
  const [files, setFiles] = useState<{ name: string; url: string }[]>([]);
  const [token] = useState<string>(getToken());
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
            header: {
              Authorization: token
            },
            formData: {
              filename: "file"
            },
            success: res => {
              let {
                datas: data
              }: { datas: { name: string; url: string } } = JSON.parse(
                res.data
              );
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
            },
            fail() {
              fail("上传图片失败");
            }
          });
        });
      },
      fail(res) {
        if (res.errMsg === "chooseImage:fail cancel") {
          success("未选择");
        }
      }
    });
  };
  return (
    <View className="upload">
      {files.length === 0 && (
        <View className="item" onClick={upload}>
          <AtIcon value="add" size="30" color="#aaa" />
        </View>
      )}
      {files.map(res => (
        <Image src={res.url} className="img" key={res.url} />
      ))}
    </View>
  );
};
