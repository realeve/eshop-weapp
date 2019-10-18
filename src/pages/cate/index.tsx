import Taro, { useState, useEffect } from "@tarojs/taro";
import { View, ScrollView } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import { ICateModel } from "./model";
import { getWindowHeight } from "@/utils/style";

import Search from "@/pages/index/components/search/";

import "./index.scss";

import Menu from "./menu";
import List from "./list";

interface IMenuItem {
  id: number;
  name: string;
  url?: string;
}

interface IMenuList extends IMenuItem {
  cates: {
    id: number;
    name: string;
    data: IMenuItem[];
  }[];
  [key: string]: any;
}

interface IProps extends ICateModel {
  menuList: IMenuList;
  [key: string]: any;
}

const Index = ({ menuList }: IProps) => {
  const height = getWindowHeight();
  const [state, setState] = useState({
    current: 0,
    list: (menuList[0] && menuList[0].cates) || []
  });

  const handleMenu = (current: number) => {
    let list = menuList.find(item => item.id == current) || { cates: [] };
    setState(prevState => ({
      ...prevState,
      current,
      list: list.cates
    }));
  };

  useEffect(() => {
    if (menuList.length === 0) {
      return;
    }
    setState(prevState => ({
      ...prevState,
      current: menuList[0].id,
      list: menuList[0].cates
    }));
  }, [menuList]);

  return (
    <View className="cate-page">
      <Search />
      <View className="cate-wrapper" style={{ height }}>
        <ScrollView scrollY className="cate__menu">
          <Menu current={state.current} list={menuList} onClick={handleMenu} />
        </ScrollView>
        <ScrollView scrollY className="cate__list">
          <View className="cate__list-wrap">
            <List list={state.list} />
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

Index.config = {
  navigationBarTitleText: "类目页"
};

export default connect(
  ({ common: { menuList } }: { common: { menuList: ICateModel } }) => ({
    menuList
  })
)(Index as any);
