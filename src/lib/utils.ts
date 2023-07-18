import {ClassValue, clsx} from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[] ) => {
  return twMerge(clsx(inputs))
}

export function chatHrefConstructor (id1 : string, id2 : string) {
  const sortedIds = [id1, id2].sort();
  return `${sortedIds[0]}--${sortedIds[1]}`;
}

export const toPusherKey = (key : string) => {
  // replace a column with __
  return key.replace(/:/g, "__")
}