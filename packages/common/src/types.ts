import type { Root, Element } from "xast";

export type SvgExt = {
  current: Root | Element;
  textMode: boolean;
};

export type YamlExt = {
  level: number;
};
