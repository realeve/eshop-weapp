import { axios } from "@/utils/axios";
import { IM } from "@/utils/api";
import { getToken } from "@/utils/axios";

/**
 * 获取与某个联系人的聊天记录
 * @param sid seller id
 * @param page
 */
export const getHisMsg = (sid, page = 1) =>
  axios({
    ...IM.history,
    // headers: { "content-type": "application/json", Host: "imtest.ccgold.cn" },
    data: { token: getToken(), sid, page, ctype: "wap" }
  });

/**
 * 获取联系人相关信息
 * @param lid 联系人id
 */
export const getLinkInfo = lid => axios({ ...IM.getLinkInfo, data: { lid } });

/**
 * 获取联系人列表
 */
export const getLinkList = () => axios({ ...IM.getLinkList });

/**
 * 获取未读消息数量
 */
export const getUnread = () =>
  axios({ ...IM.getUnread, data: { ctype: "wap" } });

/**
 * 添加联系人
 * @param sid seller id
 * @param gid 商品id
 */
export const addLinkMan = (sid, gid) =>
  axios({ ...IM.addLinkMan, data: { sid, gid } });
