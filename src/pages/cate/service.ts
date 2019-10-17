import { axios } from "@/utils/axios";

export const demo = data => {
  return axios({
    url: "路径",
    method: "POST",
    data
  });
};
