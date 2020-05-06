// import React from "react";
import "./index.scss";
import * as lib from "@/utils/lib";
interface IPropsBanner {
  data: {
    href?: string;
    img: string;
  };
  size?: number;
  hover?: boolean;
  children?: React.ReactNode;
  [key: string]: any;
}
/**
 *
 * @param href:链接
 * @param img:图片
 *
 * @param hover 高亮
 */
const ImgCard = ({ data, children, style, size, hover = true }) => (
  <div>
    <div
      className="wrap"
      style={style}
      onClick={() => {
        if (!data.href) {
          return;
        }
        lib.jump(data.href);
      }}
    >
      {hover && <div className="mask" />}
      <img
        className="img"
        src={data.img}
        alt="img"
        style={{ height: size ? Number(size) : "auto" }}
      />
    </div>
    {children}
  </div>
);

export default ImgCard;
