import type { Root, Element } from "xast";

export type CommonExt = {
  current: Root | Element;
  textMode: boolean;
};
