import Taro, { useEffect } from "@tarojs/taro";
import { View, ScrollView, Text } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import { IMenuItem as ICateModel } from "../../models/common";

import { getWindowHeight } from "@/utils/style";
import useSetState from "@/components/hooks/useSetState";

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

interface IProps {
  menuList: IMenuList;
  [key: string]: any;
}

const Index = ({ menuList, curCateId = 0 }: IProps) => {
  const height = getWindowHeight();

  const [state, setState] = useSetState({
    current: curCateId,
    list: (menuList[0] && menuList[0].cates) || []
  });

  useEffect(() => {
    handleMenu(curCateId);
  }, [curCateId]);

  const handleMenu = (current: number) => {
    let list = menuList.find(item => item.id == current) || { cates: [] };
    setState({
      current,
      list: list.cates
    });
  };

  useEffect(() => {
    if (menuList.length === 0 || state.current !== 0) {
      return;
    }
    setState({
      current: menuList[0].id,
      list: menuList[0].cates
    });
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
  ({
    common: { menuList, curCateId }
  }: {
    common: { menuList: ICateModel; curCateId: number };
  }) => ({
    menuList,
    curCateId
  })
)(Index as any);
