import Taro, {
  useRouter,
  useEffect,
  useState,
  setNavigationBarTitle
} from "@tarojs/taro";
import { View, RichText } from "@tarojs/components";
import "./view.scss";
import { help as url } from "@/utils/setting";
import useFetch from "@/components/hooks/useFetch";
import Skeleton from "taro-skeleton";

const Index = () => {
  const route = useRouter();

  let { data, loading } = useFetch({
    param: { url },
    callback: res => res.data || res
  });
  let [html, setHtml] = useState<null | string>(null);
  useEffect(() => {
    if (!data) {
      return;
    }
    let key = `${route.path}?page=${route.params.page}`;
    let dist = data.find(item => item.url === key);
    if (!dist) {
      return;
    }

    // 標題
    setNavigationBarTitle({ title: "帮助与客服 - " + dist.title });

    setHtml(dist.html);
  }, [route, data]);

  return (
    <Skeleton loading={loading} animate rowHeight={375}>
      <View className="help_page">
        <View className="main">
          {html && <RichText space="ensp" nodes={html} />}
        </View>
      </View>
    </Skeleton>
  );
};

Index.config = {
  navigationBarTitleText: "帮助与客服"
};
export default Index;
